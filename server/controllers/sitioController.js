import { prisma } from '../config/database.js'
import { SITIO_CLAVE, mergeSitio } from '../utils/sitio.js'

const SQL_TABLA = `
  CREATE TABLE IF NOT EXISTS \`Ajuste\` (
    \`clave\` VARCHAR(191) NOT NULL,
    \`valor\` LONGTEXT NOT NULL,
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`clave\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
`

let tablaLista = false

export const asegurarTablaAjuste = async () => {
  if (tablaLista) return
  await prisma.$executeRawUnsafe(SQL_TABLA)
  tablaLista = true
}

const leerSitio = async () => {
  await asegurarTablaAjuste()
  const fila = await prisma.ajuste.findUnique({ where: { clave: SITIO_CLAVE } })
  return mergeSitio(fila?.valor)
}

export const obtenerSitio = async (_req, res) => {
  try {
    res.json(await leerSitio())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const guardarSitio = async (req, res) => {
  try {
    const actual = await leerSitio()
    const merged = mergeSitio({ ...actual, ...(req.body || {}) })
    const valor = JSON.stringify(merged)
    if (valor.length > 400000) {
      return res.status(400).json({ error: 'La configuración es demasiado grande' })
    }

    await prisma.ajuste.upsert({
      where: { clave: SITIO_CLAVE },
      create: { clave: SITIO_CLAVE, valor },
      update: { valor }
    })

    res.json(merged)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
