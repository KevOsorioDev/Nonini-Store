import prisma from '../config/database.js';
import { preference, payment } from '../config/mercadopago.js';

export const crearOrden = async (req, res) => {
  try {
    const { 
      items, 
      metodoPago,
      direccionEnvio,
      ciudadEnvio,
      codigoPostal,
      provinciaEnvio,
      telefonoContacto,
      notasEnvio
    } = req.body;
    const usuarioId = req.usuario.id;

    // Validaciones
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe tener al menos un producto' });
    }

    if (!metodoPago) {
      return res.status(400).json({ error: 'Debe especificar un método de pago' });
    }

    // Validar datos de envío si el método no es retiro en local
    if (metodoPago !== 'retiro_local') {
      if (!direccionEnvio || !ciudadEnvio || !provinciaEnvio || !telefonoContacto) {
        return res.status(400).json({ 
          error: 'Debe proporcionar dirección de envío completa' 
        });
      }
    }

    let total = 0;
    const ordenItems = [];

    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId }
      });

      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
      }

      const subtotal = parseFloat(producto.precio) * item.cantidad;
      total += subtotal;

      ordenItems.push({
        productoId: item.productoId,
        prenda: item.prenda,
        talle: item.talle,
        color: item.color,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });
    }

    const orden = await prisma.orden.create({
      data: {
        usuarioId,
        total,
        estado: metodoPago === 'transferencia_bancaria' ? 'pendiente_confirmacion' : 'pendiente',
        metodoPago,
        direccionEnvio,
        ciudadEnvio,
        codigoPostal,
        provinciaEnvio,
        telefonoContacto,
        notasEnvio,
        items: {
          create: ordenItems
        }
      },
      include: {
        items: {
          include: {
            producto: true
          }
        }
      }
    });

    console.log('✅ Orden creada:', orden.id, '- Método:', metodoPago);
    res.status(201).json(orden);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden', detalle: error.message });
  }
};

export const obtenerOrdenes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const ordenes = await prisma.orden.findMany({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes', detalle: error.message });
  }
};

export const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const orden = await prisma.orden.findFirst({
      where: {
        id: parseInt(id),
        usuarioId
      },
      include: {
        items: {
          include: {
            producto: true
          }
        },
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true
          }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden', detalle: error.message });
  }
};

export const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    const { estado } = req.query;
    
    const where = {};
    if (estado) where.estado = estado;

    const ordenes = await prisma.orden.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true
          }
        },
        items: {
          include: {
            producto: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes', detalle: error.message });
  }
};

export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const orden = await prisma.orden.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: {
        items: {
          include: {
            producto: true
          }
        }
      }
    });

    console.log('✅ Estado de orden actualizado:', id, '→', estado);
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de orden', detalle: error.message });
  }
};

// Confirmar pago de transferencia bancaria (solo admin)
export const confirmarPagoTransferencia = async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await prisma.orden.findUnique({
      where: { id: parseInt(id) }
    });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (orden.metodoPago !== 'transferencia_bancaria') {
      return res.status(400).json({ 
        error: 'Esta orden no es de transferencia bancaria' 
      });
    }

    const ordenActualizada = await prisma.orden.update({
      where: { id: parseInt(id) },
      data: { estado: 'pagado' },
      include: {
        items: {
          include: {
            producto: true
          }
        },
        usuario: true
      }
    });

    console.log('✅ Pago de transferencia confirmado para orden:', id);
    res.json(ordenActualizada);
  } catch (error) {
    console.error('Error al confirmar pago:', error);
    res.status(500).json({ error: 'Error al confirmar pago', detalle: error.message });
  }
};



export const crearPagoMercadoPago = async (req, res) => {
  try {
    const { ordenId } = req.body;

    const orden = await prisma.orden.findUnique({
      where: { id: parseInt(ordenId) },
      include: {
        items: {
          include: {
            producto: true
          }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const preferenceData = {
      items: orden.items.map(item => ({
        title: item.producto.nombre,
        unit_price: parseFloat(item.precioUnitario),
        quantity: item.cantidad,
      })),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/orden/${orden.id}/exito`,
        failure: `${process.env.FRONTEND_URL}/orden/${orden.id}/fallo`,
        pending: `${process.env.FRONTEND_URL}/orden/${orden.id}/pendiente`
      },
      auto_return: 'approved',
      external_reference: orden.id.toString(),
    };

    const response = await preference.create({ body: preferenceData });

    await prisma.orden.update({
      where: { id: orden.id },
      data: { mpPaymentId: response.id }
    });

    res.json({
      preferenceId: response.id,
      initPoint: response.init_point
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pago MercadoPago', detalle: error.message });
  }
};



export const webhookMercadoPago = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('📩 Webhook MercadoPago recibido:', type, data);

    if (type === 'payment') {
      const paymentData = await payment.get({ id: data.id });
      const ordenId = parseInt(paymentData.external_reference);

      console.log('💳 Datos de pago:', {
        ordenId,
        status: paymentData.status,
        statusDetail: paymentData.status_detail,
        paymentType: paymentData.payment_type_id
      });

      // Actualizar orden con datos del pago
      const updateData = {
        mpStatus: paymentData.status,
        mpStatusDetail: paymentData.status_detail
      };

      if (paymentData.status === 'approved') {
        updateData.estado = 'pagado';
        console.log('✅ Pago aprobado para orden:', ordenId);
      } else if (paymentData.status === 'rejected') {
        updateData.estado = 'pago_rechazado';
        console.log('❌ Pago rechazado para orden:', ordenId);
      } else if (paymentData.status === 'in_process') {
        updateData.estado = 'pago_en_proceso';
        console.log('⏳ Pago en proceso para orden:', ordenId);
      }

      await prisma.orden.update({
        where: { id: ordenId },
        data: updateData
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ error: 'Webhook error', detalle: error.message });
  }
};
