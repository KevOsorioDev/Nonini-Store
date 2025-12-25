import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ordenesService } from '../services/api'
import logo from '../assets/images/nonini_logo.png'

export const PagoExitoPage = () => {
  const { ordenId } = useParams()
  const [orden, setOrden] = useState(null)
  const [loading, setLoading] = useState(true)

  const cargarOrden = async () => {
    try {
      const data = await ordenesService.obtenerOrdenPorId(ordenId)
      setOrden(data)
    } catch (error) {
      console.error('Error al cargar la orden:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarOrden()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-lg text-gray-600">
            Tu orden ha sido confirmada
          </p>
        </div>

        {/* Detalles de la orden */}
        {orden && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Número de orden</p>
                <p className="font-mono font-semibold text-[var(--persian-plum-900)]">
                  #{orden.id.toString().padStart(6, '0')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                <p className="text-2xl font-bold text-[var(--persian-plum-700)]">
                  ${orden.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium text-green-700 capitalize">
                  {orden.estado}
                </span>
              </div>
            </div>

            {orden.stripePaymentId && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-1">ID de pago</p>
                <p className="font-mono text-xs text-gray-700">
                  {orden.stripePaymentId}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--persian-plum-600)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Confirmación enviada</p>
              <p className="text-sm text-gray-600">
                Hemos enviado un email con los detalles de tu orden
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
                Comenzaremos a personalizar tus prendas inmediatamente
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[var(--persian-plum-600)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Tiempo estimado</p>
              <p className="text-sm text-gray-600">
                Tu pedido estará listo en 3-5 días hábiles
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/"
            className="w-full py-3 px-4 bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors text-center"
          >
            Volver al inicio
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full py-3 px-4 border-2 border-[var(--persian-plum-600)] text-[var(--persian-plum-600)] font-medium rounded-lg hover:bg-[var(--persian-plum-50)] transition-colors"
          >
            Imprimir recibo
          </button>
        </div>

        {/* Logo */}
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
