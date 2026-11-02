import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fashionforge_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fashionforge_token')
      localStorage.removeItem('fashionforge_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
  addAddress: (data) => API.post('/auth/address', data),
  deleteAddress: (id) => API.delete(`/auth/address/${id}`)
}

// Products
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  getCategories: () => API.get('/products/categories'),
  getBrands: () => API.get('/products/brands'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`)
}

// Orders
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getOne: (id) => API.get(`/orders/${id}`),
  pay: (id, data) => API.put(`/orders/${id}/pay`, data),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  getStats: () => API.get('/orders/stats')
}

// Reviews
export const reviewAPI = {
  getByProduct: (productId) => API.get(`/reviews/${productId}`),
  create: (productId, data) => API.post(`/reviews/${productId}`, data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`)
}

// Users (Admin)
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getOne: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
  getDashboardStats: () => API.get('/users/dashboard/stats'),
  getWishlist: () => API.get('/users/wishlist'),
  toggleWishlist: (productId) => API.put(`/users/wishlist/${productId}`)
}

// Payment
export const paymentAPI = {
  createIntent: (data) => API.post('/payment/create-intent', data),
  validateCoupon: (data) => API.post('/payment/validate-coupon', data)
}

export default API
