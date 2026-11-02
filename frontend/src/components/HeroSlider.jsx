import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    title: "Summer Collection 2024",
    subtitle: "New Arrivals",
    description: "Discover the latest trends in fashion. Elevate your style with our premium collection.",
    cta: "Shop Now",
    link: "/products?category=Women",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    tag: "Up to 50% Off",
    color: "from-rose-900/70"
  },
  {
    id: 2,
    title: "Men's Premium Line",
    subtitle: "Exclusive Styles",
    description: "Sophisticated fashion for the modern man. Quality craftsmanship meets contemporary design.",
    cta: "Explore Men's",
    link: "/products?category=Men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80",
    tag: "New Season",
    color: "from-slate-900/80"
  },
  {
    id: 3,
    title: "Accessories & More",
    subtitle: "Complete Your Look",
    description: "From bags to watches, find the perfect accessories to complement your outfit.",
    cta: "Shop Accessories",
    link: "/products?category=Accessories",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80",
    tag: "Free Shipping",
    color: "from-amber-900/70"
  }
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goTo = (index) => {
    setCurrent(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  return (
    <div className="relative h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} to-transparent`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-lg text-white"
            >
              <span className="inline-block bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                {slides[current].tag}
              </span>
              <p className="text-primary-200 text-lg font-medium mb-2">{slides[current].subtitle}</p>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                {slides[current].description}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to={slides[current].link}
                  className="btn-primary bg-white !text-gray-900 hover:bg-gray-100 !text-base !px-8 !py-4"
                >
                  {slides[current].cta} <FiArrowRight size={18} />
                </Link>
                <Link
                  to="/products"
                  className="text-white border border-white/40 hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-base transition-all"
                >
                  View All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
          key={current}
        />
      </div>
    </div>
  )
}

export default HeroSlider

