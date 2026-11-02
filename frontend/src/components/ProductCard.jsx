import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice } from '../utils/helpers'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const wishlisted = isWishlisted(product._id)
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, product.sizes?.[0] || null, product.colors?.[0]?.name || null)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group card overflow-hidden"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative product-img-wrapper bg-gray-100 aspect-[3/4]">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discountPercent > 0 && (
              <span className="badge bg-primary-600 text-white font-bold">
                -{discountPercent}%
              </span>
            )}
            {product.trending && (
              <span className="badge bg-orange-500 text-white">
                🔥 Trending
              </span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-800 text-white">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all ${
                wishlisted
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <FiHeart size={15} className={wishlisted ? 'fill-current' : ''} />
            </motion.button>
            <Link
              to={`/products/${product._id}`}
              className="w-9 h-9 bg-white text-gray-600 hover:bg-primary-600 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <FiEye size={15} />
            </Link>
          </div>

          {/* Quick add button */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FiShoppingCart size={16} />
                Quick Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium mb-1">{product.brand}</p>
          <h3 className="text-gray-900 font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <FiStar
                  key={star}
                  size={12}
                  className={star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-base">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {product.sizes.slice(0, 4).map(size => (
                <span key={size} className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard

