const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function eliminarUsuario() {
  try {
    const email = 'kevin.oss02@gmail.com';
    
    const usuario = await prisma.usuario.delete({
      where: { email }
    });

    console.log('✅ Usuario eliminado:', usuario.email);
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

eliminarUsuario();
