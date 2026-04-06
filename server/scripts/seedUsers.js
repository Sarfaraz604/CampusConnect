const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    name: 'Anuj Sanjay Singh',
    email: 'bt22cse113@iiitagartala.ac.in',
    password: 'anuj123!',
    role: 'student',
    dob: new Date('2003-08-08'),
    branch: 'Computer Science',
    currentCompany: 'IIIT Agartala',
    location: 'Agartala',
    batch: '2022',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/anujsanjaysingh/',
      instagram: 'https://www.instagram.com/glockholm',
      github: 'https://github.com/AnujSinghML',
      x: 'https://x.com/anujsingh_08?t=iZX1epaBvzYhjavy1_nIIw&s=09'
    },
    personalEmail: 'anujsanjaysinghwork@gmail.com'
  },
  {
    name: 'Vasu Parashar',
    email: 'bt22csd021@iiitagartala.ac.in',
    password: 'vasu123!', 
    role: 'student',
    dob: new Date('2004-08-18'),
    branch: 'Computer Science - Data Science',
    currentCompany: null,
    currentCompanyRole: '',
    location: 'Agartala',
    batch: '2022',
    homeTown: 'Saharanpur,UP',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/vashuprashar',
      instagram: 'https://www.instagram.com/vashuprashar',
      github: 'https://github.com/vashuprashar',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Amit Yadav',
    email: 'bt20ece001@iiitagartala.ac.in',
    password: 'amit123!',
    role: 'alumni',
    dob: new Date('2002-06-20'),
    branch: 'Electronics and Communication Engineering ',
    currentCompany: 'OceanGate',
    currentCompanyRole: 'SDE-1',
    location: 'Pune',
    batch: '2020',
    homeTown: 'Haryana',
    socialLinks: {
      linkedin: 'https://www.linkedin.com',
      instagram: 'https://www.instagram.com',
      github: '',
      x: 'https://x.com/'
    },
    personalEmail: null
  },
  {
    name: 'Admin1',
    email: 'admin@iiitagartala.ac.in',
    password: 'admin123!',
    role: 'admin',
    dob: new Date('1990-01-01'),
    branch: 'Administration',
    currentCompany: 'Indian Institute of Information Technology Agartala',
    location: 'Agartala',
    batch: 'N/A',
    homeTown: 'Agartala',
    socialLinks: {
      linkedin: '',
      instagram: 'https://www.instagram.com',
      github: '',
      x: 'https://x.com/'
    },
    personalEmail: null
  },
  {
    name: 'Parth Chatter',
    email: 'bt22cse109@iiitagartala.ac.in',
    password: 'parth123', 
    role: 'student',
    dob: new Date('2004-12-06'),
    branch: 'Computer Science',
    currentCompany: null,
    currentCompanyRole: '',
    location: 'Agartala',
    batch: '2022',
    homeTown: 'Indore,MP',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/parthchatter',
      instagram: 'https://www.instagram.com/vashuprashar',
      github: 'https://github.com/parthh6',
      x: null
    },
    personalEmail: null
  },
  // Add additional alumni/users here as needed...
  {
    name: 'Ashok Tripathi',
    email: 'bt20cse001@iiitagartala.ac.in',
    password: 'ashok123!',
    role: 'alumni',
    dob: new Date('2002-06-03'),
    branch: 'Computer Science',
    currentCompany: 'Amazon',
    currentCompanyRole: 'SWE',
    location: 'Banglore',
    batch: '2020',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Simran Ahuja',
    email: 'bt20cse002@iiitagartala.ac.in',
    password: 'simran123!',
    role: 'alumni',
    dob: new Date('2002-07-21'),
    branch: 'Computer Science',
    currentCompany: 'Flipkart',
    currentCompanyRole: 'SDE - 1',
    location: 'Banglore',
    batch: '2020',
    homeTown: 'Agartala',
    socialLinks: {
      linkedin: '',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Rudransh Singh',
    email: 'bt19cse001@iiitagartala.ac.in',
    password: 'rudransh123!',
    role: 'alumni',
    dob: new Date('2000-08-01'),
    branch: 'Computer Science',
    currentCompany: 'Google',
    currentCompanyRole: 'SDE - 2',
    location: 'Banglore',
    batch: '2019',
    homeTown: 'Lucknow',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Rashmi Singhania',
    email: 'bt19cse002@iiitagartala.ac.in',
    password: 'rashmi123!',
    role: 'alumni',
    dob: new Date('2000-06-21'),
    branch: 'Computer Science',
    currentCompany: 'Flipkart',
    currentCompanyRole: 'SDE - 2',
    location: 'Hyderabad',
    batch: '2019',
    homeTown: 'Hyderabad',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com',
      github: 'https://github.com/',
      x: null
    },
    personalEmail: null
  },
  {
    name: 'Amir Shaikh',
    email: 'bt18cse001@iiitagartala.ac.in',
    password: 'amir123!',
    role: 'alumni',
    dob: new Date('1999-09-20'),
    branch: 'Computer Science',
    currentCompany: 'Mercedes',
    currentCompanyRole: 'ML Engineer',
    location: 'Germany',
    batch: '2019',
    homeTown: 'Mumbai',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://www.instagram.com/',
      github: 'https://github.com/',
      x: 'https://x.com/'
    },
    personalEmail: null
  },


//friends:
{
  name: 'Raj Gupta',
  email: 'bt22cse105@iiitagartala.ac.in',
  password: 'rajx123!', 
  role: 'student',
  dob: new Date('2003-09-16'),
  branch: 'Computer Science and Engineering',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Shahdol',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
},
{
  name: 'Sujay kamble',
  email: 'bt22cse034@iiitagartala.ac.in',
  password: 'sujay123!', 
  role: 'student',
  dob: new Date('2004-09-23'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Agartala',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
},
{
  name: 'Mohammad Tabish Sohail',
  email: 'bt22cse050@iiitagartala.ac.in',
  password: 'tabish123!', 
  role: 'student',
  dob: new Date('2003-06-01'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Patna',
  socialLinks: {
    linkedin: null,
    instagram: 'https://www.instagram.com/tabish._21',
    github: null,
    x: null
  },
  personalEmail: 'tabishs080@gmail.com'
},
{
  name: 'keyur londhe',
  email: 'bt22cse005@iiitagartala.ac.in',
  password: 'keyur123!', 
  role: 'student',
  dob: new Date('2004-04-26'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Sambhaji Nagar,MH',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
  },
{
  name: 'Sumedh sabne',
  email: 'bt22csh020@iiitagartala.ac.in',
  password: 'sumedh123!', 
  role: 'student',
  dob: new Date('2003-09-09'),
  branch: 'Computer Science HCI & GT',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Nanded, MH',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
},
{
  name: 'Naval Makwana',
  email: 'bt22cse018@iiitagartala.ac.in',
  password: 'naval123!', 
  role: 'student',
  dob: new Date('2004-12-11'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Mumbai,MH',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
},
{
  name: 'Ankush Jha',
  email: 'bt22csh023@iiitagartala.ac.in',
  password: 'ankush123!', 
  role: 'student',
  dob: new Date('2003-08-09'),
  branch: 'Computer Science - HCI & GT',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Virar, MH',
  socialLinks: {
    linkedin: '',
    instagram: '',
    github: '',
    x: null
  },
  personalEmail: null
},
{
  name: 'Ojas Kamble',
  email: 'bt22cse107@iiitagartala.ac.in',
  password: 'ojas123!', 
  role: 'student',
  dob: new Date('2003-12-08'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Agartala, Tripura',
  socialLinks: {
    linkedin: null,
    instagram: null,
    github: null,
    x: null
  },
  personalEmail: null
},
{
  name: 'visitor1',
  email: 'visitor1@iiitagartala.ac.in',
  password: 'visitor1', 
  role: 'visitor',
  dob: new Date('2003-12-08'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Mumbai, MH',
  batch: '2022',
  homeTown: 'Mumbai, MH',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/anujsanjaysingh/',
    instagram: 'https://www.instagram.com',
    github: 'https://github.com',
    x: null
  },
  personalEmail: null
},
{
  name: 'visitor2',
  email: 'visitor2@iiitagartala.ac.in',
  password: 'visitor2', 
  role: 'visitor',
  dob: new Date('2003-12-08'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Agartala, Tripura',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/anujsanjaysingh/',
    instagram: 'https://www.instagram.com',
    github: 'https://github.com',
    x: null
  },
  personalEmail: null
},
{
  name: 'Parth Chatter',
  email: 'bt22cse109@iiitagartala.ac.in',
  password: 'parth123!', 
  role: 'student',
  dob: new Date('2004-12-06'),
  branch: 'Computer Science',
  currentCompany: null,
  currentCompanyRole: '',
  location: 'Agartala',
  batch: '2022',
  homeTown: 'Indore,MP',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/parthchatter',
    instagram: '',
    github: 'https://github.com/parthh6',
    x: null
  },
  personalEmail: null
}

];

// const seedUsers = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('Connected to MongoDB...');
    
//     // Step 1: Delete all existing user documents
//     await User.deleteMany({});
//     console.log('All existing users deleted');
    
//     // Step 2: Create each user individually to trigger the pre-save hook
//     // that will hash the passwords automatically
//     for (const userData of users) {
//       const user = new User(userData);
//       await user.save();
//       console.log(`Added user: ${userData.email}`);
//     }
    
//     console.log(`${users.length} users successfully added to the database`);
    
//     // Close the database connection
//     await mongoose.connection.close();
//     console.log('Database connection closed');
    
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     if (mongoose.connection.readyState === 1) {
//       await mongoose.connection.close();
//       console.log('Database connection closed after error');
//     }
//     process.exit(1);
//   }
// };

// Run seeder

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    // Keep track of operations
    let addedCount = 0;
    let skippedCount = 0;
    
    // Process each user in the seed data
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`Skipped existing user: ${userData.email}`);
        skippedCount++;
        continue; // Skip to next user
      }

      // Create new user if doesn't exist
      const user = new User(userData);
      await user.save();
      console.log(`Added new user: ${userData.email}`);
      addedCount++;
    }
    
    // Log summary
    console.log('\nSeeding Summary:');
    console.log(`✅ New users added: ${addedCount}`);
    console.log(`⏭️ Existing users skipped: ${skippedCount}`);
    console.log(`📊 Total users processed: ${users.length}`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed after error');
    }
    process.exit(1);
  }
};

seedUsers();
