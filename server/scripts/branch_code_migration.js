// scripts/migrateBranchData.js
const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

// Define mappings from old branch values to new standardized values
const branchMappings = {
  // Map any existing branch text to proper code and standard name
  'Computer Science': { code: 'CSE', name: 'Computer Science' },
  'Computer Science Engineering': { code: 'CSE', name: 'Computer Science' },
  'Computer Science and Engineering': { code: 'CSE', name: 'Computer Science' },
  'CSE': { code: 'CSE', name: 'Computer Science' },
  
  'Artificial Intelligence': { code: 'CSA', name: 'Computer Science - AI/ML' },
  'Machine Learning': { code: 'CSA', name: 'Computer Science - AI/ML' },
  'AI & ML': { code: 'CSA', name: 'Computer Science - AI/ML' },
  'Computer Science and Artificial Intelligence': { code: 'CSA', name: 'Computer Science - AI/ML' },
  
  'Data Science': { code: 'CSD', name: 'Computer Science - DSA' },
  'Data Analytics': { code: 'CSD', name: 'Computer Science - DSA' },
  'Computer Science - Data Science': { code: 'CSD', name: 'Computer Science - DSA' },
  'Computer Science and Data Science': { code: 'CSD', name: 'Computer Science - DSA' },
  
  'Human Computer Interaction': { code: 'CSH', name: 'Computer Science - HCI & GT' },
  'HCI': { code: 'CSH', name: 'Computer Science - HCI & GT' },
  'Gaming Technology': { code: 'CSH', name: 'Computer Science - HCI & GT' },
  'Computer Science HCI & GT': { code: 'CSH', name: 'Computer Science - HCI & GT' },
  'Computer Science - HCI & GT': { code: 'CSH', name: 'Computer Science - HCI & GT' },
  
  'Electronics and Communication Engineering': { code: 'ECE', name: 'Electronics and Communication Engineering' },
  'Electronics and Communication': { code: 'ECE', name: 'Electronics and Communication Engineering' },
  'ECE': { code: 'ECE', name: 'Electronics and Communication Engineering' },
  
  'Internet of Things': { code: 'ECI', name: 'Internet of Things' },
  'Electronics and Instrumentation': { code: 'ECI', name: 'Internet of Things' },
  'ECI': { code: 'ECI', name: 'Internet of Things' }
};

// Fallback mapping function for branches not found in the direct mapping
const determineBranchMapping = (branchText) => {
  // Default to CSE if we can't determine
  let result = { code: 'CSE', name: 'Computer Science' };
  
  const lowerBranch = branchText.toLowerCase();
  
  if (lowerBranch.includes('data') || lowerBranch.includes('csd')) {
    result = { code: 'CSD', name: 'Computer Science - DSA' };
  } 
  else if (lowerBranch.includes('arti') || lowerBranch.includes('machine') || lowerBranch.includes('ai') || lowerBranch.includes('csa')) {
    result = { code: 'CSA', name: 'Computer Science - AI/ML' };
  }
  else if (lowerBranch.includes('hci') || lowerBranch.includes('human') || lowerBranch.includes('game') || lowerBranch.includes('csh')) {
    result = { code: 'CSH', name: 'Computer Science - HCI & GT' };
  }
  else if (lowerBranch.includes('electron') || lowerBranch.includes('communi') || lowerBranch.includes('ece')) {
    result = { code: 'ECE', name: 'Electronics and Communication Engineering' };
  }
  else if (lowerBranch.includes('iot') || lowerBranch.includes('instru') || lowerBranch.includes('eci')) {
    result = { code: 'ECI', name: 'Internet of Things' };
  }
  
  return result;
};

const migrateBranchData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);
    
    let updatedCount = 0;
    let unmappedCount = 0;
    
    for (const user of users) {
      const oldBranch = user.branch || '';
      
      // Try direct mapping first
      let mapping = branchMappings[oldBranch];
      
      // If no direct mapping, use fallback function
      if (!mapping) {
        mapping = determineBranchMapping(oldBranch);
        unmappedCount++;
        console.log(`No direct mapping for "${oldBranch}", using fallback: ${mapping.code} - ${mapping.name}`);
      }
      
      // Update user with standardized values
      user.branchCode = mapping.code;
      user.branch = mapping.name;
      await user.save();
      
      console.log(`Updated user ${user.email}: "${oldBranch}" => Code: ${mapping.code}, Name: ${mapping.name}`);
      updatedCount++;
    }
    
    console.log('\nMigration Summary:');
    console.log(`✅ Users updated: ${updatedCount}`);
    console.log(`⚠️ Users without direct mapping: ${unmappedCount}`);
    console.log(`📊 Total users processed: ${users.length}`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error migrating branch data:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

migrateBranchData();