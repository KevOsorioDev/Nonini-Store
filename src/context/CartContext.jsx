import { createContext, useState, useEffect } from 'react'

// Crear el contexto
export const CartContext = createContext()

// Provider del contexto
export const CartProvider = ({ children }) => {
  // Estado del carrito (persistido en localStorage)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('nonini-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Sincronizar con localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('nonini-cart', JSON.stringify(cart))
  }, [cart])

  // Función: Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Verificar si el producto ya existe (mismo id, color, talle, prenda)
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.talle === product.talle &&
          item.prenda === product.prenda
      )

      if (existingItemIndex > -1) {
        // Si existe, incrementar cantidad
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].cantidad += product.cantidad || 1
        return updatedCart
      } else {
        // Si no existe, agregarlo
        return [...prevCart, { ...product, cantidad: product.cantidad || 1 }]
      }
    })
  }

  // Función: Eliminar producto del carrito
  const removeFromCart = (productId, color, talle, prenda) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === productId &&
            item.color === color &&
            item.talle === talle &&
            item.prenda === prenda
          )
      )
    )
  }

  // Función: Actualizar cantidad de un producto
  const updateQuantity = (productId, color, talle, prenda, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, talle, prenda)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId &&
        item.color === color &&
        item.talle === talle &&
        item.prenda === prenda
          ? { ...item, cantidad: newQuantity }
          : item
      )
    )
  }

  // Función: Limpiar todo el carrito
  const clearCart = () => {
    setCart([])
  }

  // Función: Calcular total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  // Función: Obtener cantidad total de items
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0)
  }

  // Función: Verificar si un producto está en el carrito
  const isInCart = (productId, color, talle, prenda) => {
    return cart.some(
      (item) =>
        item.id === productId &&
        item.color === color &&
        item.talle === talle &&
        item.prenda === prenda
    )
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
