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
app.use(express.json())
app.use('/api', api)

api.get('/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'nonini-store-backend' })
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
    const [{ default: authRoutes }, { default: pedidosRoutes }, { prisma }, bcryptMod] = await Promise.all([
      import('./routes/auth.js'),
      import('./routes/pedidos.js'),
      import('./config/database.js'),
      import('bcryptjs')
    ])
    const bcrypt = bcryptMod.default || bcryptMod

    api.use('/auth', authRoutes)
    api.use('/pedidos', pedidosRoutes)
    await prisma.$connect()

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
  }
}
