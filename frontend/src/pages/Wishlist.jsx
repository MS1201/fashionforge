import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

const Wishlist = () => {
  const { wishlist } = useWishlist()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="pt-[105px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 text-primary-600">
            <FiHeart size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Your Saved Pieces</h2>
          <p className="text-gray-500 mb-6 text-sm">Please log in to synchronize and view your favorite items across all your devices.</p>
          <Link to="/login" className="btn-primary w-full">Sign In to Continue</Link>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="pt-[105px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-400">
            <FiHeart size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Save your most-coveted items by clicking the heart icon while you browse.</p>
          <Link to="/products" className="btn-primary">
            Explore Collections <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Saved Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved for later</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
