import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export const enviarAvisoPedido = async (pedido) => {
  const items = Array.isArray(pedido.items) ? pedido.items : []
  const filas = items.map((item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0d5d5;">
        ${escapeHtml(item.nombre)}<br />
        <span style="color:#8b2929;font-size:13px;">
          ${escapeHtml(item.prenda)} · talle ${escapeHtml(item.talle)} · x${escapeHtml(item.cantidad)}
        </span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f0d5d5;text-align:right;">
        $${Number(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}
      </td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#3f1010;">
      <h1 style="color:#8b2929;font-size:22px;">Nuevo pedido — Nonini Store</h1>
      <p>Llegó un pedido${pedido.cliente?.nombre ? ` de <strong>${escapeHtml(pedido.cliente.nombre)}</strong>` : ''}.</p>
      ${pedido.pedidoId ? `<p>Nº de pedido: <strong>${escapeHtml(pedido.pedidoId)}</strong></p>` : ''}
      ${pedido.cliente?.email ? `<p>Email del cliente: ${escapeHtml(pedido.cliente.email)}</p>` : ''}
      ${pedido.cliente?.telefono ? `<p>Teléfono: ${escapeHtml(pedido.cliente.telefono)}</p>` : ''}
      ${pedido.envio ? `<p>Envío: ${escapeHtml([pedido.envio.direccion, pedido.envio.ciudad, pedido.envio.provincia, pedido.envio.codigoPostal].filter(Boolean).join(', '))}</p>` : ''}
      ${pedido.metodoPago ? `<p>Pago: ${escapeHtml(pedido.metodoPago)}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${filas || '<tr><td>Sin ítems</td></tr>'}
      </table>
      <p style="font-size:18px;font-weight:700;">
        Total: $${Number(pedido.total || 0).toLocaleString('es-AR')}
      </p>
      ${pedido.notas ? `<p>Notas: ${escapeHtml(pedido.notas)}</p>` : ''}
    </div>
  `

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_PEDIDOS,
    subject: pedido.asunto || 'Nuevo pedido — Nonini Store',
    html
  })

  if (error) {
    throw new Error(error.message || 'No se pudo enviar el mail')
  }

  return data
}

export const enviarConfirmacionCliente = async (pedido) => {
  const items = Array.isArray(pedido.items) ? pedido.items : []
  const filas = items.map((item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0d5d5;">
        ${escapeHtml(item.nombre)}<br />
        <span style="color:#8b2929;font-size:13px;">
          ${escapeHtml(item.prenda)} · talle ${escapeHtml(item.talle)} · x${escapeHtml(item.cantidad)}
        </span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f0d5d5;text-align:right;">
        $${Number(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}
      </td>
    </tr>
  `).join('')

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#3f1010;">
      <h1 style="color:#8b2929;font-size:22px;">¡Gracias por tu compra!</h1>
      <p>Hola${pedido.clienteNombre ? ` <strong>${escapeHtml(pedido.clienteNombre)}</strong>` : ''}, recibimos tu pedido.</p>
      <p>Nº de pedido: <strong>${escapeHtml(pedido.codigo)}</strong></p>
      <p>Estado: <strong>Pagado</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${filas || '<tr><td>Sin ítems</td></tr>'}
      </table>
      <p style="font-size:18px;font-weight:700;">
        Total: $${Number(pedido.total || 0).toLocaleString('es-AR')}
      </p>
      ${pedido.direccion ? `<p>Lo enviamos a: ${escapeHtml([pedido.direccion, pedido.ciudad, pedido.provincia, pedido.codigoPostal].filter(Boolean).join(', '))}</p>` : ''}
      <p>Tiempo estimado de producción: 3 a 5 días hábiles, más el envío.</p>
      <p style="color:#8b2929;">Nonini Store</p>
    </div>
  `

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: pedido.clienteEmail,
    subject: `Pedido ${pedido.codigo} confirmado — Nonini Store`,
    html
  })

  if (error) {
    throw new Error(error.message || 'No se pudo enviar el mail al cliente')
  }

  return data
}
