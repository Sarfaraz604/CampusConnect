import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobCard from "./JobCard";
import { useUser } from "../../context/UserContext"; // Adjust path as needed

const Jobs = ({ preview = false }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser(); // Use the user context
  
  // Derive alumni status from user
  const isAlumni = user?.role === 'alumni';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs`
        );
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading job opportunities");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

 // Handle job status change
const handleStatusChange = async (jobId, newStatus) => {
  try {
    // Show loading state
    setLoading(true);
    
    console.log("Updating job:", jobId, "to status:", newStatus); // Debug log
    
    // Make API call to update job status - changed from PUT to PATCH
    const response = await axios.patch(
      `${import.meta.env.VITE_backend_URL}/api/jobs/${jobId}/status`,
      { status: newStatus },
      { withCredentials: true }
    );
    
    console.log("Update response:", response.data); // Debug log
    
    // Update the local state with the updated job
    setJobs(prevJobs => 
      prevJobs.map(job => 
        (job._id === jobId || job.id === jobId) ? { ...job, status: newStatus } : job
      )
    );
    
  } catch (err) {
    console.error("Error updating job status:", err);
    setError("Failed to update job status");
    alert("Error updating job status. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const displayedJobs = preview ? jobs.slice(0, 2) : jobs;

  return (
    <div className="h-full bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Opportunities</h2>
        {preview && (
          <button
            onClick={() => navigate("/network/all-jobs")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Jobs →
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedJobs.map((job) => (
          <JobCard 
            key={job._id || job.id || Math.random().toString()}
            {...job}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Show "Create Job Opportunity" button only to alumni */}
      <div className="flex justify-end mt-6">
        {isAlumni && (
          <button
            onClick={() => navigate("/network/create-job")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Create Job Opportunity
          </button>
        )}
      </div>
    </div>
  );
};

export default Jobs;