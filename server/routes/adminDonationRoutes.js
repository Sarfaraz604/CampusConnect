// server/routes/adminDonationRoutes.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const { verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/donations/admin
// Retrieve all funding requests (for admin review)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/donations/admin/:id/accept
// Accept a funding request by updating its status to "accepted"
router.patch('/:id/accept', verifyAdmin, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    donation.status = 'accepted';
    await donation.save();
    res.json({ message: 'Donation accepted', data: donation });
  } catch (error) {
    console.error('Error accepting donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/donations/admin/:id
// Reject a funding request by deleting it from the database
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json({ message: 'Donation rejected and deleted' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
