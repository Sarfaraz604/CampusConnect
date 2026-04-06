const mongoose = require('mongoose');
const Job = require('../models/job');
const dotenv = require('dotenv');

dotenv.config();

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'TechInnovate',
    description: 'We are looking for a skilled Frontend Developer to join our growing team. The ideal candidate will have strong experience with React and modern JavaScript.',
    location: 'Bangalore, India',
    salary: '₹8,00,000 - ₹12,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 2+ years experience with React. Proficiency in HTML, CSS, and JavaScript. Experience with state management libraries like Redux.',
    responsibilities: 'Develop user interface components using React.js. Collaborate with backend developers to integrate REST APIs. Optimize applications for maximum performance and responsiveness.',
    authorEmail: 'bt19cse002@iiitagartala.ac.in',
    tags: ['React', 'JavaScript', 'Frontend', 'UI/UX'],
    status: 'active',
    // applicationUrl: 'https://techinnovate.careers/frontend-dev',
    applicationDeadline: new Date('2025-03-30')
  },
  {
    title: 'Machine Learning Engineer',
    company: 'DataMind AI',
    description: 'DataMind AI is seeking a passionate Machine Learning Engineer to help build our next-generation AI products for enterprise customers.',
    location: 'Pune, India',
    salary: '₹12,00,000 - ₹18,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'M.S. or Ph.D. in Computer Science, Machine Learning, or related field. Strong experience with PyTorch or TensorFlow. Knowledge of NLP, computer vision, or reinforcement learning.',
    responsibilities: 'Design and implement machine learning models. Work on data preprocessing and feature engineering. Deploy models to production environments. Research and implement latest ML techniques.',
    authorEmail: 'bt18cse001@iiitagartala.ac.in',
    tags: ['Machine Learning', 'AI', 'Python', 'PyTorch'],
    status: 'active',
    // applicationUrl: 'https://datamind.ai/careers/ml-engineer',
    applicationDeadline: new Date('2025-04-15')
  },
  {
    title: 'Software Engineering Intern',
    company: 'IIIT Agartala Research Lab',
    description: 'The IIIT Agartala Research Lab is looking for motivated software engineering interns to work on cutting-edge research projects in cybersecurity.',
    location: 'Agartala, Tripura',
    salary: '₹15,000 - ₹20,000 per month',
    employmentType: 'internship',
    requirements: 'Currently pursuing B.Tech/M.Tech in Computer Science or related field. Strong programming skills in Python or Java. Basic understanding of security concepts.',
    responsibilities: 'Assist in developing proof-of-concept implementations. Help with data collection and analysis. Participate in regular research discussions and presentations.',
    authorEmail: 'bt22cse113@iiitagartala.ac.in',
    tags: ['Internship', 'Cybersecurity', 'Research', 'Student'],
    status: 'active',
    // applicationUrl: 'https://www.iiitagartala.ac.in/',
    applicationDeadline: new Date('2025-05-01')
  },
  {
    title: 'Data Scientist',
    company: 'FinTech Solutions',
    description: 'FinTech Solutions is seeking a skilled Data Scientist to join our analytics team and help derive insights from financial data.',
    location: 'Mumbai, India',
    salary: '₹10,00,000 - ₹15,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'Master\'s degree in Statistics, Mathematics, or Computer Science. Experience with statistical analysis and machine learning. Proficiency in Python, R, and SQL.',
    responsibilities: 'Analyze large datasets to identify patterns and trends. Build predictive models for financial forecasting. Create data visualizations and reports for stakeholders.',
    authorEmail: 'bt19cse001@iiitagartala.ac.in',
    tags: ['Data Science', 'Finance', 'Statistics', 'Python'],
    status: 'active',
    // applicationUrl: 'https://fintechsolutions.in/careers/data-scientist',
    applicationDeadline: new Date('2025-03-15')
  },
  {
    title: 'Backend Developer',
    company: 'OceanGate',
    description: 'OceanGate is looking for a talented Backend Developer to strengthen our engineering team and help build scalable API services.',
    location: 'Pune, India',
    salary: '₹9,00,000 - ₹14,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'Bachelor\'s degree in Computer Science or equivalent. 3+ years experience in backend development. Proficiency in Node.js, Express, and MongoDB. Experience with API design and microservices.',
    responsibilities: 'Design and implement RESTful APIs. Optimize database schemas and queries. Implement authentication and authorization systems. Collaborate with frontend developers to integrate services.',
    authorEmail: 'bt20ece001@iiitagartala.ac.in',
    tags: ['Backend', 'Node.js', 'MongoDB', 'API'],
    status: 'active',
    // applicationUrl: 'https://oceangate.com/careers',
    applicationDeadline: new Date('2025-04-10')
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudNative Systems',
    description: 'CloudNative Systems is hiring a DevOps Engineer to help automate our infrastructure and improve our CI/CD pipelines.',
    location: 'Hyderabad, India',
    salary: '₹11,00,000 - ₹16,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'Bachelor\'s degree in Computer Science or related field. Experience with containerization technologies like Docker and Kubernetes. Knowledge of cloud platforms (AWS, Azure, or GCP). Familiarity with CI/CD tools like Jenkins or GitLab CI.',
    responsibilities: 'Automate deployment processes and infrastructure. Maintain and improve CI/CD pipelines. Monitor system performance and troubleshoot issues. Implement security best practices.',
    authorEmail: 'bt20cse002@iiitagartala.ac.in',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    status: 'active',
    // applicationUrl: 'https://cloudnativesystems.io/careers/devops',
    applicationDeadline: new Date('2025-03-25')
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Pixels',
    description: 'Creative Pixels is seeking a talented UI/UX Designer to create beautiful and functional interfaces for our web and mobile applications.',
    location: 'Delhi, India',
    salary: '₹7,00,000 - ₹12,00,000 per annum',
    employmentType: 'full-time',
    requirements: 'Bachelor\'s degree in Design, HCI, or related field. Portfolio demonstrating UI/UX design skills. Proficiency in design tools like Figma or Adobe XD. Understanding of user-centered design principles.',
    responsibilities: 'Create wireframes, prototypes, and high-fidelity mockups. Conduct user research and usability testing. Collaborate with developers to implement designs. Create and maintain design systems.',
    authorEmail: 'bt20cse001@iiitagartala.ac.in',
    tags: ['UI/UX', 'Design', 'Figma', 'User Research'],
    status: 'active',
    // applicationUrl: 'https://creativepixels.design/careers',
    applicationDeadline: new Date('2025-04-05')
  },
  {
    title: 'Part-time Web Developer',
    company: 'EduTech Startups',
    description: 'EduTech Startups is looking for a part-time web developer to help maintain and update our educational platform.',
    location: 'Remote',
    salary: '₹30,000 - ₹40,000 per month',
    employmentType: 'part-time',
    requirements: 'Strong knowledge of HTML, CSS, and JavaScript. Experience with WordPress and PHP. Good communication skills. Ability to work independently.',
    responsibilities: 'Update and maintain existing websites. Implement new features and functionalities. Fix bugs and improve performance. Collaborate with the content team to implement changes.',
    authorEmail: 'bt20cse002@iiitagartala.ac.in',
    tags: ['Part-time', 'Web Development', 'WordPress', 'Remote'],
    // status: '',
    // applicationUrl: 'https://edutechstartups.in/jobs',
    applicationDeadline: new Date('2025-03-20')
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Create jobs one by one to let the model's pre-validate hook handle the jobId generation
    const createdJobs = [];
    
    for (const jobData of jobs) {
      const job = new Job(jobData);
      const savedJob = await job.save();
      createdJobs.push(savedJob);
      console.log(`Created job: ${savedJob.title} with ID: ${savedJob.jobId}`);
    }

    console.log(`Successfully created ${createdJobs.length} jobs`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedJobs();