import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const log = process.env.DEBUG_PRISMA ? ['query', 'error', 'warn'] : ['error']

const parsearDatabaseUrl = (url) => {
  if (!url) throw new Error('Falta DATABASE_URL')
  const u = new URL(url)
  const database = decodeURIComponent((u.pathname || '').replace(/^\//, '').split('?')[0])
  if (!u.hostname || !database) throw new Error('DATABASE_URL incompleta')
  return {
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
    database,
    connectionLimit: 5,
    connectTimeout: 20000,
    acquireTimeout: 20000
  }
}

export const hostDatabase = () => {
  try {
    const url = process.env.DATABASE_URL || ''
    if (url.startsWith('file:')) return 'sqlite'
    return parsearDatabaseUrl(url).host
  } catch {
    return null
  }
}

export const resumenErrorDb = (error) => {
  const bruto = String(error?.message || error || '')
  const limpio = bruto
    .replace(/mysql:\/\/[^@\s]+@/gi, 'mysql://***@')
    .replace(/https?:\/\/\S+/g, '')
  const linea = limpio.split('\n').map((parte) => parte.trim()).find(Boolean) || 'Error de base de datos'
  return {
    codigo: error?.errorCode || error?.code || error?.name || 'DB',
    detalle: linea.slice(0, 180),
    host: hostDatabase()
  }
}

let ipSalienteCache = null
export const ipSaliente = async () => {
  if (ipSalienteCache) return ipSalienteCache
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch('https://api.ipify.org?format=json', { signal: ctrl.signal })
    clearTimeout(timer)
    const data = await res.json()
    ipSalienteCache = data.ip || null
    return ipSalienteCache
  } catch {
    return null
  }
}

ipSaliente().catch(() => {})

const crearCliente = () => {
  const url = process.env.DATABASE_URL || ''
  if (/^mysql/i.test(url)) {
    return new PrismaClient({
      adapter: new PrismaMariaDb(parsearDatabaseUrl(url)),
      log
    })
  }
  return new PrismaClient({ log })
}

let cliente = crearCliente()
let conexion = null

const esPanico = (error) => {
  const texto = `${error?.name || ''} ${error?.message || ''}`
  return (
    texto.includes('PrismaClientRustPanicError') ||
    texto.includes('timer has gone away') ||
    texto.includes('PANIC:')
  )
}

const conectarAhora = async () => {
  await cliente.$connect()
  return cliente
}

export const conectarPrisma = () => {
  if (!conexion) {
    conexion = conectarAhora().catch((error) => {
      conexion = null
      throw error
    })
  }
  return conexion
}

export const recrearPrisma = async () => {
  conexion = null
  try {
    await cliente.$disconnect()
  } catch {
    // el pool ya estaba cerrado
  }
  cliente = crearCliente()
  return conectarPrisma()
}

const ejecutar = async (fn) => {
  await conectarPrisma()
  try {
    return await fn()
  } catch (error) {
    if (!esPanico(error)) throw error
    await recrearPrisma()
    return fn()
  }
}

const proxyDe = (obtener) => new Proxy({}, {
  get(_destino, prop) {
    if (prop === 'then' || prop === '$$typeof') return undefined
    const origen = obtener()
    const valor = origen[prop]
    if (typeof valor === 'function') {
      return (...args) => ejecutar(() => obtener()[prop].apply(obtener(), args))
    }
    if (valor && typeof valor === 'object') {
      return proxyDe(() => obtener()[prop])
    }
    return valor
  }
})

export const prisma = proxyDe(() => cliente)
