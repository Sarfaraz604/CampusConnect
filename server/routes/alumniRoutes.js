// server/routes/alumniRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// GET /api/alumni - fetch alumni profiles with optional filters and pagination
router.get('/', async (req, res) => {
  try {
    const { batch, branch, currentCompany, location, name, page, limit } = req.query;
    // Base filter: only alumni
    const filter = { role: 'alumni' };

    if (batch) {
      filter.batch = batch;
    }
    if (branch) {
      filter.branchCode = branch;
    }
    if (currentCompany) {
      filter.currentCompany = { $regex: currentCompany, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (name) {
      // Add regex filter for name search
      filter.name = { $regex: name, $options: 'i' };
    }

    // Pagination: default to page 1 and limit 10 if not provided
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Count total documents for pagination
    const total = await User.countDocuments(filter);
    const alumni = await User.find(filter)
      .select('name batch location currentCompany currentCompanyRole branch socialLinks')
      .skip(skip)
      .limit(limitNum);

    res.json({
      data: alumni,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    
    // Find alumni whose names match the input (case-insensitive) and limit results
    const suggestions = await User.find({ 
      role: 'alumni', 
      name: { $regex: name, $options: 'i' } 
    })
    .limit(5)
    .select('name'); // Only need the name for suggestions

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

module.exports = router;
