import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Carrito = ({ isOpen, onClose }) => {
  // Bloquear scroll cuando el carrito está abierto
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

  // Cerrar con tecla Escape
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
      {/* Backdrop - Fondo opaco */}
      <div 
        className="absolute inset-0 bg-black/70 transition-opacity duration-300"
        onClick={onClose}
        aria-label="Cerrar carrito"
      />

      {/* Panel del carrito - Se desliza desde la derecha */}
      <aside
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del carrito */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[var(--persian-plum-900)]">
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

        {/* Contenido del carrito (vacío por ahora) */}
        <div className="p-6">
          <p className="text-gray-500 text-center">Tu carrito está vacío</p>
        </div>
      </aside>
    </div>,
    document.body
  )
}
