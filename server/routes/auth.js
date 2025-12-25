import express from 'express';
import { registro, login, obtenerPerfil, cambiarPassword } from '../controllers/authController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/cambiar-password', verificarToken, cambiarPassword);

export default router;
