import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const CategoriaPage = () => {
  const [searchParams] = useSearchParams()
  const categoriaId = searchParams.get('categoria')
  const [categoria, setCategoria] = useState(null)
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (categoriaId) {
      cargarDatos()
    } else {
      setLoading(false)
    }
  }, [categoriaId])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      await Promise.all([cargarCategoria(), cargarProductos()])
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const cargarCategoria = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias/${categoriaId}`)
      setCategoria(response.data)
    } catch (error) {
      console.error('Error al cargar categoría:', error)
      toast.error('Error al cargar la categoría')
    }
  }

  const cargarProductos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/productos?categoria=${categoriaId}`)
      setProductos(response.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      toast.error('Error al cargar productos')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--persian-plum-900)] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (!categoria) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categoría no encontrada</h2>
          <Link 
            to="/" 
            className="text-[var(--persian-plum-900)] hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la categoría */}
      <div className="bg-gradient-to-r from-[var(--persian-plum-900)] to-[var(--persian-plum-700)] text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Diseños relacionados con {categoria.nombre}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--persian-plum-100)] max-w-2xl mx-auto">
              Descubre nuestra colección exclusiva de {categoria.nombre.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm">
            <Link to="/" className="text-gray-500 hover:text-[var(--persian-plum-900)]">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{categoria.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Productos */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {productos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <svg
              className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Aún no hay productos en esta categoría
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Estamos trabajando para agregar productos increíbles de {categoria.nombre}
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-[var(--persian-plum-900)] text-white rounded-lg hover:bg-[var(--persian-plum-800)] transition-colors"
            >
              Explorar otras categorías
            </Link>
          </div>
        ) : (
          <>
            {/* Contador de productos */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-600">
                {productos.length} {productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  {/* Imagen del producto */}
                  <Link to={`/producto/${producto.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={producto.imagenUrl || '/images/placeholder.png'}
                        alt={producto.nombre}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      {!producto.activo && (
                        <div className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          Agotado
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Información del producto */}
                  <div className="p-3 sm:p-4">
                    <Link to={`/producto/${producto.id}`}>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 hover:text-[var(--persian-plum-900)] transition-colors">
                        {producto.nombre}
                      </h3>
                    </Link>

                    {producto.descripcion && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                        {producto.descripcion}
                      </p>
                    )}

                    {/* Precio */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <p className="text-xl sm:text-2xl font-bold text-[var(--persian-plum-900)]">
                        ${producto.precio.toLocaleString()}
                      </p>

                      {/* Stock */}
                      {producto.talles && producto.talles.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {producto.talles.reduce((sum, t) => sum + t.stock, 0)} disponibles
                        </div>
                      )}
                    </div>

                    {/* Talles disponibles */}
                    {producto.talles && producto.talles.length > 0 && (
                      <div className="mb-2 sm:mb-3">
                        <p className="text-xs text-gray-600 mb-1 sm:mb-2">Talles disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {producto.talles
                            .filter(t => t.stock > 0)
                            .map((talle, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                              >
                                {talle.talle}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Botón */}
                    <Link
                      to={`/producto/${producto.id}`}
                      className="block w-full px-3 py-2 sm:px-4 text-xs sm:text-sm bg-[var(--persian-plum-900)] text-white text-center rounded-lg hover:bg-[var(--persian-plum-800)] transition-colors font-medium"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Call to action */}
      <div className="bg-white border-t border-gray-200 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Explora otras categorías o crea tu propio diseño personalizado
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/"
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-2 border-[var(--persian-plum-900)] text-[var(--persian-plum-900)] rounded-lg hover:bg-[var(--persian-plum-50)] transition-colors font-medium"
            >
              Ver todas las categorías
            </Link>
            <Link
              to="/producto/1"
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-[var(--persian-plum-900)] text-white rounded-lg hover:bg-[var(--persian-plum-800)] transition-colors font-medium"
            >
              Crear diseño personalizado
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriaPage
