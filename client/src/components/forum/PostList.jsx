import React, { useState } from "react";
import PostItem from "./PostItem";

const PostList = ({ posts, user, setPosts, adminMode, onDeletePost }) => {
  const [sortBy, setSortBy] = useState("latest"); // Default sort by latest

  // Function to sort posts based on selected option
  const getSortedPosts = () => {
    if (sortBy === "upvotes") {
      return [...posts].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
    } else {
      // Sort by latest (most recent first)
      return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const sortedPosts = getSortedPosts();

  return (
    <div className="space-y-6">
      {/* Sorting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Recent Discussions</h2>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center">
            <label htmlFor="sort-select" className="text-sm text-gray-600 mr-2">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
          <span className="text-sm text-gray-500">{posts.length} posts</span>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <p className="text-gray-600 mb-2">No discussions yet.</p>
          <p className="text-gray-500 text-sm">Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <PostItem 
              key={post._id} 
              post={post} 
              user={user} 
              setPosts={setPosts}
              adminMode={adminMode}
              onDeletePost={onDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
