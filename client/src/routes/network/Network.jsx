// client/src/routes/Network.jsx
import React from 'react';
import Layout from '../../components/common/Layout';
import People from '../../components/network/People';
import Jobs from '../../components/network/Jobs';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const Network = () => {
  useSidebarLayout(true);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* People component*/}
        <People />
        {/* Jobs component in preview mode */}
        <Jobs preview={true} />
      </div>
    </Layout>
  );
};

export default Network;
