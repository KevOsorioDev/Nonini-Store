import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Router } from 'express'
import multer from 'multer'
import { autenticarAdmin } from '../middleware/auth.js'

const router = Router()
const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.png'
    const seguro = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.png'
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${seguro}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      cb(null, true)
      return
    }
    cb(new Error('Solo se permiten imágenes'))
  }
})

router.post('/', autenticarAdmin, (req, res) => {
  upload.single('archivo')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió el archivo' })
    }
    res.json({ url: `/uploads/${req.file.filename}` })
  })
})

export default router
