import { useContext } from 'react'
import { CartContext } from './CartContext'

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
