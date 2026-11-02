import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHeart, FiShoppingCart, FiStar, FiCheck, FiTruck, 
  FiShield, FiRefreshCw, FiShare2, FiArrowLeft, FiMinus, FiPlus 
} from 'react-icons/fi'
import { productAPI, reviewAPI } from '../utils/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatDate } from '../utils/helpers'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')

  // Review submission state
  const [reviews, setReviews] = useState([])
  const [newRating, setNewRating] = useState(5)
  const [newTitle, setNewTitle] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true)
      try {
        const [prodRes, revRes] = await Promise.all([
          productAPI.getOne(id),
          reviewAPI.getByProduct(id)
        ])
        setProduct(prodRes.data.product)
        setReviews(revRes.data.reviews || [])
        if (prodRes.data.product.sizes?.length > 0) {
          setSelectedSize(prodRes.data.product.sizes[0])
        }
        if (prodRes.data.product.colors?.length > 0) {
          setSelectedColor(prodRes.data.product.colors[0].name)
        }
      } catch (err) {
        toast.error('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }
    fetchProductAndReviews()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    addToCart(product, quantity, selectedSize, selectedColor)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to submit a review')
      navigate('/login')
      return
    }
    if (!newTitle.trim() || !newComment.trim()) {
      toast.error('Please provide both title and comment')
      return
    }

    setSubmittingReview(true)
    try {
      const res = await reviewAPI.create(id, {
        rating: newRating,
        title: newTitle,
        comment: newComment
      })
      setReviews([res.data.review, ...reviews])
      setNewTitle('')
      setNewComment('')
      toast.success('Review submitted successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-[110px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product experience...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-[110px] min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The requested item might have been removed or is unavailable.</p>
        <Link to="/products" className="btn-primary">Browse All Products</Link>
      </div>
    )
  }

  const isFav = isWishlisted(product._id)
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="pt-[110px] min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 mb-6">
        <div className="container-custom flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img 
                  src={product.images?.[selectedImage]?.url || product.images?.[0]?.url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isFav ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <FiHeart size={20} className={isFav ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === idx ? 'border-primary-600 shadow-md scale-95' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-1">
                {product.brand}
              </span>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <StarRating rating={product.rating} size={15} />
                  <span className="text-xs font-bold text-amber-900 ml-1.5">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                <span className="text-gray-300">|</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-sm font-semibold text-emerald-600">Save {formatPrice(product.originalPrice - product.price)}</span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-sm font-semibold text-gray-900">Select Size</label>
                    <button className="text-xs text-primary-600 hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[48px] h-11 px-3 rounded-xl border text-sm font-medium transition-all ${
                          selectedSize === s
                            ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900 block mb-2.5">
                    Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-9 h-9 rounded-full border-2 p-0.5 transition-all ${
                          selectedColor === c.name ? 'border-primary-600 scale-110 shadow-sm' : 'border-transparent'
                        }`}
                        title={c.name}
                      >
                        <span 
                          className="w-full h-full rounded-full block border border-black/10" 
                          style={{ backgroundColor: c.hex || '#ddd' }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-900 block mb-2.5">Quantity</label>
                <div className="inline-flex items-center border border-gray-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 !py-3.5 text-base shadow-lg shadow-primary-500/20"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-outline flex-1 !py-3.5 text-base"
                >
                  Buy Now
                </button>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FiTruck size={18} className="text-primary-600" />
                  <span>Free standard delivery above ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRefreshCw size={18} className="text-primary-600" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield size={18} className="text-primary-600" />
                  <span>100% Genuine Branded Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info (Description, Specs, Reviews) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="flex border-b border-gray-100 gap-8 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Material & Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags:</span>
                  {product.tags.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-500 font-medium block mb-1">Fabric & Material</span>
                <span className="font-semibold text-gray-900">{product.material || 'Premium blended cotton'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="text-gray-500 font-medium block mb-1">Care Guidelines</span>
                <span className="font-semibold text-gray-900">{product.careInstructions || 'Machine wash warm, tumble dry low'}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Write a review form */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Write a Review</h3>
                <p className="text-sm text-gray-500 mb-4">Share your thoughts and fitting experience with the community</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Rating</label>
                    <StarRating rating={newRating} interactive onRate={setNewRating} size={22} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Review Headline</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Perfect fit and exceptional comfort!"
                      className="input-field !py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Detailed Review</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share details about fabric feel, sizing accuracy, and durability..."
                      className="input-field !py-2 text-sm h-24"
                      required
                    />
                  </div>
                  <button type="submit" disabled={submittingReview} className="btn-primary !py-2.5 text-sm">
                    {submittingReview ? 'Posting Review...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="p-4 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img 
                            src={r.user?.avatar || 'https://ui-avatars.com/api/?background=E11D48&color=fff'} 
                            alt={r.user?.name} 
                            className="w-7 h-7 rounded-full object-cover" 
                          />
                          <span className="font-semibold text-sm text-gray-800">{r.user?.name || 'Verified Buyer'}</span>
                          {r.verified && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} size={14} />
                        <h4 className="font-semibold text-sm text-gray-900">{r.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
