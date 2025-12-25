import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTENTICACIÓN ====================

export const authService = {
  // Registrar nuevo usuario
  registro: async (nombre, email, password) => {
    const response = await api.post('/auth/registro', { nombre, email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Obtener usuario actual
  obtenerPerfil: async () => {
    const response = await api.get('/auth/perfil')
    return response.data
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Cambiar contraseña
  cambiarPassword: async (passwordActual, passwordNueva) => {
    const response = await api.put('/auth/cambiar-password', {
      passwordActual,
      passwordNueva
    })
    return response.data
  }
}

// ==================== PRODUCTOS ====================

export const productosService = {
  // Obtener todos los productos
  obtenerTodos: async () => {
    const response = await api.get('/productos')
    return response.data
  },

  // Obtener producto por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/productos/${id}`)
    return response.data
  },

  // Crear nuevo producto (requiere admin)
  crear: async (productoData) => {
    const response = await api.post('/productos', productoData)
    return response.data
  },

  // Actualizar producto (requiere admin)
  actualizar: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData)
    return response.data
  },

  // Eliminar producto (requiere admin)
  eliminar: async (id) => {
    const response = await api.delete(`/productos/${id}`)
    return response.data
  },

  // Actualizar stock de un talle específico (requiere admin)
  actualizarStock: async (id, talleData) => {
    const response = await api.patch(`/productos/${id}/stock`, talleData)
    return response.data
  }
}

// ==================== CATEGORÍAS ====================

export const categoriasService = {
  // Obtener todas las categorías
  obtenerTodas: async () => {
    const response = await api.get('/categorias')
    return response.data
  },

  // Obtener categoría por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },

  // Crear nueva categoría (requiere admin)
  crear: async (categoriaData) => {
    const response = await api.post('/categorias', categoriaData)
    return response.data
  },

  // Actualizar categoría (requiere admin)
  actualizar: async (id, categoriaData) => {
    const response = await api.put(`/categorias/${id}`, categoriaData)
    return response.data
  },

  // Eliminar categoría (requiere admin)
  eliminar: async (id) => {
    const response = await api.delete(`/categorias/${id}`)
    return response.data
  }
}

// ==================== ÓRDENES ====================

export const ordenesService = {
  // Crear nueva orden
  crearOrden: async (items, metodoPago = 'mercadopago') => {
    const response = await api.post('/ordenes', { items, metodoPago })
    return response.data
  },

  // Obtener órdenes del usuario
  obtenerMisOrdenes: async () => {
    const response = await api.get('/ordenes')
    return response.data
  },

  // Obtener todas las órdenes (requiere admin)
  obtenerTodasAdmin: async () => {
    const response = await api.get('/ordenes/admin/todas')
    return response.data
  },

  // Obtener orden por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/ordenes/${id}`)
    return response.data
  },

  // Actualizar estado de orden (requiere admin)
  actualizarEstado: async (id, estado) => {
    const response = await api.patch(`/ordenes/${id}/estado`, { estado })
    return response.data
  },

  // Crear pago con MercadoPago
  crearPagoMercadoPago: async (ordenId) => {
    const response = await api.post('/ordenes/pago/mercadopago', { ordenId })
    return response.data
  },

  // Confirmar pago por transferencia bancaria (requiere admin)
  confirmarPagoTransferencia: async (ordenId) => {
    const response = await api.post(`/ordenes/${ordenId}/confirmar-pago`)
    return response.data
  }
}