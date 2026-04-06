// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// GET /api/users
// Admin-only route to fetch all users
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//for message , convos search
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const { search } = req.query;

    // Validate search query
    if (!search || search.trim().length < 2) {
      return res.status(400).json({ error: 'Search query too short' });
    }

    // Log the search query and current user
    console.log('Search Query:', search);
    console.log('Current User ID:', req.user._id);

    // Build search query with more robust name matching
    const query = {
      $or: [
        // Exact name match
        { name: { $regex: `^${search}`, $options: 'i' } },
        
        // Partial name match (anywhere in the name)
        { name: { $regex: search, $options: 'i' } },
        
        // Email match
        { email: { $regex: search, $options: 'i' } }
      ],
      // Exclude the current user from search results
      _id: { $ne: req.user._id }
    };

    // Find users, limit results, and select specific fields
    const users = await User.find(query)
      .sort({ name: 1 })
      .limit(10)
      .select('_id name email role branch batch');

    // Log found users
    console.log('Found Users:', users);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    console.error('Error Details:', error.message);
    console.error('Error Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

// PATCH /api/users/:id/role
// Admin-only route to update a user's role
router.patch('/:id/role', verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
