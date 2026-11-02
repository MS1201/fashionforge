import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'

const CartDrawer = () => {
  const { cartItems, isOpen, setIsOpen, removeFromCart, updateQuantity, cartSubtotal, shippingPrice, cartTotal, cartCount } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiShoppingBag className="text-primary-600" size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
                  <p className="text-xs text-gray-500">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag size={36} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6 text-sm">Add some amazing fashion pieces!</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Link to={`/products/${item._id}`} onClick={() => setIsOpen(false)} className="flex-shrink-0">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item._id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-semibold text-gray-900 text-sm hover:text-primary-600 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {item.selectedSize && (
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                      <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="px-3 text-sm font-semibold min-w-[28px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                    </span>
                  </div>
                  {shippingPrice > 0 && (
                    <p className="text-xs text-gray-400">Add {formatPrice(999 - cartSubtotal)} more for free shipping</p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout <FiArrowRight size={18} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer

