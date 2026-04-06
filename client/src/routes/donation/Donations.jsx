// src/routes/Donations.jsx
import React from 'react';
import Layout from '../../components/common/Layout';
import Donation from '../../components/donations/Donation';
import Funding from '../../components/donations/Funding';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const Donations = () => {
  useSidebarLayout(true);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mt-6 mb-4">
  <h1 className="text-3xl font-bold text-gray-900">
    Support Our Institution
  </h1>
  <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-1">
    Join our community of alumni and supporters in making a lasting impact.
    Your contribution helps us build a stronger institution for future generations.
  </p>
  <div className="w-12 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-full flex flex-col">
            <Donation />
          </div>
          <div className="h-full flex flex-col">
            <Funding preview={true} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Donations;