import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const Modal = ({ isOpen, onClose, children }) => {
  const panelRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      const prevPosition = document.body.style.position
      const prevTop = document.body.style.top
      const prevWidth = document.body.style.width

      // Lenis: lock con position fixed para no perder el scroll
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.body.dataset.scrollY = scrollY

      const onKey = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKey)

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
