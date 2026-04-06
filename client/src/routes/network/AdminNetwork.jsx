// client/src/routes/network/AdminNetwork.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle, Trash2, Plus } from 'lucide-react';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AdminNetwork = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    employmentType: '',
    requirements: '',
    responsibilities: '',
    applicationDeadline: '',
    status: 'active'
  });

  useSidebarLayout(true);

  // Fetch all jobs from the admin endpoint
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs/admin`,
          { withCredentials: true }
        );
        console.log("Admin jobs fetched:", res.data);
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching admin jobs:', err);
        setError('Failed to load admin network data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.title || !formData.company || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const res = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin`,
        formData,
        { withCredentials: true }
      );
      
      setJobs((prev) => [res.data.data, ...prev]);
      setSuccessMessage('Job created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        salary: '',
        employmentType: '',
        requirements: '',
        responsibilities: '',
        applicationDeadline: '',
        status: 'active'
      });
      
      // Close form after success
      setTimeout(() => {
        setShowCreateForm(false);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setCreating(false);
    }
  };

  // Accept: update job status to "active"
  const handleAccept = async (jobId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}/status`,
        { status: 'active' },
        { withCredentials: true }
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === jobId ? res.data.data : job))
      );
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('Failed to accept job.');
    }
  };

  // Reject: delete the job from the database
  const handleReject = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}`,
        { withCredentials: true }
      );
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject job.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading Admin Network data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Job Opportunities Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            {showCreateForm ? 'Cancel' : 'Create Job'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}

        {/* Create Job Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Job Opportunity</h2>
            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Senior Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Tech Corp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., New Delhi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., 10-15 LPA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="filled">Filled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe the job role and responsibilities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List the required qualifications and skills..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List key responsibilities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {creating ? 'Creating...' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <div>
          <div className="mb-6">
            <span className="text-gray-500 text-sm">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>

          {jobs.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No job opportunities found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between"
                >
                  {/* Job Info */}
                  <div>
                    <div className="mb-4 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Logo</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {job.company} • {job.location}
                    </p>
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <p>
                        Type: <span className="font-medium">{job.employmentType}</span>
                      </p>
                      {job.salary && (
                        <p>
                          Salary: <span className="font-medium">{job.salary}</span>
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {/* Job Status Badge */}
                  <div className="mt-4">
                    <StatusBadge status={job.status} />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center gap-3">
                    {job.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAccept(job._id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                        >
                          <CheckCircle2 size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(job._id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReject(job._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'filled':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'expired':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default AdminNetwork;
