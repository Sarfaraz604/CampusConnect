import React from 'react';

const InfoItem = ({ icon, label, value }) => {
  if (!value || value === 'null' || value === 'undefined') return null;
  
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="mt-1 text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-gray-800">{value}</div>
      </div>
    </div>
  );
};

export default InfoItem;
