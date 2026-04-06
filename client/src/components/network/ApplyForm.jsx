import { useState, useEffect } from "react";

const ApplyForm = ({ jobId }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: null, message: "" });

  // Fetch the specific job using its MongoDB ObjectId (_id)
  useEffect(() => {
    if (jobId) {
      fetch(`${import.meta.env.VITE_backend_URL}/api/jobs/${jobId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data._id) {
            setSelectedJob(data);
          } else {
            console.error("Invalid job data:", data);
            setFormStatus({
              type: "error",
              message: "Could not load job information."
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching job:", error);
          setFormStatus({
            type: "error",
            message: "Error loading job information."
          });
        });
    }
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    if (!selectedJob || !selectedJob._id) {
      setFormStatus({
        type: "error",
        message: "Invalid Job ID. Please select a valid job before applying."
      });
      setIsSubmitting(false);
      return;
    }

    const applicationData = {
      applicantName,
      applicantEmail,
      resumeUrl,
      coverLetter,
    };

    try {
      // const response = await fetch(
      //   `${import.meta.env.VITE_backend_URL}/api/applications/${selectedJob._id}/apply`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(applicationData),
      //   }
      // );
      const response = await fetch(
        `${import.meta.env.VITE_backend_URL}/api/applications/${selectedJob._id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
          credentials: "include",  // Important to include credentials (cookies)
        }
      );
      

      const data = await response.json();
      console.log("Application Response:", data);

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Application submitted successfully!"
        });
        // Reset form after successful submission
        setApplicantName("");
        setApplicantEmail("");
        setResumeUrl("");
        setCoverLetter("");
      } else {
        setFormStatus({
          type: "error",
          message: `Error: ${data.message || "Something went wrong"}`
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setFormStatus({
        type: "error",
        message: "Network error submitting application"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-center">
        {selectedJob ? `Apply for ${selectedJob.title}` : "Loading job..."}
      </h2>

      {formStatus.message && (
        <div 
          className={`mb-4 p-3 rounded ${
            formStatus.type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}
        >
          {formStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your Name"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your Email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Resume Link
          </label>
          <input
            id="resume"
            type="text"
            placeholder="URL to your resume"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            placeholder="Tell us about yourself and why you're interested in this position"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !selectedJob || !selectedJob._id}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting || !selectedJob || !selectedJob._id
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;