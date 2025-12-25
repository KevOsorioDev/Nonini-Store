import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ordenesService } from '../../services/api'

const GestionOrdenes = () => {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    try {
      setLoading(true)
      const data = await ordenesService.obtenerTodasAdmin()
      setOrdenes(data)
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
      toast.error('Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarEstado = async (ordenId, nuevoEstado) => {
    try {
      await ordenesService.actualizarEstado(ordenId, nuevoEstado)
      toast.success('Estado actualizado correctamente')
      cargarOrdenes()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      toast.error('Error al actualizar el estado')
    }
  }

  const ordenesFiltradas = ordenes.filter(orden => {
    if (filtroEstado === 'todas') return true
    return orden.estado === filtroEstado
  })

  const estadosDisponibles = [
    { value: 'todas', label: 'Todas', color: 'gray' },
    { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
    { value: 'pagado', label: 'Pagado', color: 'green' },
    { value: 'enviado', label: 'Enviado', color: 'blue' },
    { value: 'entregado', label: 'Entregado', color: 'purple' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' }
  ]

  const getColorEstado = (estado) => {
    const estadoConfig = estadosDisponibles.find(e => e.value === estado)
    return estadoConfig?.color || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--persian-plum-900)]">
            Gestión de Órdenes
          </h2>
          <div className="text-sm text-gray-600">
            Total: {ordenesFiltradas.length} órdenes
          </div>
        </div>

        {/* Filtros por estado */}
        <div className="flex flex-wrap gap-2">
          {estadosDisponibles.map((estado) => (
            <button
              key={estado.value}
              onClick={() => setFiltroEstado(estado.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroEstado === estado.value
                  ? 'bg-[var(--persian-plum-600)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {estado.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de órdenes */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      ) : ordenesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p>No se encontraron órdenes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenesFiltradas.map((orden) => (
            <div key={orden.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header de la orden */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-bold text-[var(--persian-plum-900)]">
                        Orden #{orden.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(orden.createdAt).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-${getColorEstado(orden.estado)}-100 text-${getColorEstado(orden.estado)}-800`}>
                      {orden.estado.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--persian-plum-900)]">
                      ${orden.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{orden.metodoPago}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de la orden */}
              <div className="p-4">
                {/* Cliente */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium">{orden.usuario?.nombre || 'Sin nombre'}</p>
                  <p className="text-sm text-gray-600">{orden.usuario?.email}</p>
                </div>

                {/* Productos */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Productos</p>
                  <div className="space-y-2">
                    {orden.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.producto?.imagenUrl || '/images/placeholder.png'}
                          alt={item.producto?.nombre}
                          className="w-12 h-12 object-contain rounded border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.producto?.nombre}</p>
                          <p className="text-gray-600">
                            Cantidad: {item.cantidad} | ${item.precioUnitario.toLocaleString()} c/u
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(item.precioUnitario * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cambiar estado */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cambiar estado de la orden
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={orden.estado}
                      onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--persian-plum-500)] focus:border-transparent"
                    >
                      {estadosDisponibles.filter(e => e.value !== 'todas').map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setOrdenSeleccionada(orden)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles (opcional, simplificado) */}
      {ordenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Orden #{ordenSeleccionada.id}</h3>
                <button
                  onClick={() => setOrdenSeleccionada(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(ordenSeleccionada, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionOrdenes
