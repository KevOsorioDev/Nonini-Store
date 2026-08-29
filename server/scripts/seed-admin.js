import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/database.js'

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD || ''
const nombre = (process.env.ADMIN_NOMBRE || 'Admin Nonini').trim()

if (!email) {
  console.error('Definí ADMIN_EMAIL en server/.env')
  process.exit(1)
}

const existente = await prisma.usuario.findUnique({ where: { email } })

if (existente) {
  const data = { rol: 'admin' }
  if (process.env.ADMIN_RESET_PASSWORD === 'true') {
    if (!password || password.length < 8) {
      console.error('Para resetear la clave, ADMIN_PASSWORD debe tener 8+ caracteres')
      process.exit(1)
    }
    data.password = await bcrypt.hash(password, 10)
  }
  await prisma.usuario.update({ where: { id: existente.id }, data })
  console.log(`Admin: ${email}`)
  process.exit(0)
}

if (!password || password.length < 8) {
  console.error('Esa cuenta no existe. Definí ADMIN_PASSWORD (8+ caracteres) para crearla')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 10)
await prisma.usuario.create({
  data: {
    email,
    password: hash,
    nombre,
    rol: 'admin'
  }
})

console.log(`Admin creado: ${email}`)
process.exit(0)
