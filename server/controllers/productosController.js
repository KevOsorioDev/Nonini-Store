import { prisma } from '../config/database.js'

const serializarProducto = (producto) => {
  if (!producto) return null
  const imagenUrl = producto.imagenUrl || producto.disenoUrl || null
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    activo: producto.activo,
    imagenUrl,
    disenoUrl: producto.disenoUrl || imagenUrl,
    imagen: imagenUrl,
    disenoConfig: producto.disenoConfig || null,
    talles: Array.isArray(producto.talles) ? producto.talles : [],
    categoriaId: producto.categoriaId,
    categoria: producto.categoria || null
  }
}

const armarDatos = (body) => {
  const nombre = String(body?.nombre || '').trim()
  const precio = Number(body?.precio)
  if (!nombre) throw new Error('El nombre es obligatorio')
  if (!Number.isFinite(precio) || precio < 0) throw new Error('El precio no es válido')

  const categoriaId = body?.categoriaId != null && body.categoriaId !== ''
    ? Number(body.categoriaId)
    : null

  return {
    nombre,
    descripcion: body?.descripcion ? String(body.descripcion).trim() : null,
    precio,
    activo: body?.activo !== false,
    imagenUrl: body?.imagenUrl || null,
    disenoUrl: body?.disenoUrl || body?.imagenUrl || null,
    disenoConfig: body?.disenoConfig || undefined,
    talles: Array.isArray(body?.talles) ? body.talles : undefined,
    categoriaId: Number.isInteger(categoriaId) && categoriaId > 0 ? categoriaId : null
  }
}

export const listarProductos = async (req, res) => {
  try {
    const soloActivos = req.usuarioRol !== 'admin'
    const productos = await prisma.producto.findMany({
      where: soloActivos ? { activo: true } : {},
      include: { categoria: true },
      orderBy: { id: 'desc' }
    })
    res.json(productos.map(serializarProducto))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const buscarProductos = async (req, res) => {
  try {
    const q = String(req.query?.q || '').trim()
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        ...(q
          ? {
              OR: [
                { nombre: { contains: q } },
                { descripcion: { contains: q } }
              ]
            }
          : {})
      },
      include: { categoria: true },
      orderBy: { nombre: 'asc' }
    })
    res.json(productos.map(serializarProducto))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const obtenerProducto = async (req, res) => {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: Number(req.params.id) },
      include: { categoria: true }
    })
    if (!producto || (!producto.activo && req.usuarioRol !== 'admin')) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(serializarProducto(producto))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const crearProducto = async (req, res) => {
  try {
    const data = armarDatos(req.body)
    const producto = await prisma.producto.create({
      data,
      include: { categoria: true }
    })
    res.status(201).json(serializarProducto(producto))
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Esa categoría no existe. Creala en Categorías.' })
    }
    res.status(400).json({ error: error.message })
  }
}

export const actualizarProducto = async (req, res) => {
  try {
    const existente = await prisma.producto.findUnique({ where: { id: Number(req.params.id) } })
    if (!existente) return res.status(404).json({ error: 'Producto no encontrado' })
    const data = armarDatos({
      ...existente,
      ...req.body,
      nombre: req.body?.nombre ?? existente.nombre,
      precio: req.body?.precio ?? existente.precio
    })
    const producto = await prisma.producto.update({
      where: { id: existente.id },
      data,
      include: { categoria: true }
    })
    res.json(serializarProducto(producto))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const eliminarProducto = async (req, res) => {
  try {
    await prisma.producto.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Producto no encontrado' })
    res.status(500).json({ error: error.message })
  }
}

export const actualizarStock = async (req, res) => {
  try {
    const producto = await prisma.producto.findUnique({ where: { id: Number(req.params.id) } })
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
    const talles = Array.isArray(req.body) ? req.body : req.body?.talles
    const actualizado = await prisma.producto.update({
      where: { id: producto.id },
      data: { talles },
      include: { categoria: true }
    })
    res.json(serializarProducto(actualizado))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
