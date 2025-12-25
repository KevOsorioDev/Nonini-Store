import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function borrarCategorias() {
  try {
    console.log('🗑️  Iniciando eliminación de categorías...\n');

    // Obtener todas las categorías con conteo de productos
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });

    console.log(`📊 Total de categorías encontradas: ${categorias.length}\n`);

    let eliminadas = 0;
    let noEliminadas = 0;

    for (const categoria of categorias) {
      const cantidadProductos = categoria._count.productos;

      if (cantidadProductos > 0) {
        console.log(`⚠️  Categoría "${categoria.nombre}" tiene ${cantidadProductos} producto(s) asociado(s) - NO ELIMINADA`);
        noEliminadas++;
      } else {
        await prisma.categoria.delete({
          where: { id: categoria.id }
        });
        console.log(`✅ Categoría "${categoria.nombre}" eliminada exitosamente`);
        eliminadas++;
      }
    }

    console.log('\n📈 Resumen:');
    console.log(`   ✅ Categorías eliminadas: ${eliminadas}`);
    console.log(`   ⚠️  Categorías NO eliminadas (tienen productos): ${noEliminadas}`);
    
    if (noEliminadas > 0) {
      console.log('\n💡 Para eliminar categorías con productos:');
      console.log('   1. Elimina los productos asociados primero');
      console.log('   2. O reasigna los productos a otra categoría');
      console.log('   3. Luego ejecuta este script nuevamente');
    }

  } catch (error) {
    console.error('❌ Error al borrar categorías:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

borrarCategorias();
