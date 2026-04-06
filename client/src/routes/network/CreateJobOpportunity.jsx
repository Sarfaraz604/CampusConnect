// client/src/routes/CreateJobOpportunity.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateJobOpportunity = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    employmentType: '',
    requirements: '',
    responsibilities: '',
    // applicationUrl: '',
    applicationDeadline: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data to populate authorEmail automatically
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backend_URL}/auth/profile`, { withCredentials: true });
        if (response.data.email) {
          setJobData(prevData => ({
            ...prevData,
            authorEmail: response.data.email
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/jobs/createJob`, 
        jobData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setSuccess('Job opportunity submitted successfully!');
      navigate('/network/all-jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting job opportunity');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/network')}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 mt-4 hover:bg-gray-100"
      >
        Back
      </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Job Opportunity</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              required
            />
          </div>
          {/* Display the logged-in user's email as uneditable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              value={jobData.authorEmail || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.company}
              onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.salary}
              onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.employmentType}
              onChange={(e) => setJobData({ ...jobData, employmentType: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={jobData.requirements}
              onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={jobData.responsibilities}
              onChange={(e) => setJobData({ ...jobData, responsibilities: e.target.value })}
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.applicationUrl}
              onChange={(e) => setJobData({ ...jobData, applicationUrl: e.target.value })}
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={jobData.applicationDeadline}
              onChange={(e) => setJobData({ ...jobData, applicationDeadline: e.target.value })}
            />
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
          >
            Submit Job Opportunity
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobOpportunity;
