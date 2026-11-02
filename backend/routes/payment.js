const express = require('express');
const router = express.Router();
const { createPaymentIntent, validateCoupon } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/validate-coupon', protect, validateCoupon);

module.exports = router;

