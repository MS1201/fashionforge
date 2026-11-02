import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiBox, 
  FiEdit, FiTrash2, FiPlus, FiCheckCircle, FiRefreshCw 
} from 'react-icons/fi'
import { userAPI, productAPI, orderAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProd, setNewProd] = useState({
    name: '', price: '', originalPrice: '', category: 'Men', subCategory: 'Shirts',
    brand: '', stock: 50, description: '', imageUrl: ''
  })

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Admin clearance required')
      navigate('/')
      return
    }

    const loadAdminData = async () => {
      setLoading(true)
      try {
        const [statsRes, prodsRes, ordersRes, usersRes] = await Promise.all([
          userAPI.getDashboardStats(),
          productAPI.getAll({ limit: 50 }),
          orderAPI.getAll({ limit: 50 }),
          userAPI.getAll({ limit: 50 })
        ])
        setStats(statsRes.data.stats)
        setProducts(prodsRes.data.products || [])
        setOrders(ordersRes.data.orders || [])
        setUsers(usersRes.data.users || [])
      } catch (err) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [user, navigate])

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: newProd.name,
        price: Number(newProd.price),
        originalPrice: Number(newProd.originalPrice || newProd.price),
        category: newProd.category,
        subCategory: newProd.subCategory,
        brand: newProd.brand,
        stock: Number(newProd.stock),
        description: newProd.description,
        images: [{ url: newProd.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' }],
        sizes: ['S', 'M', 'L', 'XL']
      }
      const res = await productAPI.create(payload)
      setProducts([res.data.product, ...products])
      setShowAddProduct(false)
      toast.success('Product created successfully!')
      setNewProd({ name: '', price: '', originalPrice: '', category: 'Men', subCategory: 'Shirts', brand: '', stock: 50, description: '', imageUrl: '' })
    } catch (err) {
      toast.error('Failed to create product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await productAPI.delete(id)
      setProducts(products.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch (err) {
      toast.error('Failed to remove product')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Order marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time metrics, inventory management & order dispatch</p>
          </div>
          <button 
            onClick={() => setShowAddProduct(true)}
            className="btn-primary !py-2.5 !px-4 text-xs font-bold"
          >
            <FiPlus size={16} /> Add New Product
          </button>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="card p-5 border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Gross Revenue</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatPrice(stats?.totalRevenue || 0)}</h3>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <FiDollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Total Orders</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalOrders || orders.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FiShoppingBag size={24} />
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Inventory SKUs</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalProducts || products.length}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <FiBox size={24} />
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Active Customers</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stats?.totalUsers || users.length}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <FiUsers size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-6">
          {['overview', 'products', 'orders', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Management View */}
        {activeTab === 'products' && (
          <div className="card p-6 overflow-x-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Store Inventory Catalog ({products.length})</h2>
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.images?.[0]?.url} alt="" className="w-10 h-12 object-cover rounded-md" />
                      <div>
                        <span className="font-bold text-gray-900 block truncate max-w-[200px]">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">★ {p.rating.toFixed(1)} ({p.numReviews})</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Management View */}
        {(activeTab === 'orders' || activeTab === 'overview') && (
          <div className="card p-6 overflow-x-auto mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Orders & Fulfillment ({orders.length})</h2>
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{o.user?.name || o.shippingAddress?.fullName}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(o.createdAt)}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{formatPrice(o.totalPrice)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className="border border-gray-200 rounded-lg p-1 text-xs bg-white text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users View */}
        {activeTab === 'users' && (
          <div className="card p-6 overflow-x-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Registered User Accounts ({users.length})</h2>
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-7 h-7 rounded-full" />
                      <span className="font-semibold text-gray-900">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add New Fashion Product</h3>
                <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={newProd.name}
                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                    className="input-field !py-2 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={newProd.price}
                      onChange={e => setNewProd({ ...newProd, price: e.target.value })}
                      className="input-field !py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={newProd.originalPrice}
                      onChange={e => setNewProd({ ...newProd, originalPrice: e.target.value })}
                      className="input-field !py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                      className="input-field !py-2 text-xs"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Brand</label>
                    <input
                      type="text"
                      value={newProd.brand}
                      onChange={e => setNewProd({ ...newProd, brand: e.target.value })}
                      className="input-field !py-2 text-xs"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Image URL (Unsplash or direct)</label>
                  <input
                    type="url"
                    value={newProd.imageUrl}
                    onChange={e => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="input-field !py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Description</label>
                  <textarea
                    value={newProd.description}
                    onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                    className="input-field !py-2 text-xs h-20"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="btn-ghost !py-2 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary !py-2 text-xs font-bold">Publish Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
