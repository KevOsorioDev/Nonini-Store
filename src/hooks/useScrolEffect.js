import { useEffect, useState, useCallback } from 'react'

export const useScrollEffect = () => {
  const [transformed, setTransformed] = useState(false)

  const handleScroll = useCallback(() => {
    // Si hay un modal abierto, usar el scroll guardado
    const scrollY = document.body.dataset.scrollY
      ? parseInt(document.body.dataset.scrollY)
      : window.scrollY

    // Usar un pequeño threshold para evitar flickering
    const shouldTransform = scrollY > 10

    if (shouldTransform !== transformed) {
      setTransformed(shouldTransform)
    }
  }, [transformed])

  useEffect(() => {
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return transformed
}