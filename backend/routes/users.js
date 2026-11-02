const express = require('express');
const router = express.Router();
const {
  getUsers, getUser, updateUser, deleteUser,
  getDashboardStats, getWishlist, toggleWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist/:productId', protect, toggleWishlist);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;

