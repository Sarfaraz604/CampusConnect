// client/src/routes/AdminDonations.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useSidebarLayout(true);
  // Fetch donation requests from admin endpoint
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/donations/admin`,
          { withCredentials: true }
        );
        setDonations(res.data);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donation requests');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Admin action: Accept donation (set status to accepted)
  const handleAccept = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/donations/admin/${id}/accept`,
        {},
        { withCredentials: true }
      );
      setDonations((prev) =>
        prev.map((donation) => (donation._id === id ? res.data.data : donation))
      );
    } catch (err) {
      console.error('Error accepting donation:', err);
      setError('Failed to accept donation');
    }
  };

  // Admin action: Reject donation (delete from DB)
  const handleReject = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/donations/admin/${id}`,
        { withCredentials: true }
      );
      setDonations((prev) => prev.filter((donation) => donation._id !== id));
    } catch (err) {
      console.error('Error rejecting donation:', err);
      setError('Failed to reject donation');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading donation requests...</p>
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
        
      
        {donations.length === 0 ? (
          <p className="text-gray-600 text-center">No donation requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
              >
                {/* Title / Project Name */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {donation.name || 'Untitled Project'}
                </h2>

                {/* Basic Info */}
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Batch:</span> {donation.batch || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {donation.email}
                  </p>
                  <p>
                    <span className="font-medium">Purpose:</span> {donation.purpose}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> ₹{donation.amount}
                  </p>
                  {donation.comments && (
                    <p>
                      <span className="font-medium">Comments:</span> {donation.comments}
                    </p>
                  )}
                </div>

                {/* Status Pill */}
                <div className="mb-4">
                  <StatusPill status={donation.status} />
                </div>

                {/* Admin Actions */}
                <div className="mt-auto flex gap-3">
                  {donation.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAccept(donation._id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(donation._id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(donation._id)}
                      className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
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
    </Layout>
  );
};

export default AdminDonations;

/**
 * A small helper component to display the donation status
 * as a color-coded pill (pending = yellow, accepted = green, rejected = red).
 */
const StatusPill = ({ status }) => {
  let bgClass = '';
  let textClass = '';
  let displayStatus = status;

  switch (status) {
    case 'pending':
      bgClass = 'bg-yellow-100';
      textClass = 'text-yellow-800';
      break;
    case 'accepted':
      bgClass = 'bg-green-100';
      textClass = 'text-green-800';
      break;
    case 'rejected':
      bgClass = 'bg-red-100';
      textClass = 'text-red-800';
      break;
    default:
      bgClass = 'bg-gray-100';
      textClass = 'text-gray-800';
      displayStatus = 'unknown';
      break;
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgClass} ${textClass}`}
    >
      {displayStatus}
    </span>
  );
};
