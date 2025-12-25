import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const Modal = ({ isOpen, onClose, children, returnFocusRef }) => {
  const panelRef = useRef(null)

  // Bloquear scroll y manejar ESC
  useEffect(() => {
    if (isOpen) {
      // Guardar el valor actual
      const prevOverflow = document.body.style.overflow
      const prevPosition = document.body.style.position
      const prevTop = document.body.style.top
      const prevWidth = document.body.style.width
      
      // Bloquear scroll completamente (funciona con Lenis)
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      // Preservar el estado del navbar guardando el scroll actual
      document.body.dataset.scrollY = scrollY

      const onKey = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKey)

      // Restaurar al desmontar o cerrar
      return () => {
        window.removeEventListener('keydown', onKey)
        document.body.style.position = prevPosition
        document.body.style.top = prevTop
        document.body.style.width = prevWidth
        document.body.style.overflow = prevOverflow
        delete document.body.dataset.scrollY
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen, onClose])

  // Devolver foco al elemento que abrió el modal
  // Comentado para evitar autofocus no deseado
  // useEffect(() => {
  //   if (!isOpen && returnFocusRef?.current) {
  //     returnFocusRef.current.focus()
  //   }
  // }, [isOpen, returnFocusRef])

  if (!isOpen) return null

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/70 z-[9998]" onClick={onClose}>

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[80vw] h-auto md:h-[80vh] max-h-[90vh] bg-[var(--persian-plum-50)] rounded-2xl shadow-2xl z-[9999] overflow-auto p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl cursor-pointer"
            aria-label="Cerrar"
          >
            ×
          </button>

          {children}
        </div>
      </div>
    </>,
    document.body
  )
}
