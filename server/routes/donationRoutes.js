// server/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const User = require('../models/users'); // Make sure you have the correct path to your User model

// POST /api/donations
// Create donation with default status "pending"
router.post('/', async (req, res) => {
  try {
    const donationData = req.body; // e.g., name, email, amount, etc.
    const donation = new Donation(donationData);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET /api/donations
// Return only accepted donations for public display
router.get('/', async (req, res) => {
  try {
    // 1) Find accepted donations
    const donations = await Donation.find({ status: 'accepted' })
      .sort({ createdAt: -1 });

    // 2) For each donation, lookup the user to get the user name
    const donationsWithUserName = await Promise.all(
      donations.map(async (donation) => {
        // find user by email
        const user = await User.findOne({ email: donation.email });

        // convert donation doc to a plain JS object
        const donationObj = donation.toObject();
        // attach userName
        donationObj.userName = user ? user.name : 'Unknown User';

        return donationObj;
      })
    );

    res.json(donationsWithUserName);
  } catch (error) {
    console.error('Error fetching accepted donations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
