import prisma from '../config/database.js';

async function poblarCategorias() {
  try {
    console.log('🌱 Poblando categorías...');

    const categorias = [
      { nombre: 'Nike', slug: 'nike' },
      { nombre: 'Adidas', slug: 'adidas' },
      { nombre: 'Puma', slug: 'puma' },
      { nombre: 'Mascotas', slug: 'mascotas' },
      { nombre: 'Disney', slug: 'disney' },
      { nombre: 'Pixar', slug: 'pixar' },
      { nombre: 'Marvel', slug: 'marvel' },
      { nombre: 'DC Comics', slug: 'dc-comics' },
      { nombre: 'Anime', slug: 'anime' },
      { nombre: 'Música', slug: 'musica' },
      { nombre: 'Gaming', slug: 'gaming' },
      { nombre: 'Deportes', slug: 'deportes' }
    ];

    for (const cat of categorias) {
      const existe = await prisma.categoria.findUnique({
        where: { slug: cat.slug }
      });

      if (!existe) {
        await prisma.categoria.create({
          data: cat
        });
        console.log(`✅ Categoría creada: ${cat.nombre}`);
      } else {
        console.log(`⏭️  Categoría ya existe: ${cat.nombre}`);
      }
    }

    console.log('✅ Categorías pobladas exitosamente');

    // Contar productos
    const totalProductos = await prisma.producto.count();
    console.log(`\n📦 Total de productos en BD: ${totalProductos}`);

  } catch (error) {
    console.error('❌ Error al poblar categorías:', error);
  } finally {
    await prisma.$disconnect();
  }
}

poblarCategorias();
