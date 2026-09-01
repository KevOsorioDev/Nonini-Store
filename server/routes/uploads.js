import { Router } from 'express'
import multer from 'multer'
import { autenticarAdmin } from '../middleware/auth.js'
import { prisma } from '../config/database.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) {
      cb(null, true)
      return
    }
    cb(new Error('Solo se permiten imágenes'))
  }
})

router.get('/:id', async (req, res) => {
  try {
    const archivo = await prisma.archivo.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!archivo) {
      return res.status(404).json({ error: 'Archivo no encontrado' })
    }
    res.setHeader('Content-Type', archivo.mime || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(Buffer.from(archivo.datos))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', autenticarAdmin, (req, res) => {
  upload.single('archivo')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió el archivo' })
    }
    try {
      const archivo = await prisma.archivo.create({
        data: {
          nombre: req.file.originalname || 'imagen',
          mime: req.file.mimetype || 'image/png',
          datos: req.file.buffer
        }
      })
      res.json({ url: `/api/uploads/${archivo.id}` })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })
})

export default router

