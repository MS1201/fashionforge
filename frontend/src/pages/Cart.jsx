import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/helpers'
import { paymentAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartSubtotal, shippingPrice, taxPrice, cartTotal, cartCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [coupon, setCoupon] = React.useState('')
  const [couponData, setCouponData] = React.useState(null)
  const [couponLoading, setCouponLoading] = React.useState(false)

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    if (!user) { toast.error('Please login to apply coupon'); return }
    setCouponLoading(true)
    try {
      const res = await paymentAPI.validateCoupon({ code: coupon })
      setCouponData(res.data.coupon)
      toast.success(res.data.coupon.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const getDiscount = () => {
    if (!couponData) return 0
    if (couponData.type === 'percent') return Math.round(cartSubtotal * couponData.discount / 100)
    if (couponData.type === 'flat') return couponData.discount
    if (couponData.type === 'shipping') return shippingPrice
    return 0
  }

  const discount = getDiscount()
  const finalTotal = cartTotal - discount

  if (cartItems.length === 0) {
    return (
      <div className="pt-[105px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your shopping bag is empty</h2>
          <p className="text-gray-500 mb-8">Discover our new arrivals and curate your ultimate style.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag</p>
          </div>
          <button 
            onClick={clearCart} 
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <FiTrash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="card p-5"
                >
                  <div className="flex gap-5">
                    <Link to={`/products/${item._id}`} className="flex-shrink-0">
                      <img src={item.images?.[0]?.url} alt={item.name} className="w-24 h-32 object-cover rounded-xl border border-gray-100" />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <Link to={`/products/${item._id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors text-base line-clamp-1">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mt-0.5">{item.brand}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.selectedSize && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <FiMinus size={13} />
                          </button>
                          <span className="px-3 py-1 font-bold text-xs text-gray-800 border-x border-gray-200">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus size={13} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-base text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          {item.quantity > 1 && (
                            <span className="block text-[11px] text-gray-400 font-normal">({formatPrice(item.price)} each)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-2">
              <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1.5">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="card p-6 sticky top-28 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h2>

              {/* Coupon Form */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Have a Promo Code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      placeholder="e.g. FASHION20"
                      className="input-field pl-9 !py-2 text-xs uppercase"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="btn-primary !py-2 !px-4 text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
                {couponData && (
                  <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg font-medium">
                    ✅ {couponData.message}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-gray-400">Available: FASHION20, FIRST10, FLAT500</p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold text-gray-800'}>
                    {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (GST 18%)</span>
                  <span className="font-semibold text-gray-800">{formatPrice(taxPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-gray-900 text-lg border-t border-gray-200 pt-4">
                  <span>Grand Total</span>
                  <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!user) { 
                    toast.error('Please login to checkout')
                    navigate('/login', { state: { from: { pathname: '/checkout' } } })
                    return 
                  }
                  navigate('/checkout', { state: { discount, couponCode: couponData?.code } })
                }}
                className="btn-primary w-full text-base !py-3.5 shadow-lg shadow-primary-500/20"
              >
                Proceed to Checkout <FiArrowRight size={18} />
              </button>

              <div className="text-center text-[11px] text-gray-400">
                🔒 Safe and Secure 256-Bit SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
