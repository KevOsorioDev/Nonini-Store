import axios from 'axios'
import {
  productsData,
  categoriasData,
  getProductById,
  toCatalogProduct,
  buscarProductosLocal
} from '../data/products'

const API_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')
const API_ENABLED = import.meta.env.VITE_API_ENABLED === 'true'

const backendOffline = () => {
  const error = new Error('Backend no disponible todavía')
  error.code = 'BACKEND_OFFLINE'
  throw error
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const esIntentoAuth = url.includes('/auth/login') || url.includes('/auth/registro')
    if (error.response?.status === 401 && !esIntentoAuth) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth

export const authService = {
  registro: async (nombre, email, password) => {
    const response = await api.post('/auth/registro', { nombre, email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  obtenerPerfil: async () => {
    const response = await api.get('/auth/perfil')
    return response.data
  },

  actualizarPerfil: async (datos) => {
    const response = await api.put('/auth/perfil', datos)
    if (response.data.usuario) {
      localStorage.setItem('user', JSON.stringify(response.data.usuario))
    }
    return response.data
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  cambiarPassword: async (passwordActual, passwordNueva) => {
    const response = await api.put('/auth/cambiar-password', {
      passwordActual,
      passwordNueva
    })
    return response.data
  }
}

// Productos

export const productosService = {
  obtenerTodos: async () => {
    try {
      const response = await api.get('/productos')
      const data = response.data
      return Array.isArray(data) ? data : data?.productos || []
    } catch {
      if (API_ENABLED) throw new Error('No se pudieron cargar los productos')
      return productsData.map(toCatalogProduct)
    }
  },

  buscar: async (query) => {
    try {
      const response = await api.get('/productos/buscar', { params: { q: query } })
      return Array.isArray(response.data) ? response.data : []
    } catch {
      return buscarProductosLocal(query)
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`)
      return response.data
    } catch (error) {
      const local = getProductById(id)
      if (local) return toCatalogProduct(local)
      throw error
    }
  },

  crear: async (productoData) => {
    const response = await api.post('/productos', productoData)
    return response.data
  },

  actualizar: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData)
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/productos/${id}`)
    return response.data
  },

  actualizarStock: async (id, talleData) => {
    const response = await api.patch(`/productos/${id}/stock`, talleData)
    return response.data
  }
}

// Categorías

export const categoriasService = {
  obtenerTodas: async () => {
    try {
      const response = await api.get('/categorias')
      return Array.isArray(response.data) ? response.data : []
    } catch {
      return categoriasData
    }
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },

  crear: async (categoriaData) => {
    const response = await api.post('/categorias', categoriaData)
    return response.data
  },

  actualizar: async (id, categoriaData) => {
    const response = await api.put(`/categorias/${id}`, categoriaData)
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/categorias/${id}`)
    return response.data
  }
}

// Órdenes

export const ordenesService = {
  crearOrden: async (items, metodoPago = 'mercadopago') => {
    if (!API_ENABLED) backendOffline()
    const response = await api.post('/ordenes', { items, metodoPago })
    return response.data
  },

  obtenerMisOrdenes: async () => {
    const response = await api.get('/pedidos/mios')
    return response.data
  },

  obtenerTodasAdmin: async () => {
    const response = await api.get('/pedidos/admin')
    return response.data
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },

  actualizarEstado: async (id, estado) => {
    const response = await api.patch(`/pedidos/${id}/estado`, { estado })
    return response.data
  },

  crearPagoMercadoPago: async (ordenId) => {
    if (!API_ENABLED) backendOffline()
    const response = await api.post('/ordenes/pago/mercadopago', { ordenId })
    return response.data
  },

  confirmarPagoTransferencia: async (ordenId) => {
    if (!API_ENABLED) backendOffline()
    const response = await api.post(`/ordenes/${ordenId}/confirmar-pago`)
    return response.data
  }
}

export const pedidosService = {
  pagarMercadoPago: async (payload) => {
    const response = await api.post('/pedidos/pagar-mp', payload)
    return response.data
  },

  obtenerPorCodigo: async (codigo) => {
    const response = await api.get(`/pedidos/${codigo}`)
    return response.data
  },

  confirmarPago: async (codigo, paymentId) => {
    const response = await api.post(`/pedidos/${codigo}/confirmar`, { paymentId })
    return response.data
  }
}