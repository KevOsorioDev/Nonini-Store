import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { pedidosService } from '../services/api'
import { useCart } from '../context/useCart'
import logo from '../assets/images/nonini_logo.png'

export const PagoExitoPage = () => {
  const { ordenId } = useParams()
  const [searchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [orden, setOrden] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearCart()

    const confirmar = async () => {
      const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
      try {
        if (paymentId) {
          const data = await pedidosService.confirmarPago(ordenId, paymentId)
          setOrden(data.pedido || data)
        } else {
          const data = await pedidosService.obtenerPorCodigo(ordenId)
          setOrden(data.pedido || data)
        }
      } catch (error) {
        console.error('Error al confirmar el pedido:', error)
        try {
          const data = await pedidosService.obtenerPorCodigo(ordenId)
          setOrden(data.pedido || data)
        } catch {
          setOrden(null)
        }
      } finally {
        setLoading(false)
      }
    }

    confirmar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)]"></div>
      </div>
    )
  }

  const codigo = orden?.codigo || ordenId
  const pagado = orden?.estado === 'pagado'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {pagado ? '¡Pago exitoso!' : 'Recibimos tu pedido'}
          </h1>
          <p className="text-lg text-gray-600">
            {pagado ? 'Tu orden quedó confirmada' : 'Estamos confirmando el pago con Mercado Pago'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de orden</p>
              <p className="font-mono font-semibold text-[var(--persian-plum-900)]">
                {codigo}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-[var(--persian-plum-700)]">
                ${Number(orden?.total || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${pagado ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              <span className={`font-medium capitalize ${pagado ? 'text-green-700' : 'text-amber-700'}`}>
                {orden?.estado || 'pendiente'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--persian-plum-600)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Mail de confirmación</p>
              <p className="text-sm text-gray-600">
                {pagado
                  ? 'Te enviamos un email con el detalle del pedido'
                  : 'Cuando Mercado Pago confirme el pago, te llega el mail'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--persian-plum-600)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Preparando tu pedido</p>
              <p className="text-sm text-gray-600">
                El bordado arranca cuando el pago está aprobado. Estimado: 3-5 días hábiles.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/"
            className="w-full py-3 px-4 bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors text-center"
          >
            Volver al inicio
          </Link>
          <Link
            to="/ordenes"
            className="w-full py-3 px-4 border-2 border-[var(--persian-plum-600)] text-[var(--persian-plum-600)] font-medium rounded-lg hover:bg-[var(--persian-plum-50)] transition-colors text-center"
          >
            Ver mis pedidos
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <img src={logo} alt="Nonini Store" className="h-12 mx-auto opacity-50" />
          <p className="text-sm text-gray-500 mt-2">
            Gracias por tu compra
          </p>
        </div>
      </div>
    </div>
  )
}
