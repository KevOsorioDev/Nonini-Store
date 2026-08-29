import 'dotenv/config'
import { enviarAvisoPedido } from '../config/email.js'

const pedidoPrueba = {
  asunto: 'Prueba Nonini Store — aviso de pedido',
  total: 14000,
  cliente: {
    nombre: 'Pedido de prueba',
    email: 'kevin.oss02@gmail.com'
  },
  items: [
    {
      nombre: 'Logo Scoty',
      prenda: 'Buzo',
      talle: 'M',
      cantidad: 1,
      precio: 7000
    },
    {
      nombre: 'Marisol Bordado',
      prenda: 'Remera',
      talle: 'L',
      cantidad: 1,
      precio: 7000
    }
  ]
}

try {
  const data = await enviarAvisoPedido(pedidoPrueba)
  console.log('Mail enviado. Id:', data?.id)
  console.log('Revisá la casilla de EMAIL_PEDIDOS (también spam).')
} catch (error) {
  console.error('Falló el envío:', error.message)
  process.exit(1)
}
