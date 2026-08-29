import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database.js'

const usuarioPublico = (usuario) => ({
  id: usuario.id,
  email: usuario.email,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  telefono: usuario.telefono,
  rol: usuario.rol
})

const firmarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

export const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body || {}
    if (!nombre?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const emailNormalizado = email.trim().toLowerCase()
    const existe = await prisma.usuario.findUnique({ where: { email: emailNormalizado } })
    if (existe) {
      return res.status(409).json({ error: 'Este email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        email: emailNormalizado,
        password: hash
      }
    })

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token: firmarToken(usuario),
      usuario: usuarioPublico(usuario)
    })
  } catch {
    res.status(500).json({ error: 'No se pudo crear la cuenta' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() }
    })
    if (!usuario) {
      return res.status(401).json({ error: 'No existe una cuenta con este email' })
    }

    const ok = await bcrypt.compare(password, usuario.password)
    if (!ok) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    res.json({
      mensaje: 'Login exitoso',
      token: firmarToken(usuario),
      usuario: usuarioPublico(usuario)
    })
  } catch {
    res.status(500).json({ error: 'No se pudo iniciar sesión' })
  }
}

export const perfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } })
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json({ usuario: usuarioPublico(usuario) })
  } catch {
    res.status(500).json({ error: 'No se pudo obtener el perfil' })
  }
}

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body || {}
    const usuario = await prisma.usuario.update({
      where: { id: req.usuarioId },
      data: {
        ...(nombre !== undefined ? { nombre: String(nombre).trim() } : {}),
        ...(apellido !== undefined ? { apellido: String(apellido).trim() } : {}),
        ...(telefono !== undefined ? { telefono: String(telefono).trim() } : {})
      }
    })
    res.json({ usuario: usuarioPublico(usuario) })
  } catch {
    res.status(500).json({ error: 'No se pudo actualizar el perfil' })
  }
}

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body || {}
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ error: 'Completá ambos campos' })
    }
    if (passwordNueva.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } })
    const ok = await bcrypt.compare(passwordActual, usuario.password)
    if (!ok) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' })
    }

    const hash = await bcrypt.hash(passwordNueva, 10)
    await prisma.usuario.update({
      where: { id: req.usuarioId },
      data: { password: hash }
    })
    res.json({ mensaje: 'Contraseña actualizada' })
  } catch {
    res.status(500).json({ error: 'No se pudo cambiar la contraseña' })
  }
}
