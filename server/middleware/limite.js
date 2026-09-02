const intentos = new Map()

export const limitarIntentos = (maximo = 8, ventanaMs = 15 * 60 * 1000) => (req, res, next) => {
  const ip = String(req.ip || req.headers['x-forwarded-for'] || 'desconocido').split(',')[0].trim()
  const ahora = Date.now()
  const lista = (intentos.get(ip) || []).filter((t) => ahora - t < ventanaMs)
  if (lista.length >= maximo) {
    return res.status(429).json({ error: 'Demasiados intentos. Probá en unos minutos.' })
  }
  lista.push(ahora)
  intentos.set(ip, lista)
  next()
}
