import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, ordenesService } from '../services/api'

export const MisOrdenesPage = () => {
  const navigate = useNavigate()
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchOrdenes = async () => {
      try {
        const data = await ordenesService.obtenerMisOrdenes()
        setOrdenes(Array.isArray(data) ? data : data?.ordenes || [])
      } catch {
        setError('No pudimos cargar tus órdenes. Intenta más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrdenes()
  }, [navigate])

  if (loading) {
    return (
      <section className="w-[90vw] max-w-5xl mx-auto py-12">
        <p className="text-lg text-[var(--persian-plum-800)]">Cargando órdenes...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-[90vw] max-w-5xl mx-auto py-12">
        <p className="text-lg text-red-600">{error}</p>
      </section>
    )
  }

  return (
    <section className="w-[90vw] max-w-6xl mx-auto py-12 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--persian-plum-900)]">Mis órdenes</h1>
        <button
          className="px-4 py-2 rounded-xl bg-[var(--persian-plum-500)] text-white text-sm font-semibold hover:bg-[var(--persian-plum-600)] transition-colors"
          onClick={() => navigate('/productos')}
        >
          Seguir comprando
        </button>
      </div>

      {ordenes.length === 0 ? (
        <p className="text-[var(--persian-plum-700)]">No tienes órdenes registradas.</p>
      ) : (
        <div className="grid gap-4">
          {ordenes.map((orden) => (
            <article
              key={orden.id || orden._id}
              className="border border-[var(--persian-plum-100)] rounded-2xl p-5 bg-white shadow-sm"
            >
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <span className="text-lg font-semibold text-[var(--persian-plum-900)]">
                    Orden #{orden.codigo || orden.id || orden._id}
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-[var(--persian-plum-100)] text-[var(--persian-plum-700)]">
                    {orden.estado || orden.status || 'Pendiente'}
                  </span>
                </div>
                <div className="text-[var(--persian-plum-800)] font-semibold">
                  Total: {orden.total ? `$${orden.total}` : 'No informado'}
                </div>
              </div>
              <div className="mt-2 text-sm text-[var(--persian-plum-600)]">
                {orden.fecha || orden.createdAt || ''}
              </div>
              {Array.isArray(orden.items) && orden.items.length > 0 && (
                <ul className="mt-3 text-sm text-[var(--persian-plum-800)] list-disc list-inside space-y-1">
                  {orden.items.map((item, idx) => (
                    <li key={idx}>
                      {item.nombre || item.name || 'Producto'} — Cantidad: {item.cantidad || item.qty || 1}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisOrdenesPage
