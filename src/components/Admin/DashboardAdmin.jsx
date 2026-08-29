import { useState, useEffect } from 'react'
import { ordenesService, productosService, categoriasService } from '../../services/api'
import toast from 'react-hot-toast'

const DashboardAdmin = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ordenesTotales: 0,
    ordenesPendientes: 0,
    productosActivos: 0,
    categoriasTotal: 0
  })
  const [loading, setLoading] = useState(true)
  const [ordenes, setOrdenes] = useState([])
  const [productos, setProductos] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [ordenesData, productosData, categoriasData] = await Promise.all([
        ordenesService.obtenerTodasAdmin().catch(() => []),
        productosService.obtenerTodos().catch(() => []),
        categoriasService.obtenerTodas().catch(() => [])
      ])

      setOrdenes(Array.isArray(ordenesData) ? ordenesData : [])
      setProductos(Array.isArray(productosData) ? productosData : [])

      // Calcular estadísticas
      const totalVentas = (Array.isArray(ordenesData) ? ordenesData : [])
        .filter(o => o.estado === 'completada' || o.estado === 'pagado' || o.estado === 'en_camino')
        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0)

      const ordenesPendientes = (Array.isArray(ordenesData) ? ordenesData : [])
        .filter(o => o.estado === 'pendiente').length

      setEstadisticas({
        totalVentas,
        ordenesTotales: (Array.isArray(ordenesData) ? ordenesData : []).length,
        ordenesPendientes,
        productosActivos: (Array.isArray(productosData) ? productosData : []).filter(p => p.activo).length,
        categoriasTotal: (Array.isArray(categoriasData) ? categoriasData : []).length
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  // Productos más vendidos
  const productosMasVendidos = () => {
    const ventasPorProducto = {}

    ordenes.forEach(orden => {
      orden.items?.forEach(item => {
        const productoId = item.productoId
        if (!ventasPorProducto[productoId]) {
          ventasPorProducto[productoId] = {
            producto: item.producto,
            cantidad: 0,
            ingresos: 0
          }
        }
        ventasPorProducto[productoId].cantidad += item.cantidad
        ventasPorProducto[productoId].ingresos += item.precioUnitario * item.cantidad
      })
    })

    return Object.values(ventasPorProducto)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }

  // Órdenes recientes
  const ordenesRecientes = ordenes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)] mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-[var(--persian-plum-900)] mt-1">
                ${estadisticas.totalVentas.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes Totales</p>
              <p className="text-2xl font-bold text-[var(--persian-plum-900)] mt-1">
                {estadisticas.ordenesTotales}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes Pendientes</p>
              <p className="text-2xl font-bold text-[var(--persian-plum-900)] mt-1">
                {estadisticas.ordenesPendientes}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productos Activos</p>
              <p className="text-2xl font-bold text-[var(--persian-plum-900)] mt-1">
                {estadisticas.productosActivos}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-[var(--persian-plum-900)] mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {productosMasVendidos().length > 0 ? (
              productosMasVendidos().map((item, index) => (
                <div key={index} className="flex items-center gap-3 pb-4 border-b border-gray-200 last:border-0">
                  <img
                    src={item.producto?.imagenUrl || '/images/placeholder.png'}
                    alt={item.producto?.nombre}
                    className="w-12 h-12 object-contain rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.producto?.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {item.cantidad} unidades vendidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--persian-plum-900)]">
                      ${item.ingresos.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No hay ventas registradas</p>
            )}
          </div>
        </div>

        {/* Órdenes recientes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-[var(--persian-plum-900)] mb-4">
            Órdenes Recientes
          </h3>
          <div className="space-y-4">
            {ordenesRecientes.length > 0 ? (
              ordenesRecientes.map((orden) => (
                <div key={orden.id} className="pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">Orden #{orden.id}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      orden.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                      orden.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      orden.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {orden.estado}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{orden.usuario?.nombre || 'Sin nombre'}</span>
                    <span className="font-bold text-[var(--persian-plum-900)]">
                      ${orden.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(orden.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No hay órdenes registradas</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumen por estado */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-[var(--persian-plum-900)] mb-4">
          Órdenes por Estado
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['pendiente', 'completada', 'en_camino', 'cancelada', 'pagado'].map(estado => {
            const cantidad = ordenes.filter(o => o.estado === estado).length
            const colorClass = 
              estado === 'completada' ? 'bg-green-50 border-green-200' :
              estado === 'pendiente' ? 'bg-yellow-50 border-yellow-200' :
              estado === 'en_camino' ? 'bg-blue-50 border-blue-200' :
              estado === 'cancelada' ? 'bg-red-50 border-red-200' :
              'bg-purple-50 border-purple-200'
            
            return (
              <div key={estado} className={`text-center p-4 rounded-lg border-2 ${colorClass}`}>
                <p className="text-2xl font-bold text-[var(--persian-plum-900)]">{cantidad}</p>
                <p className="text-sm text-gray-700 capitalize mt-1">
                  {estado === 'en_camino' ? 'En camino' : estado}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resumen adicional */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[var(--persian-plum-500)] to-[var(--persian-plum-700)] rounded-lg shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Promedio por Orden</h4>
          <p className="text-3xl font-bold">
            ${estadisticas.ordenesTotales > 0 
              ? (estadisticas.totalVentas / estadisticas.ordenesTotales).toFixed(2)
              : '0.00'
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Total Categorías</h4>
          <p className="text-3xl font-bold">{estadisticas.categoriasTotal}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Total Productos</h4>
          <p className="text-3xl font-bold">{productos.length}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
