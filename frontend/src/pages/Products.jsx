import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiSliders } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { productAPI } from '../utils/api'
import { formatPrice } from '../utils/helpers'

const CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Sports']
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Name A-Z', value: 'name' }
]
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'Free Size']

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 })
  const [brands, setBrands] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])

  const filters = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sizes: searchParams.get('sizes') || '',
    featured: searchParams.get('featured') || '',
    trending: searchParams.get('trending') || ''
  }

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    setSearchParams(params)
  }

  const clearAllFilters = () => {
    setSearchParams({})
    setPriceRange([0, 10000])
  }

  useEffect(() => {
    productAPI.getBrands().then(r => setBrands(r.data.brands || [])).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {}
        if (filters.keyword) params.keyword = filters.keyword
        if (filters.category) params.category = filters.category
        if (filters.brand) params.brand = filters.brand
        if (filters.sort) params.sort = filters.sort
        if (filters.page) params.page = filters.page
        if (filters.minPrice) params.minPrice = filters.minPrice
        if (filters.maxPrice) params.maxPrice = filters.maxPrice
        if (filters.sizes) params.sizes = filters.sizes
        if (filters.featured) params.featured = filters.featured
        if (filters.trending) params.trending = filters.trending
        params.limit = 12
        const res = await productAPI.getAll(params)
        setProducts(res.data.products || [])
        setPagination(res.data.pagination || { total: 0, pages: 1, page: 1 })
      } catch (err) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchParams.toString()])

  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.sizes, filters.featured, filters.trending].filter(Boolean).length

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.category === cat
                  ? 'bg-primary-600 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={e => setPriceRange([0, parseInt(e.target.value)])}
            onMouseUp={() => { setFilter('minPrice', '0'); setFilter('maxPrice', priceRange[1].toString()) }}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatPrice(0)}</span>
            <span className="font-medium text-primary-600">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={e => setFilter('minPrice', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={e => setFilter('maxPrice', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => {
            const selected = filters.sizes.split(',').includes(size)
            return (
              <button
                key={size}
                onClick={() => {
                  const arr = filters.sizes ? filters.sizes.split(',') : []
                  const newArr = selected ? arr.filter(s => s !== size) : [...arr, size]
                  setFilter('sizes', newArr.join(','))
                }}
                className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                  selected ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 text-gray-600 hover:border-primary-400'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand.split(',').includes(brand)}
                  onChange={e => {
                    const arr = filters.brand ? filters.brand.split(',') : []
                    const newArr = e.target.checked ? [...arr, brand] : arr.filter(b => b !== brand)
                    setFilter('brand', newArr.join(','))
                  }}
                  className="accent-primary-600"
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Special */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Special</h3>
        <div className="space-y-2">
          {[
            { label: '⭐ Featured', key: 'featured', value: 'true' },
            { label: '🔥 Trending', key: 'trending', value: 'true' }
          ].map(({ label, key, value }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[key] === value}
                onChange={e => setFilter(key, e.target.checked ? value : '')}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearAllFilters} className="w-full btn-outline text-sm !py-2">
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  )

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {filters.category || filters.keyword || 'All Products'}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {filters.category ? `${filters.category}'s Collection` : filters.keyword ? `Search: "${filters.keyword}"` : 'All Products'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{pagination.total} products found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden btn-outline !py-2.5 text-sm"
            >
              <FiSliders size={16} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => setFilter('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-5 sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="badge bg-primary-100 text-primary-700">{activeFiltersCount} active</span>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active filter pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="badge bg-primary-100 text-primary-700 !px-3 !py-1.5 gap-1.5">
                    {filters.category}
                    <button onClick={() => setFilter('category', '')} className="hover:text-primary-900"><FiX size={12} /></button>
                  </span>
                )}
                {filters.keyword && (
                  <span className="badge bg-primary-100 text-primary-700 !px-3 !py-1.5 gap-1.5">
                    Search: {filters.keyword}
                    <button onClick={() => setFilter('keyword', '')} className="hover:text-primary-900"><FiX size={12} /></button>
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="badge bg-primary-100 text-primary-700 !px-3 !py-1.5 gap-1.5">
                    Max: {formatPrice(filters.maxPrice)}
                    <button onClick={() => setFilter('maxPrice', '')} className="hover:text-primary-900"><FiX size={12} /></button>
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading
                ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.length === 0
                  ? (
                    <div className="col-span-full text-center py-20">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                      <button onClick={clearAllFilters} className="btn-primary">Clear Filters</button>
                    </div>
                  )
                  : products.map(product => <ProductCard key={product._id} product={product} />)
              }
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilter('page', (filters.page - 1).toString())}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setFilter('page', page.toString())}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        filters.page === page
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilter('page', (filters.page + 1).toString())}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/50 z-50 lg:hidden" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-5"><FilterSidebar /></div>
              <div className="p-5 border-t">
                <button onClick={() => setShowFilters(false)} className="btn-primary w-full">
                  Show {pagination.total} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Products
