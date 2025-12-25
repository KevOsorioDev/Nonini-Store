import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/useCart'
import { authService, ordenesService } from '../services/api'
import logo from '../assets/images/nonini_logo.png'

export const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orden, setOrden] = useState(null)
  const [showMercadoPagoButton, setShowMercadoPagoButton] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      toast.error('Debes iniciar sesión para continuar')
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    // Verificar que hay productos en el carrito
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      navigate('/')
      return
    }

    setUser(authService.getCurrentUser())
    crearOrden()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const crearOrden = async () => {
    try {
      setLoading(true)

      // Preparar items de la orden
      const items = cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
        talle: item.talle,
        color: item.color,
        tipoPrenda: item.prenda
      }))

      const total = getCartTotal()

      // Crear orden en el backend
      const nuevaOrden = await ordenesService.crearOrden(items, total)
      setOrden(nuevaOrden)
    } catch (error) {
      console.error('Error al crear la orden:', error)
      toast.error('Error al procesar tu orden')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handlePagoMercadoPago = async () => {
    try {
      setShowMercadoPagoButton(true)
      
      // Crear preferencia de pago en MercadoPago
      const { initPoint } = await ordenesService.crearPagoMercadoPago(orden.id)
      
      // Redirigir a MercadoPago
      window.location.href = initPoint
    } catch (error) {
      console.error('Error al crear pago con MercadoPago:', error)
      toast.error('Error al procesar el pago con MercadoPago')
      setShowMercadoPagoButton(false)
    }
  }

  const handlePagoExitoso = () => {
    clearCart()
    navigate(`/orden/${orden.id}/exito`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--persian-plum-600)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparando tu orden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <img src={logo} alt="Nonini Store" className="h-14 sm:h-18 mx-auto mb-4 sm:mb-5" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--persian-plum-900)]">
            Finalizar Compra
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Resumen de la orden */}
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--persian-plum-900)] mb-4 sm:mb-5">
              Resumen de la orden
            </h2>

            {/* Usuario */}
            <div className="mb-5 sm:mb-7 pb-5 sm:pb-7 border-b border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Comprador</p>
              <p className="font-medium text-sm sm:text-base">{user?.nombre}</p>
              <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
            </div>

            {/* Productos */}
            <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-7">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-[var(--persian-plum-900)] truncate">
                      {item.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.prenda} | Talle: {item.talle} | Color: {item.color}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="font-medium text-sm sm:text-base text-[var(--persian-plum-700)] mt-1">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-[var(--persian-plum-900)] mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-300">
                <span>Total</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-7">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--persian-plum-900)] mb-5 sm:mb-7">
              Método de pago
            </h2>

            {/* MercadoPago */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800">
                  Serás redirigido a MercadoPago para completar tu pago de forma segura.
                </p>
              </div>

              <button
                onClick={handlePagoMercadoPago}
                disabled={showMercadoPagoButton}
                className="w-full py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-[#00A8FF] text-white font-medium rounded-lg hover:bg-[#0095E0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {showMercadoPagoButton ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    Pagar con MercadoPago
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                Aceptamos tarjetas de crédito, débito, efectivo y más
              </p>
            </div>

            {/* Seguridad */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Pago 100% seguro y encriptado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
