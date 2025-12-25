import prisma from '../config/database.js';

export const obtenerProductos = async (req, res) => {
  try {
    const { categoria, activo } = req.query;
    
    const where = {};
    if (categoria) where.categoriaId = parseInt(categoria);
    // Por defecto mostrar solo productos activos, a menos que se especifique lo contrario
    if (activo === undefined) {
      where.activo = true;
    } else if (activo !== 'all') {
      where.activo = activo === 'true';
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        talles: true,
        colores: {
          include: {
            color: true
          }
        }
      }
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        talles: true,
        colores: {
          include: {
            color: true
          }
        }
      }
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', detalle: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoriaId, activo, talles, colores, imagenUrl, disenoUrl, disenoConfig } = req.body;
    
    console.log('🆕 Creando producto:', { 
      nombre, 
      precio, 
      categoriaId, 
      activo, 
      imagenUrl: imagenUrl ? 'presente' : 'ausente',
      disenoUrl: disenoUrl ? 'presente' : 'ausente',
      disenoConfig: disenoConfig ? 'presente' : 'ausente',
      talles: talles ? `${talles.length} talles` : 'sin talles'
    });
    
    // Manejar imagen: puede venir de req.file (multipart) o req.body.imagenUrl (base64/URL)
    let imagen = null;
    if (req.file) {
      imagen = `/uploads/${req.file.filename}`;
    } else if (imagenUrl) {
      imagen = imagenUrl;
    }

    // Validaciones básicas
    if (!nombre || !precio || !categoriaId) {
      console.log('❌ Validación fallida:', { nombre: !!nombre, precio: !!precio, categoriaId: !!categoriaId });
      return res.status(400).json({ 
        error: 'Nombre, precio y categoría son obligatorios' 
      });
    }

    // Validar que venga imagen
    if (!imagen && !imagenUrl) {
      console.log('❌ Validación fallida: imagen faltante');
      return res.status(400).json({ 
        error: 'La imagen del producto es obligatoria' 
      });
    }

    // Parsear talles si viene como string
    const tallesArray = typeof talles === 'string' ? JSON.parse(talles) : talles;
    const coloresArray = typeof colores === 'string' ? JSON.parse(colores) : colores;

    // Preparar disenoConfig - Prisma espera un objeto, no un string
    let disenoConfigData = disenoConfig;
    if (typeof disenoConfig === 'string') {
      try {
        disenoConfigData = JSON.parse(disenoConfig);
      } catch (e) {
        console.log('⚠️ Error parseando disenoConfig, se usará como está:', e.message);
      }
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion: descripcion || '',
        precio: parseFloat(precio),
        categoriaId: parseInt(categoriaId),
        activo: activo !== undefined ? activo : true,
        imagenUrl: imagen,
        disenoUrl: disenoUrl || null,
        disenoConfig: disenoConfigData || undefined,
        talles: tallesArray ? {
          create: tallesArray.map(t => ({
            talle: t.talle,
            stock: parseInt(t.stock) || 0
          }))
        } : undefined,
        colores: coloresArray && coloresArray.length > 0 ? {
          create: coloresArray.map(colorId => ({
            colorId: parseInt(colorId)
          }))
        } : undefined
      },
      include: {
        categoria: true,
        talles: true,
        colores: {
          include: {
            color: true
          }
        }
      }
    });

    console.log('✅ Producto creado exitosamente:', { 
      id: producto.id, 
      nombre: producto.nombre, 
      activo: producto.activo, 
      categoriaId: producto.categoriaId,
      talles: producto.talles?.length || 0,
      disenoConfig: !!producto.disenoConfig
    });
    
    res.status(201).json(producto);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto', detalle: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoriaId, activo, talles, imagenUrl, disenoUrl, disenoConfig } = req.body;
    
    console.log('🔄 Actualizando producto:', id);
    console.log('📦 Datos recibidos:', { nombre, descripcion, precio, categoriaId, activo, imagenUrl, disenoUrl, disenoConfig: !!disenoConfig, talles: !!talles });
    
    // Manejar imagen: puede venir de req.file (multipart) o req.body.imagenUrl (base64/URL)
    let imagen = undefined;
    if (req.file) {
      imagen = `/uploads/${req.file.filename}`;
    } else if (imagenUrl !== undefined) {
      imagen = imagenUrl;
    }

    // Construir objeto de actualización
    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (precio !== undefined) data.precio = parseFloat(precio);
    if (categoriaId !== undefined) data.categoriaId = parseInt(categoriaId);
    if (activo !== undefined) data.activo = activo === 'true' || activo === true;
    if (imagen !== undefined) data.imagenUrl = imagen;
    if (disenoUrl !== undefined) data.disenoUrl = disenoUrl;
    if (disenoConfig !== undefined) {
      // Prisma espera un objeto JSON, no un string
      if (typeof disenoConfig === 'string') {
        try {
          data.disenoConfig = JSON.parse(disenoConfig);
        } catch (e) {
          console.log('⚠️ Error parseando disenoConfig en update, se usará como está:', e.message);
          data.disenoConfig = disenoConfig;
        }
      } else {
        data.disenoConfig = disenoConfig;
      }
    }

    // Si vienen talles, actualizarlos
    if (talles) {
      const tallesArray = typeof talles === 'string' ? JSON.parse(talles) : talles;
      
      // Eliminar talles existentes y crear nuevos
      await prisma.talle.deleteMany({
        where: { productoId: parseInt(id) }
      });

      data.talles = {
        create: tallesArray.map(t => ({
          talle: t.talle,
          stock: parseInt(t.stock) || 0
        }))
      };
    }

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data,
      include: {
        categoria: true,
        talles: true,
        colores: {
          include: {
            color: true
          }
        }
      }
    });

    console.log('✅ Producto actualizado exitosamente:', producto.id, producto.nombre, 'activo:', producto.activo, 'categoriaId:', producto.categoriaId);
    
    res.json(producto);
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto', detalle: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoId = parseInt(id);

    // Eliminar todas las relaciones primero (cascada manual)
    // 1. Eliminar items de carrito
    await prisma.carritoItem.deleteMany({
      where: { productoId }
    });

    // 2. Eliminar items de órdenes
    await prisma.ordenItem.deleteMany({
      where: { productoId }
    });

    // 3. Eliminar talles
    await prisma.talle.deleteMany({
      where: { productoId }
    });

    // 4. Eliminar colores
    await prisma.productoColor.deleteMany({
      where: { productoId }
    });

    // 5. Finalmente eliminar el producto
    await prisma.producto.delete({
      where: { id: productoId }
    });

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto', detalle: error.message });
  }
};

export const actualizarStock = async (req, res) => {
  try {
    const { productoId, talle, stock } = req.body;

    const talleActualizado = await prisma.talle.updateMany({
      where: {
        productoId: parseInt(productoId),
        talle
      },
      data: {
        stock: parseInt(stock)
      }
    });

    res.json({ mensaje: 'Stock actualizado', talleActualizado });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar stock', detalle: error.message });
  }
};
