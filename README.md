# 🛍️ Nonini Store - E-commerce Completo

Plataforma de e-commerce full-stack con React + Vite (frontend) y Node.js + PostgreSQL (backend).

## 🚀 Inicio Rápido

### ⚡ Setup en 3 pasos:

**1. Clonar e instalar:**
```bash
git clone <repo>
npm install
cd server && npm install
```

**2. Configurar base de datos:**
```bash
cd server
npx prisma migrate dev
node scripts/poblar-categorias.js
```

**3. Iniciar servidores:**
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 🔧 Configuración inicial (5 minutos):
Lee [CHECKLIST_CONFIGURACION.md](CHECKLIST_CONFIGURACION.md) para:
- Actualizar datos bancarios en `.env`
- Asignar categorías a productos
- Testing rápido

---

## 📁 Estructura del Proyecto

```
Nonini-Store/
├── src/                          # Frontend React + Vite
│   ├── components/
│   │   ├── Admin/                # Panel de administración
│   │   │   ├── GestionCategorias.jsx  ⭐ NUEVO
│   │   │   ├── GestionProductos.jsx
npm run dev
```

---

## 📁 Estructura del Proyecto

```
Nonini-Store/
├── src/                          # Frontend React + Vite
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── GestionCategorias.jsx
│   │   │   ├── GestionProductos.jsx
│   │   │   └── GestionOrdenes.jsx
│   │   ├── Navbar/
│   │   └── ...
│   ├── Pages/
│   │   ├── AdminPage.jsx
│   │   ├── TransferenciaBancariaPage.jsx
│   │   ├── PagoExitoPage.jsx
│   │   └── ...
│   └── services/api.js
│
└── server/                       # Backend Node.js + PostgreSQL
    ├── controllers/
    │   ├── categoriasController.js
    │   ├── ordenesController.js
    │   └── productosController.js
    ├── routes/
    ├── scripts/
    │   └── poblar-categorias.js
    └── prisma/
        └── schema.prisma
```

---

## ✨ Características Principales

### 🛒 E-commerce
- Catálogo de productos con categorías
- Carrito de compras persistente
- Checkout con validaciones
- Múltiples métodos de pago
- Gestión de órdenes

### 💳 Pagos
- **MercadoPago:** Tarjetas (débito/crédito), efectivo
- **Transferencia Bancaria:** Sin comisiones, confirmación manual
- Captura de datos de envío
- Webhooks para notificaciones

### 🏷️ Categorías
- Gestión completa desde panel admin
- CRUD de categorías
- Navbar dinámico
- Asociación producto-categoría

### 👤 Autenticación
- Registro de usuarios
- Login con JWT
- Roles (admin/cliente)
- Cambio de contraseña

### 🎨 Personalización
- Diseño personalizado de productos
- ✅ Selector de prenda (Remera/Buzo/Remera Oversize)
- ✅ Selector de talle y color
- ✅ Preview en tiempo real
- Talles y colores
- Gestión de stock por talle

### 🔐 Panel Admin
- Dashboard con estadísticas
- Gestión de productos
- Gestión de categorías
- Gestión de órdenes
- Confirmar pagos de transferencia
- Solo accesible para admins

---

## 🛠️ Stack Tecnológico

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- react-hot-toast

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT para autenticación
- MercadoPago SDK
- Multer para imágenes

---

## 🔐 Acceso al Panel Admin

**URL:** `/admin`  
**Credenciales de prueba:** Crear usuario con rol `admin` en la base de datos

---

## 💳 Métodos de Pago

### MercadoPago
- Tarjetas de crédito/débito
- Efectivo (Rapipago/Pago Fácil)
- Webhooks para actualizaciones de estado

### Transferencia Bancaria
- Sin comisiones
- Confirmación manual desde panel admin
- Instrucciones con datos bancarios

---

## 📡 API Endpoints Principales

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto
- `POST /api/productos` - Crear (ADMIN)
- `PUT /api/productos/:id` - Actualizar (ADMIN)
- `DELETE /api/productos/:id` - Eliminar (ADMIN)

### Categorías
- `GET /api/categorias` - Listar
- `POST /api/categorias` - Crear (ADMIN)
- `PUT /api/categorias/:id` - Actualizar (ADMIN)
- `DELETE /api/categorias/:id` - Eliminar (ADMIN)

### Órdenes
- `POST /api/ordenes` - Crear orden (requiere token)
- `GET /api/ordenes` - Mis órdenes (requiere token)
- `GET /api/ordenes/admin/todas` - Todas las órdenes (ADMIN)
- `GET /api/ordenes/:id` - Orden específica (requiere token)
- `PATCH /api/ordenes/:id/estado` - Actualizar estado (ADMIN)

### Pagos
- `POST /api/ordenes/pago/stripe` - Crear pago Stripe
- `POST /api/ordenes/pago/mercadopago` - Crear pago MercadoPago

- `POST /api/ordenes` - Crear orden
- `GET /api/ordenes` - Mis órdenes
- `GET /api/ordenes/:id` - Obtener orden
- `POST /api/ordenes/:id/confirmar-pago` - Confirmar transferencia (ADMIN)

---

## ⚙️ Configuración del Servidor

### Variables de Entorno (`.env`)

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/nonini_store"
JWT_SECRET="tu_secreto_super_seguro"
PORT=5000
MP_ACCESS_TOKEN="tu_access_token_de_mercadopago"
```

---

## 🐛 Solución de Problemas

### No puedo conectar a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa el `DATABASE_URL` en `server/.env`
- Confirma que la base de datos existe

### Error al eliminar productos
- Los productos ahora se eliminan correctamente con todas sus relaciones
- Si persiste, verifica la consola del servidor

---

## 📝 Licencia

MIT

---

**Desarrollado con ❤️ para Nonini Store**
