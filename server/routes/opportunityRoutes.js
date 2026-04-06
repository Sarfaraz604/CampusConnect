// server/routes/opportunityRoutes.js
const express = require('express');
const router = express.Router();
const Opportunity = require('../models/opportunity');
const User = require('../models/users');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// Get all opportunities + filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 });
    
    // Fetch author details for each opportunity
    const opportunitiesWithAuthors = await Promise.all(
      opportunities.map(async (opp) => {
        const author = await User.findOne({ email: opp.authorEmail });
        return {
          ...opp.toObject(),
          authorName: author ? author.name : 'Unknown Author'
        };
      })
    );
    
    res.json(opportunitiesWithAuthors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new opportunity 
// server/routes/opportunityRoutes.js
router.post('/createOpportunity', isAuthenticated, async (req, res) => {
  try {
    console.log('Request reached createOpportunity');
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User in request:', req.user);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'No authenticated user found' });
    }

    // Get the current count for projectId
    const count = await Opportunity.countDocuments();
    const projectId = `PRJ-${(count + 1).toString().padStart(4, '0')}`;

    const opportunityData = {
      projectId,
      title: req.body.title,
      description: req.body.description,
      amount: Number(req.body.amount),
      category: req.body.category,
      details: req.body.details,
      authorEmail: req.user.email,
      tags: req.body.tags || [],
      status: 'pending'
    };

    console.log('Creating opportunity with data:', opportunityData);

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();
    
    console.log('Opportunity created successfully:', opportunity);
    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include mongoose validation errors if any
    });
  }
});


// Get opportunities by author email
router.get('/author/:email', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ authorEmail: req.params.email });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;