import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all jobs for admin
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin`,
        { withCredentials: true }
      );
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useSidebarLayout(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update job status
  const updateJobStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/jobs/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setJobs(prev => prev.map(job => job._id === id ? res.data.data : job));
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status.');
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/jobs/${id}`,
        { withCredentials: true }
      );
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading jobs...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-600 text-center p-4">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Job Opportunities</h1>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No job opportunities available.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 bg-white border rounded-md shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.company} - {job.location}</p>
                  <p className="text-gray-500 text-sm mt-1">{job.description}</p>
                  <p className="text-sm mt-1">
                    Status: <span className="font-semibold">{job.status}</span>
                  </p>
                  {job.applicationDeadline && (
                    <p className="text-sm mt-1">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button 
                    onClick={() => updateJobStatus(job._id, 'active')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Active
                  </button>
                  <button 
                    onClick={() => updateJobStatus(job._id, 'filled')}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Filled
                  </button>
                  <button 
                    onClick={() => updateJobStatus(job._id, 'pending')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => updateJobStatus(job._id, 'expired')}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Expired
                  </button>
                  <button 
                    onClick={() => deleteJob(job._id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminJobs;
