import { Router } from 'express'
import { autenticar } from '../middleware/auth.js'
import { limitarIntentos } from '../middleware/limite.js'
import {
  registro,
  login,
  perfil,
  actualizarPerfil,
  cambiarPassword
} from '../controllers/authController.js'

const router = Router()

router.post('/registro', limitarIntentos(), registro)
router.post('/login', limitarIntentos(), login)
router.get('/perfil', autenticar, perfil)
router.put('/perfil', autenticar, actualizarPerfil)
router.put('/cambiar-password', autenticar, cambiarPassword)

export default router
