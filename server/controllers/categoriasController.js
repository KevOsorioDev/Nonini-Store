import { prisma } from '../config/database.js'

const slugify = (texto) =>
  String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

export const listarCategorias = async (_req, res) => {
  try {
    if ((await prisma.categoria.count()) === 0) {
      await prisma.categoria.createMany({
        data: [
          { nombre: 'Nike', slug: 'nike' },
          { nombre: 'Mascotas', slug: 'mascotas' },
          { nombre: 'Disney/Pixar', slug: 'disney-pixar' }
        ]
      })
    }
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
      include: { _count: { select: { productos: true } } }
    })
    res.json(categorias.map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
      slug: categoria.slug,
      productos: categoria._count.productos
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const crearCategoria = async (req, res) => {
  try {
    const nombre = String(req.body?.nombre || '').trim()
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })
    const slug = slugify(req.body?.slug || nombre)
    const categoria = await prisma.categoria.create({ data: { nombre, slug } })
    res.status(201).json(categoria)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese slug' })
    }
    res.status(500).json({ error: error.message })
  }
}

export const actualizarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const data = {}
    if (req.body?.nombre !== undefined) data.nombre = String(req.body.nombre).trim()
    if (req.body?.slug !== undefined) data.slug = slugify(req.body.slug)
    const categoria = await prisma.categoria.update({ where: { id }, data })
    res.json(categoria)
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Categoría no encontrada' })
    if (error.code === 'P2002') return res.status(409).json({ error: 'Ya existe una categoría con ese slug' })
    res.status(500).json({ error: error.message })
  }
}

export const eliminarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const cantidad = await prisma.producto.count({ where: { categoriaId: id } })
    if (cantidad > 0) {
      return res.status(400).json({ error: 'No se puede borrar: hay productos en esta categoría' })
    }
    await prisma.categoria.delete({ where: { id } })
    res.json({ ok: true })
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Categoría no encontrada' })
    res.status(500).json({ error: error.message })
  }
}
