import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import toast from 'react-hot-toast'
import { CartItemPreview } from '../ProductPreview/CartItemPreview'
import './Carrito.css'

export const Carrito = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9998]"
      style={{
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div 
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      <aside
        className={`cart-aside ${isOpen ? 'cart-aside--open' : ''}`}
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
                    className="cart-item flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                    style={{
                      animation: `slideInFromRight 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <CartItemPreview item={item} width={96} />
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
                          onClick={() => updateQuantity(item.cartItemId, item.cantidad - 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.cantidad + 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                        <button
                          onClick={() => {
                            onClose()
                            navigate(`/producto/${item.id}`, {
                              state: {
                                cartItemId: item.cartItemId,
                                id: item.id,
                                nombre: item.nombre,
                                precio: item.precio,
                                prenda: item.prenda,
                                color: item.color,
                                talle: item.talle,
                                logoUrl: item.logoUrl,
                                prendaImagen: item.prendaImagen,
                                logoPosition: item.logoPosition,
                                logoSize: item.logoSize,
                                sideSelected: item.sideSelected || 'custom',
                                cantidad: item.cantidad
                              }
                            })
                          }}
                          className="text-xs sm:text-sm text-[var(--persian-plum-700)] hover:text-[var(--persian-plum-900)] transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
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
                <div className="cart-total flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-base sm:text-lg font-semibold text-[var(--persian-plum-900)]">
                    Total ({getCartCount()} items):
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[var(--persian-plum-700)]">
                    ${getCartTotal().toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="checkout-button w-full py-2.5 sm:py-3 text-sm sm:text-base bg-[var(--persian-plum-600)] text-white font-medium rounded-lg hover:bg-[var(--persian-plum-700)] transition-colors"
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
