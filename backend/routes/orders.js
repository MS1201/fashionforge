const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  updateOrderToPaid, updateOrderStatus,
  getAllOrders, cancelOrder, getOrderStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/stats', protect, admin, getOrderStats);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;

