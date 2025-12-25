import express from 'express';
import {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  obtenerTodasLasOrdenes,
  actualizarEstadoOrden,
  confirmarPagoTransferencia,
  crearPagoMercadoPago,
  webhookMercadoPago
} from '../controllers/ordenesController.js';
import { verificarToken, verificarRolAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarToken, crearOrden);
router.get('/', verificarToken, obtenerOrdenes);
router.get('/admin/todas', verificarToken, verificarRolAdmin, obtenerTodasLasOrdenes);
router.get('/:id', verificarToken, obtenerOrdenPorId);
router.patch('/:id/estado', verificarToken, verificarRolAdmin, actualizarEstadoOrden);
router.post('/:id/confirmar-pago', verificarToken, verificarRolAdmin, confirmarPagoTransferencia);

router.post('/pago/mercadopago', verificarToken, crearPagoMercadoPago);
router.post('/webhook/mercadopago', webhookMercadoPago);

export default router;
