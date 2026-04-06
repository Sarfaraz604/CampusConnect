import React, { useState } from "react";
import axios from "axios";

const VoteButtons = ({ post, user, setPosts, setLocalVoteCount }) => {
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async (postId, voteType) => {
    if (!user) {
      return alert("You must be logged in to vote.");
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/vote`,
        { voteType },
        { withCredentials: true }
      );

      // Update the local vote count state
      setLocalVoteCount(response.data.voteCount);
      
      // Also update the posts state for consistency when navigating
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, voteCount: response.data.voteCount } : p))
      );

    } catch (error) {
      console.error("❌ Error voting:", error);
      alert("Failed to update vote.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
      <button 
        onClick={() => handleVote(post._id, "upvote")} 
        className="text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50"
        disabled={isVoting}
        title="Upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      <span className="mx-2 font-medium text-gray-700">
        {post.voteCount || 0}
      </span>
      
      <button 
        onClick={() => handleVote(post._id, "downvote")} 
        className="text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50"
        disabled={isVoting}
        title="Downvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default VoteButtons;