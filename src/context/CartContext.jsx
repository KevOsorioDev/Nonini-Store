import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

const newCartItemId = () => (
  crypto.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const roundValue = (value) => Math.round(Number(value) * 10) / 10

const itemSignature = (item) => JSON.stringify({
  id: item.id,
  prenda: item.prenda,
  color: item.color,
  talle: item.talle,
  logoUrl: item.logoUrl || '',
  top: roundValue(item.logoPosition?.top ?? 0),
  left: roundValue(item.logoPosition?.left ?? 0),
  size: roundValue(item.logoSize ?? 0)
})

const isSameCartItem = (a, b) => itemSignature(a) === itemSignature(b)

const CART_KEY = 'nonini-cart'

const withCartItemId = (item) => ({
  ...item,
  cartItemId: item.cartItemId || newCartItemId()
})

const loadSessionCart = () => {
  try {
    localStorage.removeItem(CART_KEY)
    const savedCart = sessionStorage.getItem(CART_KEY)
    const parsed = savedCart ? JSON.parse(savedCart) : []
    return Array.isArray(parsed) ? parsed.map(withCartItemId) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadSessionCart)

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => isSameCartItem(item, product))

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].cantidad += product.cantidad || 1
        return updatedCart
      }

      return [...prevCart, withCartItemId({ ...product, cantidad: product.cantidad || 1 })]
    })
  }

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    )
  }

  const updateCartItem = (cartItemId, updates) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, ...updates, cartItemId }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0)
  }

  const isInCart = (product) => {
    return cart.some((item) => isSameCartItem(item, product))
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
