const express = require('express');
const router = express.Router();

// Wishlist is handled via users controller
router.get('/', (req, res) => res.json({ success: true, message: 'Use /api/users/wishlist' }));

module.exports = router;

