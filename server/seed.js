import prisma from './config/database.js';

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');

  await prisma.color.createMany({
    data: [
      { nombre: 'Negro', claseCss: 'bg-black', codigoHex: '#000000' },
      { nombre: 'Blanco', claseCss: 'bg-white', codigoHex: '#FFFFFF' },
      { nombre: 'Azul Marino', claseCss: 'bg-blue-900', codigoHex: '#1E3A8A' },
      { nombre: 'Rojo', claseCss: 'bg-red-500', codigoHex: '#EF4444' },
      { nombre: 'Verde', claseCss: 'bg-green-500', codigoHex: '#10B981' },
      { nombre: 'Gris', claseCss: 'bg-gray-500', codigoHex: '#6B7280' }
    ],
    skipDuplicates: true
  });

  await prisma.categoria.createMany({
    data: [
      { nombre: 'Nike', slug: 'nike' },
      { nombre: 'Adidas', slug: 'adidas' },
      { nombre: 'Puma', slug: 'puma' },
      { nombre: 'Diseños Personalizados', slug: 'personalizados' }
    ],
    skipDuplicates: true
  });

  const categoria = await prisma.categoria.findFirst({
    where: { slug: 'personalizados' }
  });

  const productoTest1 = await prisma.producto.create({
    data: {
      nombre: 'Producto de Prueba - $1',
      descripcion: 'Producto para probar pagos con MercadoPago (1 peso)',
      precio: 1.00,
      categoriaId: categoria.id,
      imagenUrl: '/images/test-product.png',
      talles: {
        create: [
          { talle: 'S', stock: 100 },
          { talle: 'M', stock: 100 },
          { talle: 'L', stock: 100 },
          { talle: 'XL', stock: 100 }
        ]
      },
      colores: {
        create: [
          { colorId: 1 },
          { colorId: 2 }
        ]
      }
    }
  });

  const productoTest100 = await prisma.producto.create({
    data: {
      nombre: 'Producto de Prueba - $100',
      descripcion: 'Producto para probar pagos con MercadoPago (100 pesos)',
      precio: 100.00,
      categoriaId: categoria.id,
      imagenUrl: '/images/test-product-100.png',
      talles: {
        create: [
          { talle: 'S', stock: 50 },
          { talle: 'M', stock: 50 },
          { talle: 'L', stock: 50 },
          { talle: 'XL', stock: 50 }
        ]
      },
      colores: {
        create: [
          { colorId: 1 },
          { colorId: 2 },
          { colorId: 3 }
        ]
      }
    }
  });

  console.log('✅ Seed completado exitosamente');
  console.log(`✅ Producto de prueba creado: ID ${productoTest1.id} - $${productoTest1.precio}`);
  console.log(`✅ Producto de prueba creado: ID ${productoTest100.id} - $${productoTest100.precio}`);
  console.log('🎨 Colores creados: 6');
  console.log('📂 Categorías creadas: 4');
}

seed()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
