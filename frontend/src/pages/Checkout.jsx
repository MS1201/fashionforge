import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiCreditCard, FiMapPin, FiArrowRight, FiArrowLeft, FiShield } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../utils/api'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const steps = ['Shipping Address', 'Payment Option', 'Review & Place']

const Checkout = () => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const { cartItems, cartSubtotal, shippingPrice, taxPrice, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { discount = 0, couponCode = '' } = location.state || {}

  const [address, setAddress] = useState(() => {
    const saved = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0]
    return saved ? {
      fullName: saved.fullName || user.name || '',
      phone: saved.phone || '',
      street: saved.street || '',
      city: saved.city || '',
      state: saved.state || '',
      zipCode: saved.zipCode || '',
      country: saved.country || 'India'
    } : {
      fullName: user?.name || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  })

  const [payment, setPayment] = useState('cod')
  const [addressErrors, setAddressErrors] = useState({})

  const validateAddress = () => {
    const errs = {}
    if (!address.fullName.trim()) errs.fullName = 'Full name is required'
    if (!address.phone.trim() || !/^[6-9]\d{9}$/.test(address.phone)) errs.phone = 'Enter valid 10-digit Indian mobile number'
    if (!address.street.trim()) errs.street = 'Street address is required'
    if (!address.city.trim()) errs.city = 'City is required'
    if (!address.state.trim()) errs.state = 'State is required'
    if (!address.zipCode.trim() || !/^\d{6}$/.test(address.zipCode)) errs.zipCode = 'Enter valid 6-digit postal PIN code'
    setAddressErrors(errs)
    return Object.keys(errs).length === 0
  }

  const finalTotal = Math.max(0, cartTotal - discount)

  const placeOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          size: item.selectedSize || 'Standard',
          color: item.selectedColor || 'Default'
        })),
        shippingAddress: address,
        paymentMethod: payment,
        couponCode
      }

      const res = await orderAPI.create(orderData)
      const order = res.data.order

      if (payment === 'cod') {
        clearCart()
        toast.success('Order placed successfully! 🎉')
        navigate(`/orders/${order._id}`)
      } else {
        // Mock instant payment confirmation
        await orderAPI.pay(order._id, {
          id: 'pay_' + Math.random().toString(36).substring(2, 12),
          status: 'COMPLETED',
          email_address: user.email
        })
        clearCart()
        toast.success('Payment verified! Order confirmed 🎉')
        navigate(`/orders/${order._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-[105px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-3">Cart is empty</h2>
          <p className="text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center max-w-xl mx-auto mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? <FiCheck size={18} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold mt-2 ${i === step ? 'text-primary-600' : 'text-gray-500'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Step 1: Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FiMapPin className="text-primary-600" /> Enter Delivery Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={e => setAddress({ ...address, fullName: e.target.value })}
                      className={`input-field !py-2.5 text-sm ${addressErrors.fullName ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.fullName && <p className="text-red-500 text-xs mt-1">{addressErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      placeholder="10-digit number"
                      className={`input-field !py-2.5 text-sm ${addressErrors.phone ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.phone && <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={e => setAddress({ ...address, street: e.target.value })}
                      placeholder="House / Flat / Street Name"
                      className={`input-field !py-2.5 text-sm ${addressErrors.street ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.street && <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className={`input-field !py-2.5 text-sm ${addressErrors.city ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      className={`input-field !py-2.5 text-sm ${addressErrors.state ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.state && <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                      placeholder="6 digits"
                      className={`input-field !py-2.5 text-sm ${addressErrors.zipCode ? 'border-red-400' : ''}`}
                    />
                    {addressErrors.zipCode && <p className="text-red-500 text-xs mt-1">{addressErrors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Country</label>
                    <input
                      type="text"
                      value={address.country}
                      disabled
                      className="input-field !py-2.5 text-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => { if (validateAddress()) setStep(1) }}
                    className="btn-primary !px-8"
                  >
                    Continue to Payment <FiArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FiCreditCard className="text-primary-600" /> Select Payment Option
                </h2>

                <div className="space-y-3 mb-6">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay with cash upon package receipt', icon: '💵' },
                    { value: 'card', label: 'Debit / Credit Card (Simulated)', desc: 'Instant authorization via Stripe API', icon: '💳' },
                    { value: 'upi', label: 'UPI / NetBanking', desc: 'Google Pay, PhonePe, Paytm, or NetBanking', icon: '⚡' }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        payment === opt.value ? 'border-primary-600 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        checked={payment === opt.value}
                        onChange={() => setPayment(opt.value)}
                        className="mt-1 accent-primary-600"
                      />
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button onClick={() => setStep(0)} className="btn-ghost text-sm">
                    <FiArrowLeft size={16} /> Back
                  </button>
                  <button onClick={() => setStep(2)} className="btn-primary !px-8">
                    Review Order <FiArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="card p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Shipping Destination</h3>
                    <button onClick={() => setStep(0)} className="text-xs text-primary-600 font-semibold hover:underline">Change</button>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">{address.fullName} ({address.phone})</p>
                  <p className="text-xs text-gray-600">{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                </div>

                <div className="card p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Payment Method</h3>
                    <button onClick={() => setStep(1)} className="text-xs text-primary-600 font-semibold hover:underline">Change</button>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-800">{payment} Payment</p>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Purchased Items ({cartItems.length})</h3>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map(item => (
                      <div key={`${item._id}-${item.selectedSize}`} className="py-2.5 flex items-center gap-3">
                        <img src={item.images?.[0]?.url} alt={item.name} className="w-12 h-14 object-cover rounded-lg border border-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500">Qty: {item.quantity} | Size: {item.selectedSize || 'Standard'}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setStep(1)} className="btn-ghost text-sm">
                    <FiArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="btn-primary !py-3.5 !px-8 text-sm shadow-lg shadow-primary-500/20"
                  >
                    {loading ? 'Authorizing & Placing...' : `Confirm & Pay ${formatPrice(finalTotal)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Pricing Overview Sidebar */}
          <div className="lg:w-80">
            <div className="card p-5 sticky top-28 space-y-4">
              <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">Price Breakdown</h3>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Bag Items Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className={shippingPrice === 0 ? 'text-emerald-600 font-semibold' : 'text-gray-900'}>
                    {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard GST (18%)</span>
                  <span className="text-gray-900">{formatPrice(taxPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Payable Amount</span>
                  <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-400">
                <FiShield className="text-emerald-500 flex-shrink-0" size={14} />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
