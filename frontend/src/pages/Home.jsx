import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { productAPI } from '../utils/api'

const categories = [
  { name: "Men", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80", color: "from-slate-800" },
  { name: "Women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", color: "from-rose-800" },
  { name: "Kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80", color: "from-amber-800" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80", color: "from-purple-800" },
  { name: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", color: "from-blue-800" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80", color: "from-green-800" }
]

const features = [
  { icon: FiTruck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: FiShield, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: FiHeadphones, title: "24/7 Support", desc: "Dedicated customer care" }
]

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getAll({ trending: true, limit: 8 })
        ])
        setFeatured(featuredRes.data.products || [])
        setTrending(trendingRes.data.products || [])
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="pt-[105px]">
      {/* Hero */}
      <HeroSlider />

      {/* Features */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Explore</p>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find your perfect style in our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${cat.name}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square block"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-60 group-hover:opacity-75 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                    <span className="text-white font-bold text-base group-hover:text-primary-200 transition-colors">{cat.name}</span>
                    <span className="text-white/70 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Shop Now <FiArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-1">Handpicked</p>
              <h2 className="section-title !mb-0">Featured Products</h2>
            </div>
            <Link to="/products?featured=true" className="btn-outline !py-2.5 hidden md:flex">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.slice(0, 8).map(product => <ProductCard key={product._id} product={product} />)
            }
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products?featured=true" className="btn-outline">View All Featured <FiArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
              alt="Special Offer"
              className="w-full h-80 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom text-white">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="max-w-md"
                >
                  <span className="badge bg-white/20 text-white border border-white/30 mb-4 backdrop-blur-sm !px-4 !py-1.5 text-sm">Limited Time Offer</span>
                  <h2 className="text-4xl font-display font-bold mb-3">Women's Special Sale</h2>
                  <p className="text-primary-100 mb-6">Up to 60% off on selected women's clothing and accessories</p>
                  <Link to="/products?category=Women" className="btn-primary bg-white !text-gray-900 hover:bg-gray-100">
                    Shop the Sale <FiArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-1">🔥 Hot Right Now</p>
              <h2 className="section-title !mb-0">Trending Now</h2>
            </div>
            <Link to="/products?trending=true" className="btn-outline !py-2.5 hidden md:flex">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading
              ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : trending.slice(0, 8).map(product => <ProductCard key={product._id} product={product} />)
            }
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Loved by thousands of fashion enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", rating: 5, text: "Absolutely love the quality! The fabric is premium and the fit is perfect. Will definitely shop again.", avatar: "PS", city: "Mumbai" },
              { name: "Rahul M.", rating: 5, text: "Fast delivery and amazing packaging. The bomber jacket exceeded my expectations. Highly recommend!", avatar: "RM", city: "Delhi" },
              { name: "Ananya K.", rating: 5, text: "The floral dress is stunning! Got so many compliments. FashionForge never disappoints!", avatar: "AK", city: "Bangalore" }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array(review.rating).fill(0).map((_, j) => (
                    <span key={j} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.city}</p>
                  </div>
                  <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">✓ Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
