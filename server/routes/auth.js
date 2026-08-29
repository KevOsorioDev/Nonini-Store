import { Router } from 'express'
import { autenticar } from '../middleware/auth.js'
import {
  registro,
  login,
  perfil,
  actualizarPerfil,
  cambiarPassword
} from '../controllers/authController.js'

const router = Router()

router.post('/registro', registro)
router.post('/login', login)
router.get('/perfil', autenticar, perfil)
router.put('/perfil', autenticar, actualizarPerfil)
router.put('/cambiar-password', autenticar, cambiarPassword)

export default router
