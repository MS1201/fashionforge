import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fashionforge_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('fashionforge_token')
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('fashionforge_token')
          localStorage.removeItem('fashionforge_user')
          setUser(null)
        })
        .finally(() => setInitializing(false))
    } else {
      setInitializing(false)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('fashionforge_token', token)
      localStorage.setItem('fashionforge_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}! 👋`)
      return { success: true, user: userData }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const res = await authAPI.register({ name, email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('fashionforge_token', token)
      localStorage.setItem('fashionforge_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome to FashionForge, ${userData.name}! 🎉`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('fashionforge_token')
    localStorage.removeItem('fashionforge_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('fashionforge_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

