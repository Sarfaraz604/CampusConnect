import React, { useState, useEffect } from "react";
import VoteButtons from "./VoteButtons";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { formatDate, timeAgo, formatDateTime } from "../../utils/utils";

const PostItem = ({ post, user, setPosts, adminMode, onDeletePost }) => {
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [localVoteCount, setLocalVoteCount] = useState(post.voteCount || 0);

  // Determine if the user can modify or delete the post
  const canModifyPost = user && (user.id === post.authorId && user.role !== 'admin');
  const canDeletePost = user && (user.id === post.authorId || user.role === 'admin');

  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoadingReplies(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_backend_URL}/api/forum/posts/${post._id}/replies`, {
          credentials: "include"
        });
        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoadingReplies(false);
      }
    };

    fetchReplies();
  }, [post._id]);

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      return alert("Title and content cannot be empty.");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_backend_URL}/api/forum/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
        credentials: "include"
      });
      const updatedPost = await response.json();
      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? updatedPost : p))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  };

  // Remove window.confirm: simply call the passed onDeletePost callback
  const handleDelete = () => {
    if (adminMode && onDeletePost) {
      onDeletePost(post._id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-shadow hover:shadow-lg">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Edit post title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Edit post content"
          />
          <div className="flex space-x-2">
            <button 
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              <span className="font-medium text-gray-600">
                {post.author || "Anonymous"}
              </span>
              <span className="mx-2">•</span>
              <span 
                title={formatDateTime(post.createdAt)}
                className="hover:underline cursor-help"
              >
                {timeAgo(post.createdAt)}
              </span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="ml-2 text-xs italic text-gray-400" 
                  title={`Last updated: ${formatDateTime(post.updatedAt)}`}
                >
                  (edited)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <VoteButtons 
                post={{...post, voteCount: localVoteCount}}
                user={user} 
                setPosts={setPosts}
                setLocalVoteCount={setLocalVoteCount}
              />
              {canModifyPost && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {canDeletePost && (
                <button 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <ReplyForm postId={post._id} setReplies={setReplies} user={user} />
            {isLoadingReplies ? (
              <div className="text-center py-3 text-gray-500">Loading replies...</div>
            ) : (
              <ReplyList 
                replies={replies} 
                user={user} 
                postId={post._id}
                setReplies={setReplies} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;
