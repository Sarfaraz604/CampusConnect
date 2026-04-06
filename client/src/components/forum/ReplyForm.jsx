// Enhanced ReplyForm with Success Confirmation
import React, { useState, useEffect } from "react";
import axios from "axios";

const ReplyForm = ({ 
  postId, 
  setReplies, 
  user, 
  parentReplyId = null, 
  onCancel = null,
  isNested = false
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Clear success message after 5 seconds
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
        // If this is a nested reply, auto-close after success
        if (onCancel && isNested) {
          onCancel();
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, onCancel, isNested]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setError("");
    setSuccessMessage("");
    
    if (!replyContent.trim()){
      setError("Reply content cannot be empty.");
      return;
    }
    
    if (!user) {
      setError("You must be logged in to reply.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies`,
        { 
          content: replyContent, 
          userId: user.id, 
          username: user.name,
          parentReplyId
        },
        { withCredentials: true }
      );
      setReplies(response.data);
      setReplyContent("");
      setSuccessMessage("Reply posted successfully!");
      
      // For non-nested replies, we'll keep the form open but clear it
      if (!isNested) {
        setReplyContent("");
      }
      // For nested replies, we'll let the timeout handle closing
    } catch (error) {
      console.error("❌ Error posting reply:", error);
      setError(error.response?.data?.message || "Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className={isNested ? "" : "mt-4 border-t border-gray-100 pt-4"}>
      <div className="space-y-3">
        {/* Display error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Display success message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-2 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
        
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          placeholder="Write your reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          rows="3"
          disabled={isSubmitting}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
              isSubmitting 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;