const express = require('express');
const router = express.Router();

// Cart is stored client-side (localStorage) for simplicity
// This route provides server-side cart sync
router.get('/', (req, res) => res.json({ success: true, message: 'Cart is managed client-side' }));

module.exports = router;

