// src/routes/AdminDiscussion.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/common/Layout";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import PostList from "../components/forum/PostList"; 
import ErrorMessage from "../components/common/ErrorMessage";
import SearchBar from "../components/forum/SearchBar";
import { useNavigate } from "react-router-dom";
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

// 1) Import your toast from the custom Toast file
import { toast } from "../components/Toast"; // ensure you have "export const toast" in Toast.jsx

const AdminDiscussion = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // For search results
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 2) Local state to manage the confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const navigate = useNavigate();
  useSidebarLayout(true);

  // Fetch the logged-in user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch forum posts with periodic refresh
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/forum/posts`
        );
        setPosts(res.data);
        setFilteredPosts(res.data);
        setErrorMessage("");
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setErrorMessage("Failed to load discussions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();

    const interval = setInterval(fetchPosts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Client-side search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }
    const searchResults = posts.filter((post) => {
      const lowerQuery = query.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const contentMatch = post.content.toLowerCase().includes(lowerQuery);
      const authorMatch = post.author.toLowerCase().includes(lowerQuery);
      const replyMatch =
        post.replies &&
        post.replies.some(
          (reply) =>
            reply.content.toLowerCase().includes(lowerQuery) ||
            (reply.username && reply.username.toLowerCase().includes(lowerQuery))
        );
      return titleMatch || contentMatch || authorMatch || replyMatch;
    });
    setFilteredPosts(searchResults);
  };

  // Optional: server-side search (if needed)
  const handleServerSearch = async (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      if (!query.trim()) {
        setFilteredPosts(posts);
        setIsLoading(false);
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/forum/search?q=${encodeURIComponent(query)}`
      );
      setFilteredPosts(res.data);
    } catch (error) {
      console.error("❌ Error searching posts:", error);
      setErrorMessage("Failed to search discussions. Please try again.");
      setFilteredPosts(posts);
    } finally {
      setIsLoading(false);
    }
  };

  // 3) Trigger the custom confirmation modal instead of window.confirm
  const handleDeletePostRequest = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirmModal(true);
  };

  // 4) If user confirms the deletion
  const handleConfirmDelete = async () => {
    if (!postIdToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postIdToDelete}`,
        { withCredentials: true }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postIdToDelete));
      setFilteredPosts((prev) => prev.filter((p) => p._id !== postIdToDelete));

      // Show success toast
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      toast.error("Failed to delete post.");
    } finally {
      // Close modal and reset
      setShowConfirmModal(false);
      setPostIdToDelete(null);
    }
  };

  // 5) If user cancels the deletion
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPostIdToDelete(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-auto h-full">
          <div className="p-8 max-w-5xl mx-auto">
            

            {/* Search Component */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleServerSearch} 
                placeholder="Search discussions by title, content, or author..."
              />
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                  {filteredPosts.length === 0
                    ? `No results found for "${searchQuery}"`
                    : `Showing ${filteredPosts.length} result${
                        filteredPosts.length !== 1 ? "s" : ""
                      } for "${searchQuery}"`
                  }
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6">
                <ErrorMessage message={errorMessage} />
              </div>
            )}

            {isLoading && filteredPosts.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Loading discussions...</p>
              </div>
            ) : (
              <PostList
                posts={filteredPosts}
                user={user}
                setPosts={setPosts}
                adminMode={true} 
                // Pass our custom request function 
                // so PostItem can open the modal
                onDeletePost={handleDeletePostRequest}
              />
            )}
          </div>
        </main>
      </div>

      {/* 6) Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

// 7) A simple confirm modal component
function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Delete Post</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDiscussion;
