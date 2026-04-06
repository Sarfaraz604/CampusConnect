// server\routes\profileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');

// Assuming you want to reuse the same auth check as in authRoutes
router.patch('/update', (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}, updateProfile);

module.exports = router;