//make a donation button
//client\src\routes\DonationProcess.jsx
import React, { useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DonationProcess = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    email: '',
    amount: '',
    purpose: '',
    comments: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting donation with:", formData);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_backend_URL}/api/donations`, formData);
      console.log("API response:", response);
      setSuccess('Donation submitted successfully! You will receive a confirmation email.');
      setFormData({
        name: '',
        batch: '',
        email: '',
        amount: '',
        purpose: '',
        comments: ''
      });
    } catch (err) {
      console.log("Submission error:", err.response?.data);
      setError(err.response?.data?.message || 'Error submitting donation');
    }
  };
  
  
 
  return (
    <div className="max-w-3xl mx-auto p-6">
         
       {/* New Back to Home Button */}
       <button
          type="button"
          onClick={() => navigate('/donation')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 mt-4 hover:bg-gray-100"
        >
          Back
        </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Bank Account Info */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Bank Account Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Account Name:</p>
              <p>College Name</p>
            </div>
            <div>
              <p className="font-medium">Account Number:</p>
              <p>XXXX-XXXX-XXXX</p>
            </div>
            <div>
              <p className="font-medium">IFSC Code:</p>
              <p>XXXX0000XXX</p>
            </div>
            <div>
              <p className="font-medium">Bank:</p>
              <p>Bank Name</p>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
    required
  />
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Year
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.batch}
              onChange={(e) => setFormData({...formData, batch: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Donated
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Donation
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              required
            >
              <option value="">Select Purpose</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="research">Research</option>
              <option value="scholarship">Scholarship</option>
              <option value="general">General Development</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Submit Details
          </button>
        </form>

{success && (
  <p className="mt-4 text-green-600 text-center">{success}</p>
)}
{error && (
  <p className="mt-4 text-red-600 text-center">{error}</p>
)}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Note: You will receive the tax exemption document via email once your donation is verified.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationProcess;