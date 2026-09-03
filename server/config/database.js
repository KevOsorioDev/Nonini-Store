import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import mysql from 'mysql2/promise'

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
    database
  }
}

const enHostinger = () => {
  const texto = `${process.cwd()} ${process.env.HOME || ''} ${process.env.HOSTNAME || ''}`
  return /[\\/]home[\\/]u\d+[\\/]/i.test(texto) || /hstgr|hostinger/i.test(texto)
}

const etiqueta = (config) => config.socketPath || `${config.host}:${config.port || 3306}`

const leerCredenciales = () => {
  const hostPanel = process.env.DB_HOST || process.env.MYSQL_HOST
  const userPanel = process.env.DB_USER || process.env.MYSQL_USER
  const databasePanel = process.env.DB_NAME || process.env.MYSQL_DATABASE
  if (hostPanel && userPanel && databasePanel) {
    return {
      host: hostPanel,
      port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
      user: userPanel,
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
      database: databasePanel
    }
  }
  const url = process.env.DATABASE_URL || ''
  if (/^mysql/i.test(url)) return parsearDatabaseUrl(url)
  return null
}

const candidatosDe = (base) => {
  const lista = []
  const visto = new Set()
  const push = (extra) => {
    const config = {
      user: base.user,
      password: base.password,
      database: base.database,
      port: extra.port || base.port || 3306,
      ...extra
    }
    const key = etiqueta(config)
    if (visto.has(key)) return
    visto.add(key)
    lista.push(config)
  }

  if (enHostinger()) {
    if (base.host === 'localhost' || base.host === '127.0.0.1') {
      push({ host: base.host, port: base.port })
    }
    push({ host: 'localhost' })
    push({ host: '127.0.0.1' })
    push({ host: 'localhost', socketPath: '/var/lib/mysql/mysql.sock' })
    push({ host: 'localhost', socketPath: '/tmp/mysql.sock' })
    push({ host: 'localhost', socketPath: '/var/run/mysqld/mysqld.sock' })
    return lista
  }

  push({ host: base.host, port: base.port })
  return lista
}

const probarMysql = async (config) => {
  const conn = await mysql.createConnection({
    host: config.socketPath ? undefined : config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    socketPath: config.socketPath,
    connectTimeout: 3000
  })
  try {
    await conn.query('SELECT 1')
  } finally {
    await conn.end()
  }
}

const configPrisma = (config) => ({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  socketPath: config.socketPath,
  connectionLimit: 4,
  connectTimeout: 5000,
  acquireTimeout: 5000
})

export const hostDatabase = () => {
  try {
    return leerCredenciales()?.host || null
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
    host: configUsado?.host || hostDatabase(),
    via: configUsado ? etiqueta(configUsado) : null,
    intentos: error?.intentos || null
  }
}

const crearCliente = (config) => {
  if (config) {
    return new PrismaClient({ adapter: new PrismaMariaDb(configPrisma(config)), log })
  }
  return new PrismaClient({ log })
}

let cliente = null
let configUsado = null
let conexion = null
let ultimoFallo = 0
let ultimoError = null

const esPanico = (error) => {
  const texto = `${error?.name || ''} ${error?.message || ''}`
  return (
    texto.includes('PrismaClientRustPanicError') ||
    texto.includes('timer has gone away') ||
    texto.includes('PANIC:') ||
    texto.includes('pool timeout')
  )
}

const conectarMysql = async () => {
  const base = leerCredenciales()
  if (!base) {
    const local = crearCliente(null)
    await local.$connect()
    return local
  }

  const intentos = []
  for (const config of candidatosDe(base)) {
    try {
      await probarMysql(config)
      const prisma = crearCliente(config)
      await prisma.$connect()
      await prisma.$queryRaw`SELECT 1`
      configUsado = config
      return prisma
    } catch (error) {
      intentos.push({
        via: etiqueta(config),
        detalle: String(error?.message || error).split('\n')[0].slice(0, 140)
      })
    }
  }

  const error = new Error('MySQL no responde en localhost. En hPanel poné DB_HOST=localhost y DATABASE_URL con host localhost.')
  error.name = 'ErrorDb'
  error.intentos = intentos
  throw error
}

const conectarAhora = async () => {
  cliente = await conectarMysql()
  return cliente
}

export const conectarPrisma = () => {
  if (conexion) return conexion
  if (ultimoError && Date.now() - ultimoFallo < 8000) {
    return Promise.reject(ultimoError)
  }
  conexion = conectarAhora().then((ok) => {
    ultimoError = null
    return ok
  }).catch((error) => {
    conexion = null
    ultimoFallo = Date.now()
    ultimoError = error
    throw error
  })
  return conexion
}

export const recrearPrisma = async () => {
  conexion = null
  ultimoError = null
  try {
    if (cliente) await cliente.$disconnect()
  } catch {
    // el pool ya estaba cerrado
  }
  cliente = null
  configUsado = null
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
    if (!origen) {
      return (...args) => ejecutar(() => {
        const actual = obtener()
        if (!actual) throw new Error('Prisma no conectado')
        const valor = actual[prop]
        return typeof valor === 'function' ? valor.apply(actual, args) : valor
      })
    }
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
