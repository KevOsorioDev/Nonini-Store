import prisma from './config/database.js';

async function verUsuarios() {
  try {
    console.log('\n=== USUARIOS REGISTRADOS ===\n');

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (usuarios.length === 0) {
      console.log('No hay usuarios registrados todavía.\n');
      return;
    }

    console.log(`Total de usuarios: ${usuarios.length}\n`);

    usuarios.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre || 'Sin nombre'} ${user.apellido || ''}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.rol.toUpperCase()}`);
      console.log(`   Registrado: ${new Date(user.createdAt).toLocaleString('es-AR')}`);
      console.log('   ---');
    });

    // Contar por rol
    const admins = usuarios.filter(u => u.rol === 'admin').length;
    const clientes = usuarios.filter(u => u.rol === 'cliente').length;

    console.log('\n=== RESUMEN ===');
    console.log(`Administradores: ${admins}`);
    console.log(`Clientes: ${clientes}`);
    console.log(`Total: ${usuarios.length}\n`);

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verUsuarios();
