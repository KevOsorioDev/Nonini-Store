import crypto from 'node:crypto'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const accessToken = process.env.MP_ACCESS_TOKEN || ''
const esCredencialSandbox = accessToken.startsWith('TEST-')

const client = new MercadoPagoConfig({
  accessToken
})

export const crearPreferenciaPago = async ({ pedidoId, items, cliente, accesoToken }) => {
  const frontend = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
  const preference = new Preference(client)
  const esLocal = frontend.includes('localhost') || frontend.includes('127.0.0.1')
  const tokenQuery = accesoToken ? `?t=${encodeURIComponent(accesoToken)}` : ''

  const backUrls = {
    success: `${frontend}/orden/${pedidoId}/exito${tokenQuery}`,
    failure: `${frontend}/orden/${pedidoId}/fallo${tokenQuery}`,
    pending: `${frontend}/orden/${pedidoId}/exito${tokenQuery}`
  }

  const body = {
    items: items.map((item, index) => ({
      id: String(item.productoId ?? item.id ?? index),
      title: `${item.nombre || 'Producto'} (${item.prenda || ''} ${item.talle || ''})`.trim().slice(0, 250),
      quantity: Number(item.cantidad) || 1,
      unit_price: Number(item.precio) || 0,
      currency_id: 'ARS'
    })),
    payer: {
      name: cliente?.nombre || '',
      ...(cliente?.email ? { email: cliente.email } : {})
    },
    back_urls: backUrls,
    statement_descriptor: 'NONINI',
    external_reference: String(pedidoId),
    metadata: { pedidoId }
  }

  const backend = (process.env.BACKEND_URL || '').replace(/\/$/, '')
  const backendPublico = backend && !backend.includes('localhost') && !backend.includes('127.0.0.1')
  if (backendPublico) {
    body.notification_url = `${backend}/api/pedidos/webhook-mp`
  }

  if (!esLocal) {
    body.auto_return = 'approved'
  }

  const result = await preference.create({ body })

  const initPoint = esCredencialSandbox
    ? (result.sandbox_init_point || result.init_point)
    : (result.init_point || result.sandbox_init_point)

  return {
    id: result.id,
    initPoint
  }
}

export const obtenerPagoMercadoPago = async (paymentId) => {
  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}

export const firmaWebhookValida = (req) => {
  const secreto = process.env.MP_WEBHOOK_SECRET
  if (!secreto) return true

  const xSignature = String(req.headers['x-signature'] || '')
  const xRequestId = String(req.headers['x-request-id'] || '')
  const dataId = String(req.query['data.id'] || req.body?.data?.id || '')
  const ts = xSignature.split(',').find((parte) => parte.trim().startsWith('ts='))?.split('=')[1]
  const v1 = xSignature.split(',').find((parte) => parte.trim().startsWith('v1='))?.split('=')[1]
  if (!ts || !v1 || !dataId) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const calculada = crypto.createHmac('sha256', secreto).update(manifest).digest('hex')
  return calculada === v1
}
