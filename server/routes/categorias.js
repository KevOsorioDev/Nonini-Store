import express from 'express';
import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriasController.js';
import { verificarToken, verificarRolAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);

// Rutas protegidas (solo admin con JWT)
router.post('/', verificarToken, verificarRolAdmin, crearCategoria);
router.put('/:id', verificarToken, verificarRolAdmin, actualizarCategoria);
router.delete('/:id', verificarToken, verificarRolAdmin, eliminarCategoria);

export default router;
