import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ActivitySection = ({ lastLogin }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Activity</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600 italic">
          {lastLogin ? 
            `Last active on ${formatDate(lastLogin)}` : 
            "No recent activity to display"
          }
        </p>
      </div>
    </div>
  );
};

export default ActivitySection;
