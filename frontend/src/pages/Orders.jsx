import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiChevronRight, FiClock } from 'react-icons/fi'
import { orderAPI } from '../utils/api'
import { formatPrice, formatDate, getStatusColor, getStatusIcon } from '../utils/helpers'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders()
        setOrders(res.data.orders || [])
      } catch (err) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Processing' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' }
  ]

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)

  if (loading) {
    return (
      <div className="pt-[110px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-500 text-sm mt-1">Track orders, manage returns, and view delivery updates</p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && orders.filter(o => o.status === tab.key).length > 0 && (
                <span className="ml-1.5 opacity-80 font-normal">
                  ({orders.filter(o => o.status === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FiPackage size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Found</h3>
            <p className="text-gray-500 text-xs mb-6">You don't have any orders matching this category.</p>
            <Link to="/products" className="btn-primary !py-2.5 text-xs">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order._id} className="card p-5 hover:border-gray-300 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-base text-gray-900">{formatPrice(order.totalPrice)}</span>
                    <span className="text-[11px] text-gray-400">{order.paymentMethod?.toUpperCase()} Payment</span>
                  </div>
                </div>

                <div className="py-4 flex items-center gap-4 overflow-x-auto">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />
                      <div className="max-w-[120px]">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity} | {item.size || 'Free Size'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FiClock size={14} className="text-primary-500" />
                    <span>Est. Delivery: {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Within 3-5 business days'}</span>
                  </div>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    Details & Invoice <FiChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
