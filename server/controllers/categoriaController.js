import prisma from '../config/database.js';

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', detalle: error.message });
  }
};

// Obtener una categoría por ID
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        productos: {
          include: {
            talles: true,
            colores: {
              include: {
                color: true
              }
            }
          }
        }
      }
    });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categoría', detalle: error.message });
  }
};

// Crear nueva categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, slug } = req.body;

    // Validaciones
    if (!nombre || !slug) {
      return res.status(400).json({ error: 'Nombre y slug son obligatorios' });
    }

    // Verificar si ya existe una categoría con ese nombre o slug
    const categoriaExistente = await prisma.categoria.findFirst({
      where: {
        OR: [
          { nombre: nombre },
          { slug: slug }
        ]
      }
    });

    if (categoriaExistente) {
      return res.status(400).json({ 
        error: 'Ya existe una categoría con ese nombre o slug' 
      });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        slug
      }
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría', detalle: error.message });
  }
};

// Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slug } = req.body;

    // Verificar si la categoría existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: parseInt(id) }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Verificar si el nuevo nombre o slug ya están en uso por otra categoría
    if (nombre || slug) {
      const categoriaConflicto = await prisma.categoria.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                ...(nombre ? [{ nombre }] : []),
                ...(slug ? [{ slug }] : [])
              ]
            }
          ]
        }
      });

      if (categoriaConflicto) {
        return res.status(400).json({ 
          error: 'Ya existe otra categoría con ese nombre o slug' 
        });
      }
    }

    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre && { nombre }),
        ...(slug && { slug })
      }
    });

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría', detalle: error.message });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la categoría existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Verificar si la categoría tiene productos asociados
    if (categoria._count.productos > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar la categoría porque tiene ${categoria._count.productos} producto(s) asociado(s)` 
      });
    }

    await prisma.categoria.delete({
      where: { id: parseInt(id) }
    });

    res.json({ mensaje: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría', detalle: error.message });
  }
};
