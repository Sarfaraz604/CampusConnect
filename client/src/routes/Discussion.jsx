import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import PostList from "../components/forum/PostList";
import CreatePostForm from "../components/forum/CreatePostForm";
import ErrorMessage from "../components/common/ErrorMessage";
import SearchBar from "../components/forum/SearchBar"; // New component
import { useSidebarLayout } from '../hooks/useSidebarLayout'; 

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // New state for search results
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  useSidebarLayout(true);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/profile`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        // User might not be logged in, which is OK
      }
    };
    fetchUser();
  }, []);

  // Fetch posts with periodic refresh
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/forum/posts`
        );
        setPosts(response.data);
        setFilteredPosts(response.data); // Initialize filtered posts with all posts
        setErrorMessage("");
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setErrorMessage("Failed to load discussions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
   
    // Set up periodic refresh
    const interval = setInterval(fetchPosts, 30000); // Refresh every 30 seconds
   
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // If search is empty, show all posts
      setFilteredPosts(posts);
      return;
    }
    
    // Filter posts based on search query
    const searchResults = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = post.content.toLowerCase().includes(query.toLowerCase());
      const authorMatch = post.author.toLowerCase().includes(query.toLowerCase());
      
      // Also search in replies if they exist
      const replyMatch = post.replies && post.replies.some(reply => 
        reply.content.toLowerCase().includes(query.toLowerCase()) ||
        (reply.username && reply.username.toLowerCase().includes(query.toLowerCase()))
      );
      
      return titleMatch || contentMatch || authorMatch || replyMatch;
    });
    
    setFilteredPosts(searchResults);
  };

  // Implement server-side search
  const handleServerSearch = async (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      if (!query.trim()) {
        setFilteredPosts(posts);
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/forum/search?q=${encodeURIComponent(query)}`
      );
      
      setFilteredPosts(response.data);
    } catch (error) {
      console.error("❌ Error searching posts:", error);
      setErrorMessage("Failed to search discussions. Please try again.");
      setFilteredPosts(posts); // Fallback to all posts on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Navbar />
     
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
       
        <main className="flex-1 ml-64 overflow-auto h-full">
          <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Discussion Forum</h1>
              <p className="text-gray-600 mt-2">
                Join the conversation and share your thoughts with the community
              </p>
            </header>

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
                    : `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6">
                <ErrorMessage message={errorMessage} />
              </div>
            )}

            {!user && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
                <p className="text-blue-700">
                  Sign in to participate in discussions and create new posts.
                </p>
              </div>
            )}

            {user && (
              <section className="mb-8">
                <CreatePostForm user={user} setPosts={setPosts} />
              </section>
            )}

            <section className="pb-8">
              {isLoading && filteredPosts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">Loading discussions...</p>
                </div>
              ) : (
                <PostList 
                  posts={filteredPosts} 
                  user={user} 
                  setPosts={setPosts} 
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discussion;