import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCheck, FiPackage, FiTruck, FiMapPin, FiArrowLeft, FiClock, FiDownload } from 'react-icons/fi'
import { orderAPI } from '../utils/api'
import { formatPrice, formatDate, getStatusColor, getStatusIcon } from '../utils/helpers'
import toast from 'react-hot-toast'

const timelineSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOne(id)
        setOrder(res.data.order)
      } catch (err) {
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="pt-[110px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-[110px] min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <Link to="/orders" className="btn-primary mt-2">Back to Orders</Link>
      </div>
    )
  }

  const currentStepIndex = timelineSteps.indexOf(order.status)

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/orders" className="text-xs font-semibold text-gray-600 hover:text-primary-600 flex items-center gap-1.5">
            <FiArrowLeft size={14} /> Back to Orders
          </Link>
          <span className={`badge ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)} {order.status.toUpperCase()}
          </span>
        </div>

        {/* Order Header Card */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order ID: #{order._id}</h1>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)} • Tracking Code: <span className="font-semibold text-primary-600">{order.trackingNumber || 'FF-TRK-PENDING'}</span>
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="btn-outline !py-2 !px-4 text-xs"
            >
              <FiDownload size={14} /> Print Invoice
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="py-8">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
              {timelineSteps.map((s, idx) => {
                const isPassed = currentStepIndex >= idx
                return (
                  <div key={s} className="flex flex-col items-center z-10">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isPassed ? <FiCheck size={16} /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 capitalize ${isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s}
                    </span>
                  </div>
                )
              })}
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.max(0, (currentStepIndex / (timelineSteps.length - 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Ordered Items ({order.orderItems.length})</h2>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Size: {item.size || 'Free Size'} {item.color && `• Color: ${item.color}`}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery & Payment Details */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FiMapPin className="text-primary-600" /> Shipping Information
              </h2>
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold text-sm text-gray-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                <p>Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Payment Breakdown</h2>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Taxes</span>
                  <span className="text-gray-900">{formatPrice(order.taxPrice)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Code Applied</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total Amount Paid</span>
                  <span className="text-primary-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
