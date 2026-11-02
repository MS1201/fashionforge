import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('fashionforge_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('fashionforge_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems(prev => {
      const key = `${product._id}-${size}-${color}`
      const existing = prev.find(item => `${item._id}-${item.selectedSize}-${item.selectedColor}` === key)
      if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > product.stock) {
          toast.error('Not enough stock available')
          return prev
        }
        toast.success('Quantity updated in cart')
        return prev.map(item =>
          `${item._id}-${item.selectedSize}-${item.selectedColor}` === key
            ? { ...item, quantity: newQty }
            : item
        )
      }
      if (quantity > product.stock) {
        toast.error('Not enough stock available')
        return prev
      }
      toast.success('Added to cart! 🛒')
      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }]
    })
  }

  const removeFromCart = (productId, size, color) => {
    setCartItems(prev => prev.filter(item =>
      !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
    ))
    toast.success('Removed from cart')
  }

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('fashionforge_cart')
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingPrice = cartSubtotal > 999 ? 0 : 99
  const taxPrice = Math.round(cartSubtotal * 0.18 * 100) / 100
  const cartTotal = cartSubtotal + shippingPrice + taxPrice

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartSubtotal, shippingPrice, taxPrice, cartTotal,
      isOpen, setIsOpen, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

