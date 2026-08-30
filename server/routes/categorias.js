import { Router } from 'express'
import { autenticarAdmin } from '../middleware/auth.js'
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriasController.js'

const router = Router()

router.get('/', listarCategorias)
router.post('/', autenticarAdmin, crearCategoria)
router.put('/:id', autenticarAdmin, actualizarCategoria)
router.delete('/:id', autenticarAdmin, eliminarCategoria)

export default router
