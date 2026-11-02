const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'inr' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    metadata: { userId: req.user._id.toString() }
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Validate coupon
// @route   POST /api/payment/validate-coupon
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupons = {
    'FASHION20': { discount: 20, type: 'percent', message: '20% off on your order!' },
    'FIRST10': { discount: 10, type: 'percent', message: '10% off for first order!' },
    'FLAT500': { discount: 500, type: 'flat', message: '₹500 flat discount!' },
    'FREESHIP': { discount: 0, type: 'shipping', message: 'Free shipping on your order!' }
  };

  const coupon = coupons[code?.toUpperCase()];
  if (!coupon) {
    res.status(400);
    throw new Error('Invalid coupon code');
  }

  res.json({ success: true, coupon: { code: code.toUpperCase(), ...coupon } });
});

module.exports = { createPaymentIntent, validateCoupon };

