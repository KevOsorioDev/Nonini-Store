import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.js';
import categoriasRoutes from './routes/categorias.js';
import ordenesRoutes from './routes/ordenes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Aumentar el límite de tamaño del payload para soportar imágenes base64 grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ordenes', ordenesRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Nonini Store funcionando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      categorias: '/api/categorias',
      ordenes: '/api/ordenes'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor', detalle: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: PostgreSQL`);
  console.log(`🔐 Admin password: ${process.env.ADMIN_PASSWORD}`);
});
