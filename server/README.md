# 🛍️ Nonini Store - Backend API

Sistema backend completo para e-commerce con PostgreSQL, autenticación JWT, panel de administración y pasarelas de pago.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso del API](#uso-del-api)
- [Panel de Administración](#panel-de-administración)
- [Pasarelas de Pago](#pasarelas-de-pago)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## ✨ Características

✅ Autenticación con JWT (registro/login)  
✅ Gestión completa de productos y categorías  
✅ Control de stock por talle  
✅ Sistema de órdenes de compra  
✅ Panel de administración protegido con contraseña  
✅ Integración con Stripe para pagos  
✅ Integración con MercadoPago  
✅ Subida de imágenes  
✅ Base de datos PostgreSQL con Prisma ORM

---

## 🚀 Instalación

### 1. Requisitos previos

- **Node.js** v18 o superior
- **PostgreSQL** instalado y corriendo
- **npm** o **yarn**

### 2. Instalar PostgreSQL (Windows)

1. Descarga PostgreSQL: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación:
   - Usuario por defecto: `postgres`
   - Elige una contraseña (recuérdala)
   - Puerto por defecto: `5432`
4. Abre **pgAdmin** (instalado con PostgreSQL)
5. Crea una nueva base de datos llamada `nonini_store`

### 3. Clonar e instalar dependencias

```bash
cd server
npm install
```

### 4. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
copy .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/nonini_store?schema=public"
JWT_SECRET="cambia_esto_por_algo_muy_secreto"
ADMIN_PASSWORD="mollydraco"
PORT=5000
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MERCADOPAGO_ACCESS_TOKEN="TEST-..."
```

### 5. Ejecutar migraciones y seed

```bash
npm run prisma:migrate
node seed.js
```

### 6. Iniciar el servidor

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

---

## ⚙️ Configuración

### Base de datos

El esquema de Prisma está en `prisma/schema.prisma`. Incluye:

- **Usuario**: Clientes y administradores
- **Categoria**: Nike, Adidas, Puma, etc.
- **Producto**: Items del catálogo
- **Talle**: Stock por talle de cada producto
- **Color**: Colores disponibles
- **Carrito**: Carrito de compras
- **Orden**: Órdenes de compra
- **OrdenItem**: Items de cada orden

### Comandos útiles de Prisma

```bash
npm run prisma:studio
npm run prisma:generate
npm run prisma:migrate
```

---

## 📡 Uso del API

### Base URL

```
http://localhost:5000/api
```

---

## 🔐 Autenticación

### Registro de usuario

```http
POST /api/auth/registro
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3512345678"
}
```

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "rol": "cliente"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Obtener perfil

```http
GET /api/auth/perfil
Authorization: Bearer {token}
```

---

## 📦 Productos

### Listar productos

```http
GET /api/productos
```

**Query params opcionales:**
- `?categoria=1` - Filtrar por categoría
- `?activo=true` - Solo productos activos

### Obtener producto por ID

```http
GET /api/productos/1
```

### Crear producto (ADMIN)

```http
POST /api/productos
X-Admin-Password: mollydraco
Content-Type: multipart/form-data

{
  "nombre": "Logo Nike Personalizado",
  "descripcion": "Diseño exclusivo para remeras y buzos",
  "precio": 8500,
  "categoriaId": 1,
  "talles": [
    { "talle": "S", "stock": 10 },
    { "talle": "M", "stock": 15 },
    { "talle": "L", "stock": 20 }
  ],
  "colores": [1, 2, 3],
  "imagen": [archivo]
}
```

### Actualizar producto (ADMIN)

```http
PUT /api/productos/1
X-Admin-Password: mollydraco
Content-Type: application/json

{
  "precio": 9000,
  "activo": true
}
```

### Eliminar producto (ADMIN)

```http
DELETE /api/productos/1
X-Admin-Password: mollydraco
```

### Actualizar stock (ADMIN)

```http
PATCH /api/productos/stock
X-Admin-Password: mollydraco
Content-Type: application/json

{
  "productoId": 1,
  "talle": "M",
  "stock": 25
}
```

---

## 📂 Categorías

### Listar categorías

```http
GET /api/categorias
```

### Crear categoría (ADMIN)

```http
POST /api/categorias
X-Admin-Password: mollydraco
Content-Type: application/json

{
  "nombre": "Nike",
  "slug": "nike"
}
```

### Actualizar categoría (ADMIN)

```http
PUT /api/categorias/1
X-Admin-Password: mollydraco
Content-Type: application/json

{
  "nombre": "Nike Premium",
  "slug": "nike-premium"
}
```

### Eliminar categoría (ADMIN)

```http
DELETE /api/categorias/1
X-Admin-Password: mollydraco
```

---

## 🛒 Órdenes

### Crear orden

```http
POST /api/ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productoId": 1,
      "prenda": "Remera",
      "talle": "M",
      "color": "Negro",
      "cantidad": 2
    }
  ],
  "metodoPago": "stripe"
}
```

### Mis órdenes

```http
GET /api/ordenes
Authorization: Bearer {token}
```

### Obtener orden específica

```http
GET /api/ordenes/1
Authorization: Bearer {token}
```

### Ver todas las órdenes (ADMIN)

```http
GET /api/ordenes/admin/todas
X-Admin-Password: mollydraco
```

**Query params opcionales:**
- `?estado=pendiente` - Filtrar por estado

### Actualizar estado de orden (ADMIN)

```http
PATCH /api/ordenes/1/estado
X-Admin-Password: mollydraco
Content-Type: application/json

{
  "estado": "enviado"
}
```

**Estados disponibles:**
- `pendiente`
- `pagado`
- `preparando`
- `enviado`
- `entregado`
- `cancelado`

---

## 🔐 Panel de Administración

### Acceso al panel

Todas las rutas de administración requieren el header:

```http
X-Admin-Password: mollydraco
```

### Funciones del administrador:

✅ Crear, editar y eliminar productos  
✅ Gestionar categorías  
✅ Actualizar stock  
✅ Ver todas las órdenes  
✅ Cambiar estados de órdenes  
✅ Subir imágenes de productos

### Ejemplo con Postman:

1. Abre Postman
2. Crea una nueva request
3. En **Headers**, agrega:
   - Key: `X-Admin-Password`
   - Value: `mollydraco`
4. Selecciona el método y endpoint (ej: POST /api/productos)
5. Envía la request

### Ejemplo con cURL:

```bash
curl -X POST http://localhost:5000/api/productos \
  -H "X-Admin-Password: mollydraco" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Producto",
    "precio": 5000,
    "categoriaId": 1
  }'
```

---

## 💳 Pasarelas de Pago

### 🔵 Stripe

#### 1. Configuración inicial

1. Crea una cuenta en: https://dashboard.stripe.com/register
2. Ve a **Developers** → **API Keys**
3. Copia tu **Secret Key** (empieza con `sk_test_...`)
4. Pégala en `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_tu_clave_aqui"
   ```

#### 2. Configurar webhooks (opcional pero recomendado)

1. En Stripe Dashboard, ve a **Developers** → **Webhooks**
2. Click en **Add endpoint**
3. URL del endpoint: `http://tu-dominio.com/api/ordenes/webhook/stripe`
4. Eventos a escuchar: `payment_intent.succeeded`
5. Copia el **Signing secret** (empieza con `whsec_...`)
6. Pégalo en `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_tu_secret_aqui"
   ```

#### 3. Crear un pago con Stripe

```http
POST /api/ordenes/pago/stripe
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1
}
```

**Respuesta:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "ordenId": 1
}
```

Usa el `clientSecret` en el frontend con Stripe Elements.

#### 4. Probar pagos

**Tarjetas de prueba:**
- ✅ Éxito: `4242 4242 4242 4242`
- ❌ Falla: `4000 0000 0000 0002`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

---

### 🟢 MercadoPago

#### 1. Configuración inicial

1. Crea una cuenta en: https://www.mercadopago.com.ar
2. Ve a **Developers** → **Credenciales**
3. Copia tu **Access Token** de prueba (empieza con `TEST-...`)
4. Pégalo en `.env`:
   ```env
   MERCADOPAGO_ACCESS_TOKEN="TEST-tu_token_aqui"
   ```

#### 2. Configurar webhooks (opcional)

1. En MercadoPago Dashboard, ve a **Developers** → **Webhooks**
2. URL: `http://tu-dominio.com/api/ordenes/webhook/mercadopago`
3. Eventos: `payment`

#### 3. Crear un pago con MercadoPago

```http
POST /api/ordenes/pago/mercadopago
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1
}
```

**Respuesta:**
```json
{
  "preferenceId": "12345-xxx",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=xxx"
}
```

Redirige al usuario a `initPoint` para completar el pago.

#### 4. Probar pagos

**Usuarios de prueba:**
1. Ve a **Developers** → **Test users**
2. Crea un comprador y un vendedor de prueba
3. Usa esas credenciales en el checkout

**Tarjetas de prueba:**
- ✅ Éxito: `5031 7557 3453 0604`
- Fecha: `11/25`
- CVV: `123`

---

## 🧪 Producto de Prueba

El seed crea automáticamente un **producto de $1** para probar pagos:

```json
{
  "id": 1,
  "nombre": "Producto de Prueba - $1",
  "precio": 1.00,
  "descripcion": "Producto para probar pagos"
}
```

**Cómo usarlo:**

1. Registra un usuario
2. Crea una orden con este producto
3. Procesa el pago con Stripe o MercadoPago
4. Verifica que el estado cambie a "pagado"

---

## 📁 Estructura del Proyecto

```
server/
├── config/
│   ├── database.js          # Configuración Prisma
│   ├── stripe.js            # Configuración Stripe
│   └── mercadopago.js       # Configuración MercadoPago
├── controllers/
│   ├── authController.js    # Registro, login, perfil
│   ├── productosController.js
│   ├── categoriasController.js
│   └── ordenesController.js # Órdenes y pagos
├── middleware/
│   ├── auth.js              # JWT y verificación admin
│   └── upload.js            # Subida de imágenes
├── prisma/
│   └── schema.prisma        # Schema de base de datos
├── routes/
│   ├── auth.js
│   ├── productos.js
│   ├── categorias.js
│   └── ordenes.js
├── uploads/                 # Imágenes subidas
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de .env
├── package.json
├── seed.js                  # Datos iniciales
└── server.js                # Servidor principal
```

---

## 🔧 Comandos Útiles

```bash
npm run dev              # Modo desarrollo con nodemon
npm start               # Modo producción
npm run prisma:studio   # Abrir Prisma Studio (GUI)
npm run prisma:migrate  # Crear/aplicar migraciones
node seed.js            # Insertar datos de prueba
```

---

## 🐛 Solución de Problemas

### Error: "Can't connect to PostgreSQL"

✅ Verifica que PostgreSQL esté corriendo  
✅ Revisa el `DATABASE_URL` en `.env`  
✅ Confirma que la base de datos `nonini_store` existe

### Error: "JWT malformed"

✅ Asegúrate de incluir `Authorization: Bearer {token}`  
✅ Verifica que el token no haya expirado

### Error: "Access denied" en rutas admin

✅ Incluye el header `X-Admin-Password: mollydraco`  
✅ Verifica que `ADMIN_PASSWORD` esté en `.env`

### Error: "Stripe key not found"

✅ Copia tu Secret Key de Stripe Dashboard  
✅ Pégala en `.env` como `STRIPE_SECRET_KEY`

---

## 📊 Base de Datos

### Ver datos con Prisma Studio

```bash
npm run prisma:studio
```

Esto abre una interfaz web en `http://localhost:5555` donde puedes:
- Ver todas las tablas
- Editar datos
- Ejecutar queries

---

## 🚀 Despliegue a Producción

### Variables de entorno en producción:

```env
DATABASE_URL="postgresql://usuario:password@servidor:5432/nonini_store"
JWT_SECRET="clave_super_secreta_en_produccion"
ADMIN_PASSWORD="password_seguro_produccion"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MERCADOPAGO_ACCESS_TOKEN="APP-..."
FRONTEND_URL="https://tu-dominio.com"
```

### Recomendaciones:

- Usa **HTTPS** en producción
- Cambia todas las contraseñas y secrets
- Usa claves de **producción** de Stripe y MercadoPago
- Configura webhooks con tu dominio real
- Activa logs y monitoreo

---

## 📝 Licencia

MIT

---

## 👨‍💻 Soporte

Si tienes dudas o problemas:

1. Revisa esta documentación
2. Verifica los logs del servidor
3. Usa Prisma Studio para inspeccionar la BD
4. Prueba los endpoints con Postman

---

**¡Backend listo para usar! 🎉**
