import { Router } from 'express'
import { autenticar, autenticarAdmin, autenticarOpcional } from '../middleware/auth.js'
import {
  pagarMercadoPago,
  webhookMercadoPago,
  confirmarPago,
  obtenerPedido,
  obtenerMisPedidos,
  obtenerPedidosAdmin,
  actualizarEstado
} from '../controllers/pedidosController.js'

const router = Router()

router.post('/pagar-mp', autenticarOpcional, pagarMercadoPago)
router.post('/webhook-mp', webhookMercadoPago)
router.get('/webhook-mp', webhookMercadoPago)
router.get('/mios', autenticar, obtenerMisPedidos)
router.get('/admin', autenticarAdmin, obtenerPedidosAdmin)
router.post('/:codigo/confirmar', confirmarPago)
router.patch('/:codigo/estado', autenticarAdmin, actualizarEstado)
router.get('/:codigo', obtenerPedido)

export default router
