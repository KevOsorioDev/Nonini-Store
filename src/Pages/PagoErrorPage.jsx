import { Link, useParams } from 'react-router-dom'
import logo from '../assets/images/nonini_logo.png'

export const PagoErrorPage = () => {
  const { ordenId } = useParams()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Icono de error */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Pago No Completado
          </h1>
          <p className="text-lg text-gray-600">
            Hubo un problema al procesar tu pago
          </p>
        </div>

        {/* Información del error */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-red-900 mb-1">¿Qué pasó?</p>
              <p className="text-sm text-red-800">
                Tu pago no pudo ser procesado. Esto puede deberse a fondos insuficientes, 
                datos incorrectos de la tarjeta, o un problema temporal con el procesador de pagos.
              </p>
            </div>
          </div>
        </div>

        {/* Razones comunes */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Razones comunes:</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">Fondos insuficientes en la tarjeta</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">Información de la tarjeta incorrecta</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">La tarjeta fue rechazada por el banco</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">Límite de compras diario alcanzado</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700">Problema temporal de conexión</span>
            </li>
          </ul>
        </div>

        {/* Qué hacer ahora */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-blue-900 mb-1">¿Qué puedes hacer?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Verifica los datos de tu tarjeta e intenta nuevamente</li>
                <li>• Usa una tarjeta diferente</li>
                <li>• Prueba con otro método de pago (MercadoPago)</li>
                <li>• Contacta a tu banco para verificar el problema</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tu orden */}
        {ordenId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Tu orden fue guardada</p>
            <p className="font-mono font-semibold text-[var(--persian-plum-900)]">
              #{ordenId.toString().padStart(6, '0')}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Los productos permanecerán en tu carrito. Puedes intentar el pago nuevamente.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/checkout"
            className="w-full py-3 px-4 bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors text-center"
          >
            Intentar nuevamente
          </Link>
          <Link
            to="/"
            className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Soporte */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
            <a 
              href="mailto:soporte@noninistore.com"
              className="text-[var(--persian-plum-600)] hover:text-[var(--persian-plum-700)] font-medium inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              soporte@noninistore.com
            </a>
          </div>

          <img src={logo} alt="Nonini Store" className="h-12 mx-auto opacity-50 mt-6" />
        </div>
      </div>
    </div>
  )
}
