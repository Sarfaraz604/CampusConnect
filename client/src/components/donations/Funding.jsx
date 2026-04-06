// src/components/donations/Funding.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//
// Single Funding Card
// Shows name, comments, Show More toggle, amount, batch/email, and tags if needed
//
const FundingCard = ({ 
  name = 'Untitled', 
  batch = '', 
  email = '', 
  purpose = '', 
  amount = 0, 
  comments = '',
  // Optional: if you have tags, you can pass them in an array
  tags = []
}) => {
  const [expanded, setExpanded] = useState(false);

  // Decide how many characters to show before toggling
  const MAX_CHAR = 100;
  const isLong = comments.length > MAX_CHAR;

  // If not expanded, clamp the text
  const displayedComments = expanded ? comments : comments.slice(0, MAX_CHAR);

  return (
    <div className="border border-gray-200 rounded p-4 shadow-md hover:shadow-lg transition-shadow">
      {/* Title / Name */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        {name}
      </h2>

      {/* Main text / comments */}
      {comments && (
        <p className="text-sm text-gray-600 mb-2">
          {displayedComments}
          {!expanded && isLong && '...'}
        </p>
      )}

      {/* Show More / Show Less toggle (only if text is long) */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm mb-2 focus:outline-none"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}

      {/* Bottom row: amount on left, batch/email on right */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-blue-600 font-medium">₹{amount}</span>
        <span className="text-gray-500 text-sm">
          {batch || email || 'Unknown'}
        </span>
      </div>

      {/* If you have tags, show them below */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

//
// Main Funding component
// Fetches accepted donations from /api/donations and displays them in cards
//
const Funding = ({ preview = false, filter }) => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        let url = `${import.meta.env.VITE_backend_URL}/api/donations`;
        // If you want to apply filters in non-preview mode, append query params
        if (filter && !preview) {
          const queryParams = new URLSearchParams();
          if (filter.category) queryParams.append('category', filter.category);
          if (filter.search) queryParams.append('search', filter.search);
          url += '?' + queryParams.toString();
        }

        const response = await axios.get(url, { withCredentials: true });
        setOpportunities(response.data);
      } catch (err) {
        console.error('Error fetching funding opportunities:', err);
        setError('Error loading funding opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [filter, preview]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // If preview mode, limit the list to 2 items
  const displayedRequests = preview ? opportunities.slice(0, 2) : opportunities;

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Boost Start-Up Culture</h2>
        {preview && (
          <button
            onClick={() => navigate('/donation/opportunities')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Banner or highlight section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Invest in College Startups and Projects
            </h3>
            <p className="text-gray-700">
              Support innovative ideas from your alma mater's entrepreneurs.
            </p>
          </div>
        </div>

        {/* Funding Cards */}
        <div className="space-y-4">
          <div className="grid gap-4">
            {displayedRequests.map((request) => (
              <FundingCard
                key={request._id}
                // Map your donation fields to FundingCard props
                name={request.name}
                batch={request.batch}
                email={request.email}
                purpose={request.purpose}
                amount={request.amount}
                comments={request.comments}
                // If you have tags, pass them in an array
                // tags={request.tags || []}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate('/donation/create-funding-request')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Create your own Request!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;
