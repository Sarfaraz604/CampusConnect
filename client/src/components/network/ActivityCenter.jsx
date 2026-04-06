import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";

const ActivityCenter = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myApplications, setMyApplications] = useState([]);
  const [myJobApplicants, setMyJobApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState("applications");

  const isAlumni = user?.role === 'alumni';

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        
        // Fetch applications made by the current user
        const applicationsResponse = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/applications/my-applications`,
          { withCredentials: true }
        );
        
        // If user is alumni, fetch applications for jobs they created
        if (isAlumni) {
          const jobApplicantsResponse = await axios.get(
            `${import.meta.env.VITE_backend_URL}/api/applications/received-applications/`,
            { withCredentials: true }
          );
          setMyJobApplicants(jobApplicantsResponse.data);
        }

        setMyApplications(applicationsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load activity data");
        setLoading(false);
      }
    };

    if (user) {
      fetchActivity();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state to reflect the change
      setMyJobApplicants(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      alert("Application status updated successfully!");
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update application status");
    }
  };

  // const viewJobDetails = (jobId) => {
  //   navigate(`/network/jobs/${jobId}`);
  // };

  const viewApplicantProfile = (applicantId) => {
    navigate(`/profile/${applicantId}`);
  };

  const getAbsoluteResumeUrl = (url) => {
    if (!url.startsWith("http")) {
      return `${import.meta.env.VITE_backend_URL}${url}`;
    }
    return url;
  };

  const viewCoverLetter = (application) => {
    // Create a modal or dialog to show the cover letter
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Cover Letter - ${application.applicantName}</h3>
          <button class="text-gray-500 hover:text-gray-700" id="close-modal">×</button>
        </div>
        <div class="prose">
          ${application.coverLetter}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById("close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading activity data...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Activity Center</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "applications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("applications")}
          >
            My Applications
          </button>
          
          {user?.role === "alumni" && (
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "applicants"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("applicants")}
            >
              Job Applicants
            </button>
          )}
        </div>

        {/* My Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Job Applications</h2>
            {myApplications.length === 0 ? (
              <p className="text-gray-500">You haven't applied to any jobs yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myApplications.map((application) => (
                  <div key={application._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{application.jobTitle}</h3>
                        <p className="text-gray-600">{application.companyName}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          application.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "reviewed"
                            ? "bg-blue-100 text-blue-800"
                            : application.status === "interviewing"
                            ? "bg-purple-100 text-purple-800"
                            : application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Applied on</p>
                        <p className="text-gray-700">{formatDate(application.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Job Author</p>
                        <p className="text-gray-700">{application.authorEmail}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      {/* <button
                        onClick={() => viewJobDetails(application.jobId)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                      >
                        View Job
                      </button> */}
                      {application.resumeUrl && (
                        <a
                          href={getAbsoluteResumeUrl(application.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                        >
                          View Resume
                        </a>
                      )}
                      <button
                        onClick={() => viewCoverLetter(application)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        View Cover Letter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Job Applicants Tab (Alumni Only) */}
        {activeTab === "applicants" && user?.role === "alumni" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Applicants for My Jobs</h2>
            {myJobApplicants.length === 0 ? (
              <p className="text-gray-500">No one has applied to your jobs yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myJobApplicants.map((application) => (
                  <div key={application._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{application.jobTitle}</h3>
                        <p className="text-gray-600">{application.companyName}</p>
                      </div>
                      <select
                        value={application.status}
                        onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                        className="border rounded px-3 py-1 text-sm bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                          {application.applicantName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-800">{application.applicantName}</h4>
                          <p className="text-gray-600 text-sm">{application.applicantEmail}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Applied on</p>
                        <p className="text-gray-700">{formatDate(application.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applicant ID</p>
                        <p className="text-gray-700">{application.applicantId}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => viewApplicantProfile(application.applicantId)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => window.open(`mailto:${application.applicantEmail}`)}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                      >
                        Contact
                      </button>
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                        >
                          View Resume
                        </a>
                      )}
                      <button
                        onClick={() => viewCoverLetter(application)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        View Cover Letter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivityCenter;