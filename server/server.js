import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const api = express.Router()
const enProduccion = process.env.NODE_ENV === 'production'
const distPath = path.join(__dirname, '..', 'dist')
const uploadsPath = path.join(__dirname, 'uploads')

const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.set('trust proxy', 1)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true)
      return
    }
    callback(null, false)
  }
}))
app.use(express.json({ limit: '8mb' }))
app.use('/uploads', express.static(uploadsPath))
app.use('/api', api)

api.get('/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'nonini-store-backend' })
})

let marcarApiLista
const apiLista = new Promise((resolve) => {
  marcarApiLista = resolve
})

api.use(async (req, res, next) => {
  try {
    await apiLista
    const { conectarPrisma } = await import('./config/database.js')
    await conectarPrisma()
    next()
  } catch (error) {
    const { resumenErrorDb } = await import('./config/database.js')
    const resumen = resumenErrorDb(error)
    console.error('Prisma no disponible:', resumen)
    res.status(503).json({
      error: 'Base de datos no disponible',
      ...resumen,
      aviso: 'En hPanel poné DB_HOST=localhost y DATABASE_URL con host localhost. No uses srv801.hstgr.io desde Node.'
    })
  }
})

if (enProduccion) {
  app.use(express.static(distPath))
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'No encontrado' })
      return
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

export { app }

export async function afterListen() {
  try {
    const [
      { default: authRoutes },
      { default: pedidosRoutes },
      { default: productosRoutes },
      { default: categoriasRoutes },
      { default: uploadsRoutes },
      { prisma, conectarPrisma },
      bcryptMod
    ] = await Promise.all([
      import('./routes/auth.js'),
      import('./routes/pedidos.js'),
      import('./routes/productos.js'),
      import('./routes/categorias.js'),
      import('./routes/uploads.js'),
      import('./config/database.js'),
      import('bcryptjs')
    ])
    const bcrypt = bcryptMod.default || bcryptMod

    api.use('/auth', authRoutes)
    api.use('/pedidos', pedidosRoutes)
    api.use('/productos', productosRoutes)
    api.use('/categorias', categoriasRoutes)
    api.use('/uploads', uploadsRoutes)
    marcarApiLista()
    await conectarPrisma()

    const hayCategorias = await prisma.categoria.count()
    if (hayCategorias === 0) {
      await prisma.categoria.createMany({
        data: [
          { nombre: 'Nike', slug: 'nike' },
          { nombre: 'Mascotas', slug: 'mascotas' },
          { nombre: 'Disney/Pixar', slug: 'disney-pixar' }
        ]
      })
    }

    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD || ''
    if (!email) return

    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) {
      if (existente.rol !== 'admin') {
        await prisma.usuario.update({ where: { id: existente.id }, data: { rol: 'admin' } })
      }
      return
    }

    if (password.length < 8) return

    await prisma.usuario.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        nombre: process.env.ADMIN_NOMBRE || 'Admin Nonini',
        rol: 'admin'
      }
    })
  } catch (error) {
    console.error('Prisma/admin después del listen:', error)
    marcarApiLista()
  }
}
