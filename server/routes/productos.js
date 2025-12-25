import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock
} from '../controllers/productosController.js';
import { verificarToken, verificarRolAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas admin - Requieren token JWT + rol admin
router.post('/', verificarToken, verificarRolAdmin, upload.single('imagen'), crearProducto);
router.put('/:id', verificarToken, verificarRolAdmin, upload.single('imagen'), actualizarProducto);
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarProducto);
router.patch('/stock', verificarToken, verificarRolAdmin, actualizarStock);

export default router;
