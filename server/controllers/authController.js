import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const registro = async (req, res) => {
  try {
    console.log('📝 Intento de registro recibido:', req.body);
    const { email, password, nombre, apellido, telefono } = req.body;

    if (!email || !password || !nombre) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({ error: 'Faltan campos requeridos (email, password, nombre)' });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      console.log('❌ Email ya registrado:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Lista de emails admin desde variables de entorno
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const esAdmin = adminEmails.includes(email.toLowerCase());
    console.log('🔐 ¿Es admin?', esAdmin, '- Email:', email);

    const usuario = await prisma.usuario.create({
      data: {
        email,
        password: passwordHash,
        nombre,
        apellido: apellido || null,
        telefono: telefono || null,
        rol: esAdmin ? 'admin' : 'cliente'
      }
    });

    console.log('✅ Usuario creado exitosamente:', { id: usuario.id, email: usuario.email, rol: usuario.rol });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si el email está en la lista de admins
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const deberiaSerAdmin = adminEmails.includes(email.toLowerCase());

    // Si debería ser admin pero no lo es, actualizar en la BD
    let rolFinal = usuario.rol;
    if (deberiaSerAdmin && usuario.rol !== 'admin') {
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { rol: 'admin' }
      });
      rolFinal = 'admin';
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: rolFinal },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: rolFinal
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        createdAt: true
      }
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil', detalle: error.message });
  }
};

// Cambiar contraseña (requiere estar autenticado)
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuarioId = req.usuario.id;

    // Validaciones
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ error: 'Debes proporcionar la contraseña actual y la nueva' });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener usuario actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: hashedPassword }
    });

    console.log('✅ Contraseña actualizada para usuario:', usuario.email);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña', detalle: error.message });
  }
};
