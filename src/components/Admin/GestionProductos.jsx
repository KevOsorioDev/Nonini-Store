import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { productosService } from '../../services/api'
import FormularioProducto from './FormularioProducto'

const GestionProductos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      setLoading(true)
      const data = await productosService.obtenerTodos()
      setProductos(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    console.log('Intentando eliminar producto:', id)
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      console.log('Eliminando producto:', id)
      await productosService.eliminar(id)
      toast.success('Producto eliminado')
      cargarProductos()
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error(error.response?.data?.error || 'Error al eliminar producto')
    }
  }

  const handleEditar = (producto) => {
    console.log('Editando producto:', producto)
    setProductoEditar(producto)
    setMostrarFormulario(true)
  }

  const handleCrear = () => {
    console.log('Creando nuevo producto')
    setProductoEditar(null)
    setMostrarFormulario(true)
  }

  const handleGuardadoExitoso = (productoCreado) => {
    setMostrarFormulario(false)
    setProductoEditar(null)
    cargarProductos()
    
    // Si se creó un producto nuevo, opcional: redirigir a la lista actualizada
    if (productoCreado) {
      console.log('Producto creado exitosamente:', productoCreado.id)
      // Aquí podrías agregar navegación si quieres
      // navigate(`/producto/${productoCreado.id}`)
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (mostrarFormulario) {
    return (
      <FormularioProducto
        producto={productoEditar}
        onGuardar={handleGuardadoExitoso}
        onCancelar={() => {
          setMostrarFormulario(false)
          setProductoEditar(null)
        }}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--persian-plum-900)]">
            Gestión de Productos
          </h2>
          <button
            onClick={handleCrear}
            className="px-6 py-2 bg-[var(--persian-plum-600)] text-white rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productosFiltrados.map((producto) => {
                const stockTotal = producto.talles?.reduce((sum, t) => sum + t.stock, 0) || 0
                
                return (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={producto.imagenUrl || '/images/placeholder.png'}
                          alt={producto.nombre}
                          className="w-12 h-12 object-contain rounded border border-gray-200"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{producto.nombre}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {producto.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-[var(--persian-plum-100)] text-[var(--persian-plum-800)] rounded-full">
                        {producto.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ${producto.precio.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        stockTotal > 10
                          ? 'bg-green-100 text-green-800'
                          : stockTotal > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stockTotal} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditar(producto)}
                        className="text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-900)] mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(producto.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default GestionProductos
