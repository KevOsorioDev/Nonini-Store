import jwt from 'jsonwebtoken'

const leerToken = (req) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  return jwt.verify(header.slice(7), process.env.JWT_SECRET)
}

export const autenticar = (req, res, next) => {
  try {
    const payload = leerToken(req)
    if (!payload) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    req.usuarioId = payload.id
    req.usuarioRol = payload.rol
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

export const autenticarOpcional = (req, _res, next) => {
  try {
    const payload = leerToken(req)
    if (payload) {
      req.usuarioId = payload.id
      req.usuarioRol = payload.rol
    }
  } catch {
    /* invitado */
  }
  next()
}

export const autenticarAdmin = (req, res, next) => {
  autenticar(req, res, () => {
    if (req.usuarioRol !== 'admin') {
      return res.status(403).json({ error: 'Se necesita una cuenta admin' })
    }
    next()
  })
}
