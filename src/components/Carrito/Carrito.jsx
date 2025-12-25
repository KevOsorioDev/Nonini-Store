import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { authService } from '../../services/api'
import toast from 'react-hot-toast'

export const Carrito = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!authService.isAuthenticated()) {
      toast.error('Debes iniciar sesión para continuar')
      onClose()
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }

    onClose()
    navigate('/checkout')
  }
  
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.dataset.scrollY = scrollY

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        delete document.body.dataset.scrollY
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9998]">
      <div className="absolute inset-0 bg-black/70 transition-opacity duration-300"
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--persian-plum-900)]">
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            className="relative w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <span className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-gray-600 leading-none">×</span>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)]">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
              <p className="text-gray-500 text-center text-sm sm:text-base">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.color}-${item.talle}-${item.prenda}-${index}`}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-[var(--persian-plum-900)] truncate">
                        {item.nombre}
                      </h3>
                      <div className="flex flex-col gap-0.5 sm:gap-1 mt-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Prenda:</span> {item.prenda}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Talle:</span> {item.talle}
                        </p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Color:</span>
                          <div 
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 ${item.color}`}
                            title="Color seleccionado"
                          />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-[var(--persian-plum-700)] mt-1 sm:mt-2">
                        ${item.precio}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.color,
                              item.talle,
                              item.prenda,
                              item.cantidad - 1
                            )
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.cantidad}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.color,
                              item.talle,
                              item.prenda,
                              item.cantidad + 1
                            )
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.color, item.talle, item.prenda)
                          }
                          className="ml-auto text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-base sm:text-lg font-semibold text-[var(--persian-plum-900)]">
                    Total ({getCartCount()} items):
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[var(--persian-plum-700)]">
                    ${getCartTotal().toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors"
                >
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body
  )
}
