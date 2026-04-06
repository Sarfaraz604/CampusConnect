// src/components/donations/Donation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Donation = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Your Alma Mater</h2>
      
      <div className="space-y-6">
        {/* Giving Back Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Give Back to Your College</h3>
          <p className="text-gray-700">
            Your contribution helps build a stronger future for the next generation of students.
            Support the institution that helped shape your career.
          </p>
        </div>

        {/* Tax Benefits Section */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Tax Benefits</h3>
          <p className="text-gray-700 mb-3">
            All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ College Backed Donation Receipt</li>
            <li>✓ Tax Exemption Certificate</li>
            <li>✓ Documentation Support</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/donation/process')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Make a Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donation;