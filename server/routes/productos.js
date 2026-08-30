import { Router } from 'express'
import { autenticarAdmin, autenticarOpcional } from '../middleware/auth.js'
import {
  listarProductos,
  buscarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock
} from '../controllers/productosController.js'

const router = Router()

router.get('/', autenticarOpcional, listarProductos)
router.get('/buscar', buscarProductos)
router.get('/:id', autenticarOpcional, obtenerProducto)
router.post('/', autenticarAdmin, crearProducto)
router.put('/:id', autenticarAdmin, actualizarProducto)
router.delete('/:id', autenticarAdmin, eliminarProducto)
router.patch('/:id/stock', autenticarAdmin, actualizarStock)

export default router
