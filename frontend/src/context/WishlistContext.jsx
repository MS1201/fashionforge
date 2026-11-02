import React, { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../utils/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchWishlist()
    else setWishlist([])
  }, [user])

  const fetchWishlist = async () => {
    try {
      const res = await userAPI.getWishlist()
      setWishlist(res.data.wishlist || [])
    } catch {
      setWishlist([])
    }
  }

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }
    setLoading(true)
    try {
      const res = await userAPI.toggleWishlist(product._id)
      setWishlist(res.data.wishlist || [])
      if (res.data.action === 'added') {
        toast.success('Added to wishlist ❤️')
      } else {
        toast.success('Removed from wishlist')
      }
    } catch {
      toast.error('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  const isWishlisted = (productId) => {
    return wishlist.some(item => (item._id || item) === productId)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

