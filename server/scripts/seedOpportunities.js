// server/seeders/seedOpportunities.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Opportunity = require('../models/opportunity');

dotenv.config();

const opportunities = [
  {
    title: "AI Startup Pitch",
    description: "A startup idea focused on AI solutions for healthcare.",
    amount: 100000,
    category: "startup",
    details: "Looking for investors to develop a prototype.",
    authorEmail: "bt22cse113@iiitagartala.ac.in", // Must match an existing user's email in your DB
    tags: ["AI", "healthcare", "startup"]
  },
  {
    title: "Research in Renewable Energy",
    description: "A research project for sustainable energy.",
    amount: 200000,
    category: "research",
    details: "Collaboration with university labs needed.",
    authorEmail: "bt21ece000@iiitagartala.ac.in", // Ensure this email exists in the user collection
    tags: ["renewable", "research", "sustainability"]
  },
  {
    title: "Patent for IoT Device",
    description: "Innovative IoT device patent opportunity.",
    amount: 150000,
    category: "patent",
    details: "Seeking industry partners for patent commercialization.",
    authorEmail: "bt22csd021@iiitagartala.ac.in", // Referencing an admin user in your DB
    tags: ["IoT", "patent", "innovation"]
  }
];

const seedOpportunities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing opportunities
    await Opportunity.deleteMany({});
    console.log('Cleared existing opportunities');

    // Save each opportunity individually so that pre-save hooks run
    for (const oppData of opportunities) {
      const opportunity = new Opportunity(oppData);
      await opportunity.save();
      console.log(`Created opportunity: ${opportunity.title} with projectId: ${opportunity.projectId}`);
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding opportunities:', error);
    process.exit(1);
  }
};

// Run seeder
seedOpportunities();
