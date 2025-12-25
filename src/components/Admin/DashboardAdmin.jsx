import { useState, useEffect } from 'react'
import { ordenesService, productosService } from '../../services/api'

const DashboardAdmin = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ordenesTotales: 0,
    ordenesPendientes: 0,
    productosActivos: 0
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
      const [ordenesData, productosData] = await Promise.all([
        ordenesService.obtenerTodasAdmin(),
        productosService.obtenerTodos()
      ])

      setOrdenes(ordenesData)
      setProductos(productosData)

      // Calcular estadísticas
      const totalVentas = ordenesData
        .filter(o => o.estado === 'pagado' || o.estado === 'enviado' || o.estado === 'entregado')
        .reduce((sum, o) => sum + parseFloat(o.total), 0)

      const ordenesPendientes = ordenesData.filter(o => o.estado === 'pendiente').length

      setEstadisticas({
        totalVentas,
        ordenesTotales: ordenesData.length,
        ordenesPendientes,
        productosActivos: productosData.length
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
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
          {['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].map(estado => {
            const cantidad = ordenes.filter(o => o.estado === estado).length
            return (
              <div key={estado} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-[var(--persian-plum-900)]">{cantidad}</p>
                <p className="text-sm text-gray-600 capitalize mt-1">{estado}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
