import { Router } from 'express'
import { autenticarAdmin } from '../middleware/auth.js'
import { obtenerSitio, guardarSitio } from '../controllers/sitioController.js'

const router = Router()

router.get('/', obtenerSitio)
router.put('/', autenticarAdmin, guardarSitio)

export default router
