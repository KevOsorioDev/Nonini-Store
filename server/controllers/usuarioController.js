import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/usuarios/mis-ordenes - Obtener historial de órdenes del usuario
export const obtenerMisOrdenes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Del middleware de autenticación

    const ordenes = await prisma.orden.findMany({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: {
              include: {
                categoria: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Más recientes primero
      }
    });

    // Calcular estadísticas
    const stats = {
      totalOrdenes: ordenes.length,
      totalGastado: ordenes.reduce((sum, orden) => sum + parseFloat(orden.total), 0),
      ordenesPendientes: ordenes.filter(o => o.estado === 'pendiente').length,
      ordenesCompletadas: ordenes.filter(o => o.estado === 'entregado').length
    };

    res.json({
      ordenes,
      estadisticas: stats
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener historial de órdenes' });
  }
};

// GET /api/usuarios/orden/:id - Ver detalle de una orden específica
export const obtenerDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const orden = await prisma.orden.findFirst({
      where: { 
        id: parseInt(id),
        usuarioId // Solo puede ver sus propias órdenes
      },
      include: {
        items: {
          include: {
            producto: {
              include: {
                categoria: true,
                colores: true
              }
            }
          }
        },
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    console.error('Error al obtener detalle de orden:', error);
    res.status(500).json({ error: 'Error al obtener detalle de orden' });
  }
};
