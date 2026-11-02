import React from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-primary-600">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-1">Stay in Style</h3>
              <p className="text-primary-100 text-sm">Subscribe to get exclusive deals, style tips & new arrivals</p>
            </div>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex gap-3 w-full md:w-auto min-w-[340px]"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-white text-primary-600 px-5 py-3 rounded-lg font-semibold text-sm hover:bg-primary-50 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-display font-bold text-white">
                Fashion<span className="text-primary-400">Forge</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your ultimate destination for premium fashion. We bring you the latest trends with unbeatable quality and style.
            </p>
            <div className="flex items-center gap-3">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Men's Collection", to: '/products?category=Men' },
                { label: "Women's Collection", to: '/products?category=Women' },
                { label: "Kids Fashion", to: '/products?category=Kids' },
                { label: "Accessories", to: '/products?category=Accessories' },
                { label: "Footwear", to: '/products?category=Footwear' },
                { label: "Sale & Offers", to: '/products?sort=newest' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-5">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { label: 'My Account', to: '/profile' },
                { label: 'Order Tracking', to: '/orders' },
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'Returns & Exchanges', to: '#' },
                { label: 'Size Guide', to: '#' },
                { label: 'FAQ', to: '#' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Fashion Street, Style City, Mumbai - 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={16} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={16} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:support@fashionforge.com" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">support@fashionforge.com</a>
              </li>
            </ul>

            {/* Payment methods */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">We Accept</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['VISA', 'MC', 'UPI', 'NET', 'COD'].map(p => (
                  <span key={p} className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FashionForge. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Made with <FiHeart size={14} className="text-primary-500 fill-current" /> by the FashionForge Team
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

