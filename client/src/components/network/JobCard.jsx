import React, { useState } from 'react';
import { useUser } from '../../context/UserContext'; // Adjust the import path as needed

const JobCard = ({ 
  title, 
  company, 
  description, 
  location, 
  salary, 
  tags, 
  authorName, 
  requirements, 
  responsibilities, 
  status,
  jobId, 
  _id,
  authorEmail,
  onStatusChange
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, loading } = useUser(); // Use the user context

  // Use _id if jobId is not provided (for MongoDB compatibility)
  const id = jobId || _id;
  
  // Format text with line breaks
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  
  // Check if the current user is the author of this job
  const isAuthor = user?.email?.toLowerCase() === authorEmail?.toLowerCase();

  // Handle status change with error handling
  const handleStatusChange = async () => {
    if (typeof onStatusChange !== 'function') {
      console.error('onStatusChange prop is not a function or not provided');
      alert('Unable to update job status. Please try again later.');
      return;
    }
    
    if (!id) {
      console.error('Job ID is missing');
      alert('Cannot identify this job posting. Please try again later.');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await onStatusChange(id, 'filled');
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('An error occurred while updating the job status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Show a loading state if user data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      
      {/* Status indicator */}
      {status && (
        <div className={`text-xs mb-2 inline-block px-2 py-1 rounded ${
          status === 'active' ? 'bg-green-100 text-green-800' : 
          status === 'filled' ? 'bg-gray-100 text-gray-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )}
      
      {/* Basic information - always visible */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-blue-600 font-medium">{company}</span>
        <span className="text-gray-500 text-sm">{location}</span>
      </div>
      
      <div className="mb-3">
        <span className="text-gray-700 text-sm">Posted by: {authorName}</span>
        {isAuthor && <span className="ml-2 text-xs text-green-500">(You)</span>}
      </div>
      
      {salary && (
        <div className="mb-3">
          <span className="text-green-600 font-medium">{salary}</span>
        </div>
      )}
      
      {/* Collapsed view of description */}
      {!expanded && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
      )}
      
      {/* Expanded view with full content */}
      {expanded && (
        <div className="mt-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Description:</h4>
          <p className="text-gray-600 mb-4">{description}</p>
          
          {requirements && (
            <>
              <h4 className="font-medium text-gray-800 mb-2">Requirements:</h4>
              <p className="text-gray-600 mb-4">{formatText(requirements)}</p>
            </>
          )}
          
          {responsibilities && (
            <>
              <h4 className="font-medium text-gray-800 mb-2">Responsibilities:</h4>
              <p className="text-gray-600 mb-4">{formatText(responsibilities)}</p>
            </>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags && tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap justify-between items-center mt-4">
        {/* Toggle expand/collapse button */}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
        
        <div className="flex space-x-2">
          {/* Show "Mark as Filled" button only for the author if the job is active */}
          {isAuthor && status === 'active' && (
            <button 
              onClick={handleStatusChange}
              disabled={isUpdating}
              className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition ${
                isUpdating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUpdating ? 'Updating...' : 'Mark as Filled'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
