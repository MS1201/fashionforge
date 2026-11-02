# FashionForge E-Commerce Platform

A production-ready Full-Stack MERN (MongoDB, Express, React, Node.js) E-Commerce Web Application built with Tailwind CSS, Framer Motion, and Stripe/JWT authentication.

---

## 🌟 Key Features for 15-20 Min Project Presentation

1. **Architecture & Tech Stack**:
   - **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, React Hot Toast, React Icons.
   - **Backend**: Node.js, Express.js REST API with modular controllers, routes, and middleware.
   - **Database**: MongoDB with Mongoose ODM schemas for Users, Products, Orders, and Reviews.
   - **Security**: JWT authentication, bcrypt password hashing, role-based authorization (Admin / Customer).

2. **Customer Flow & UI/UX**:
   - **Interactive Landing Page**: Auto-playing hero carousel, featured collections, banner discounts, and verified reviews.
   - **Product Discovery & Multi-Facet Filtering**: Category selection, price range sliders, sizing tags, keyword search, and dynamic sorting.
   - **Product Detail Experience**: Multi-image galleries, sizing/color selectors, live inventory checks, stock levels, and interactive rating system.
   - **Shopping Cart & Flyout Drawer**: Real-time quantity adjustments, free shipping progress bar, promo coupon engine (`FASHION20`, `FIRST10`, `FLAT500`).
   - **Multi-Step Checkout**: Address management, delivery options, payment gateway simulation (Stripe / COD / UPI).
   - **Order Lifecycle & Tracking**: Visual order status timeline (Pending → Confirmed → Processing → Dispatched → Delivered), printable invoices.
   - **Wishlist & Customer Profile**: Saved items, address book management, password updates.

3. **Admin Dashboard**:
   - Real-time business metrics (Gross revenue, total orders count, inventory catalog, registered users).
   - Inventory management (Create product, delete, edit stocks).
   - Order fulfillment control (Update statuses, mark as dispatched/delivered).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
npm run seed     # Seeds 20+ realistic fashion items & demo admin/user accounts
npm run dev      # Runs API on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev      # Runs Vite app on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

- **Admin Account**:
  - Email: `admin@fashionforge.com`
  - Password: `admin123`
  - Access: Full Admin Dashboard `/admin`

- **Customer Account**:
  - Email: `user@fashionforge.com`
  - Password: `user123`

---

## 🌐 Deploy to Render

### Backend Web Service
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your long random secret
   - `NODE_ENV`: `production`

### Frontend Static Site
1. Create a new **Static Site** on Render.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: URL of your backend deployed on Render (e.g., `https://fashionforge-api.onrender.com/api`)
