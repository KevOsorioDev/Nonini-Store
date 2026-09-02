import { prisma } from '../config/database.js'
import { enviarAvisoPedido, enviarConfirmacionCliente } from '../config/email.js'
import { crearPreferenciaPago, obtenerPagoMercadoPago, firmaWebhookValida } from '../config/mercadopago.js'
import { nuevaClave } from '../utils/claves.js'

const logoSeguro = (url) => {
  if (!url || typeof url !== 'string') return null
  if (url.startsWith('data:')) return null
  return url.slice(0, 500)
}

const serializarPedido = (pedido) => {
  if (!pedido) return null
  return {
    id: pedido.id,
    codigo: pedido.codigo,
    estado: pedido.estado,
    total: pedido.total,
    metodoPago: pedido.metodoPago,
    createdAt: pedido.createdAt,
    mpPaymentId: pedido.mpPaymentId,
    clienteNombre: pedido.clienteNombre,
    clienteEmail: pedido.clienteEmail,
    usuario: {
      nombre: pedido.clienteNombre,
      email: pedido.clienteEmail
    },
    envio: {
      direccion: pedido.direccion,
      ciudad: pedido.ciudad,
      provincia: pedido.provincia,
      codigoPostal: pedido.codigoPostal
    },
    items: (pedido.items || []).map((item) => ({
      nombre: item.nombre,
      prenda: item.prenda,
      talle: item.talle,
      cantidad: item.cantidad,
      precio: item.precio,
      precioUnitario: item.precio,
      producto: {
        nombre: item.nombre,
        imagenUrl: item.logoUrl
      }
    }))
  }
}

const puedeVerPedido = (req, pedido) => {
  const token = String(req.query?.t || req.query?.token || req.body?.token || req.body?.accesoToken || '')
  if (req.usuarioRol === 'admin') return true
  if (req.usuarioId && pedido.usuarioId === req.usuarioId) return true
  if (pedido.accesoToken && token && token === pedido.accesoToken) return true
  return false
}

const buscarPedido = (codigoOId) => {
  const idNumerico = Number(codigoOId)
  return prisma.pedido.findFirst({
    where: Number.isInteger(idNumerico) && String(idNumerico) === String(codigoOId)
      ? { OR: [{ id: idNumerico }, { codigo: String(codigoOId) }] }
      : { codigo: String(codigoOId) },
    include: { items: true, usuario: true }
  })
}

const marcarPagadoYAvisar = async (pedido, paymentId) => {
  if (pedido.estado === 'pagado' && pedido.emailClienteEnviado) {
    return pedido
  }

  const actualizado = await prisma.pedido.update({
    where: { id: pedido.id },
    data: {
      estado: 'pagado',
      ...(paymentId ? { mpPaymentId: String(paymentId) } : {})
    },
    include: { items: true }
  })

  if (!actualizado.emailClienteEnviado && actualizado.clienteEmail) {
    try {
      await enviarConfirmacionCliente({
        codigo: actualizado.codigo,
        clienteNombre: actualizado.clienteNombre,
        clienteEmail: actualizado.clienteEmail,
        total: actualizado.total,
        direccion: actualizado.direccion,
        ciudad: actualizado.ciudad,
        provincia: actualizado.provincia,
        codigoPostal: actualizado.codigoPostal,
        items: actualizado.items
      })
      await prisma.pedido.update({
        where: { id: actualizado.id },
        data: { emailClienteEnviado: true }
      })
      actualizado.emailClienteEnviado = true
    } catch (error) {
      console.error('Mail al cliente falló:', error.message)
    }
  }

  return actualizado
}

export const pagarMercadoPago = async (req, res) => {
  try {
    const { items, cliente, envio, notas } = req.body || {}
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'El pedido no tiene productos' })
    }
    if (!cliente?.email || !cliente?.nombre) {
      return res.status(400).json({ ok: false, error: 'Faltan nombre o email' })
    }

    const codigo = `NS-${Date.now().toString(36).toUpperCase()}`
    const accesoToken = nuevaClave()
    const total = items.reduce(
      (sum, item) => sum + Number(item.precio || 0) * Number(item.cantidad || 1),
      0
    )

    const pedido = await prisma.pedido.create({
      data: {
        codigo,
        accesoToken,
        usuarioId: req.usuarioId || null,
        estado: 'pendiente',
        total,
        metodoPago: 'mercadopago',
        clienteNombre: String(cliente.nombre).trim(),
        clienteEmail: String(cliente.email).trim().toLowerCase(),
        clienteTelefono: cliente.telefono ? String(cliente.telefono).trim() : null,
        direccion: envio?.direccion ? String(envio.direccion).trim() : null,
        ciudad: envio?.ciudad ? String(envio.ciudad).trim() : null,
        provincia: envio?.provincia ? String(envio.provincia).trim() : null,
        codigoPostal: envio?.codigoPostal ? String(envio.codigoPostal).trim() : null,
        notas: notas ? String(notas).trim() : null,
        items: {
          create: items.map((item) => ({
            productoId: item.productoId != null ? String(item.productoId) : null,
            nombre: item.nombre || 'Producto',
            prenda: item.prenda || null,
            talle: item.talle || null,
            color: item.color || null,
            cantidad: Number(item.cantidad) || 1,
            precio: Number(item.precio) || 0,
            logoUrl: logoSeguro(item.logoUrl)
          }))
        }
      },
      include: { items: true }
    })

    const preferencia = await crearPreferenciaPago({
      pedidoId: pedido.codigo,
      accesoToken,
      items,
      cliente
    })

    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { mpPreferenceId: preferencia.id }
    })

    enviarAvisoPedido({
      pedidoId: pedido.codigo,
      asunto: `Pedido ${pedido.codigo} — pendiente de Mercado Pago`,
      total,
      metodoPago: 'Mercado Pago (pendiente)',
      cliente,
      envio,
      notas,
      items
    }).catch((error) => {
      console.error('Mail del pedido (tienda) falló:', error.message)
    })

    res.json({
      ok: true,
      pedidoId: pedido.codigo,
      accesoToken,
      initPoint: preferencia.initPoint
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

const aplicarPagoMp = async (paymentId) => {
  const pago = await obtenerPagoMercadoPago(paymentId)
  const codigo = pago?.external_reference
  if (!codigo) return null

  const pedido = await prisma.pedido.findUnique({
    where: { codigo: String(codigo) },
    include: { items: true }
  })
  if (!pedido) return null

  const status = pago.status
  if (status === 'approved') {
    return marcarPagadoYAvisar(pedido, pago.id)
  }
  if (status === 'rejected' || status === 'cancelled') {
    return prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        estado: 'fallido',
        mpPaymentId: String(pago.id)
      },
      include: { items: true }
    })
  }
  return pedido
}

export const webhookMercadoPago = async (req, res) => {
  try {
    if (!firmaWebhookValida(req)) {
      return res.sendStatus(401)
    }
    const tipo = String(req.body?.type || req.query?.topic || req.body?.action || '')
    const paymentId = req.body?.data?.id || req.body?.id || (tipo.includes('merchant_order') ? null : req.query?.id)
    if (paymentId) {
      await aplicarPagoMp(paymentId)
    }
    res.sendStatus(200)
  } catch (error) {
    console.error('Webhook MP:', error.message)
    res.sendStatus(200)
  }
}

export const confirmarPago = async (req, res) => {
  try {
    const { codigo } = req.params
    const paymentId = req.body?.paymentId || req.query?.payment_id || req.query?.collection_id
    const pedido = await buscarPedido(codigo)
    if (!pedido || !puedeVerPedido(req, pedido)) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    if (paymentId) {
      const actualizado = await aplicarPagoMp(paymentId)
      if (actualizado) {
        return res.json({ pedido: serializarPedido(actualizado) })
      }
    }

    res.json({ pedido: serializarPedido(pedido) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await buscarPedido(req.params.codigo)
    if (!pedido || !puedeVerPedido(req, pedido)) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(serializarPedido(pedido))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerMisPedidos = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } })
    const pedidos = await prisma.pedido.findMany({
      where: {
        OR: [
          { usuarioId: req.usuarioId },
          ...(usuario?.email ? [{ clienteEmail: usuario.email }] : [])
        ]
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(pedidos.map(serializarPedido))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { items: true, usuario: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(pedidos.map(serializarPedido))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const actualizarEstado = async (req, res) => {
  try {
    const estados = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado', 'fallido']
    const estado = String(req.body?.estado || '')
    if (!estados.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const pedido = await buscarPedido(req.params.codigo)
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    const actualizado = await prisma.pedido.update({
      where: { id: pedido.id },
      data: { estado },
      include: { items: true }
    })
    res.json(serializarPedido(actualizado))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
