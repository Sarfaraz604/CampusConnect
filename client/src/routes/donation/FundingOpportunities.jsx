// src/routes/FundingOpportunities.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const FundingOpportunities = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSidebarLayout(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/donations`, 
          { withCredentials: true }
        );
        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading donations...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Funding Opportunities</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore and support the innovative projects proposed by our alumni and students.
          </p>
        </div>

        {donations.length === 0 ? (
          <p className="text-gray-600 text-center">No funding opportunities available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
              >
                {/* Title / Project Name */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {donation.name || 'Untitled Project'}
                </h2>

                {/* Sub-info Row (Batch & userName) */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Batch: {donation.batch || 'N/A'}</span>
                  {/* 3) Display userName instead of email/id */}
                  <span>{donation.userName || 'Unknown User'}</span>
                </div>

                {/* 1) Purpose as a small inline-block pill */}
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4 w-fit">
                  {donation.purpose || 'General'}
                </span>

                {/* Amount */}
                <div className="text-lg text-blue-600 font-medium mb-4">
                  ₹{donation.amount?.toLocaleString() || 0}
                </div>

                {/* Comments / Description */}
                {donation.comments && (
                  <p className="text-sm text-gray-600 mb-4">
                    {donation.comments}
                  </p>
                )}

                {/* 2) Button -> "Contribute" route */}
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => navigate('/donation/contribute')}
                    className="inline-block bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
                  >
                    Contribute
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

export default FundingOpportunities;
