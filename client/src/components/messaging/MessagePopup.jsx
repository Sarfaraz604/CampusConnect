import React, { useState, useEffect, useRef } from 'react';
import { 
  Drawer, 
  TextField, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Badge,
  CircularProgress,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useMessage } from '../../context/MessageContext';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import DeleteIcon from '@mui/icons-material/Delete';

const MessagePopup = ({ open, onClose }) => {
  const { 
    conversations = [], 
    unreadCount, 
    setActiveConversation,
    sendMessage,
    messages,
    fetchConversationMessages,
    loading,
    deleteConversation,
  } = useMessage();
  
  const { user: currentUser } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [messageInput, setMessageInput] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [openConversationId, setOpenConversationId] = useState(null);
  
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
   // Scroll to bottom when messages change
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Infinite scroll handler
  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if scrolled to top
    if (container.scrollTop === 0 && hasMoreMessages && !loading.messages) {
      // Get the first message's ID
      const firstMessageId = messages.length > 0 ? messages[0]._id : null;
      
      // Fetch more messages
      const moreMessagesAvailable = await fetchConversationMessages(
        openConversationId, 
        undefined, 
        firstMessageId
      );
      
      setHasMoreMessages(moreMessagesAvailable);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
  
    setIsSearching(true);
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/users/search`, {
        withCredentials: true,
        params: { search: query }
      });
      
      console.log('Raw Search Response:', response.data);
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('User search failed', error);
      showErrorToast(error.response?.data?.error || 'Failed to search users');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timerId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Start a new conversation
  const startConversation = (user) => {
    setActiveConversation(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Open an existing conversation
  const openConversation = (conv) => {
    // Ensure otherUser exists and has an _id
    if (!conv.otherUser?._id) {
      showErrorToast('Invalid conversation');
      return;
    }
  
    setActiveConversation(conv.otherUser);
    fetchConversationMessages(conv._id);
    setOpenConversationId(conv._id);
  };

  // Send message to a user in search results
  const handleSendMessage = async (user) => {
    const userId = user._id;
    const content = messageInput[userId];
    if (!content || content.trim() === '') {
      showErrorToast('Message cannot be empty');
      return;
    }

    try {
      await sendMessage(userId, content);
      
      // Clear input and reset
      setMessageInput(prev => ({
        ...prev,
        [userId]: ''
      }));
      
      showSuccessToast('Message sent successfully');
    } catch (error) {
      console.error('Message send failed', error);
      showErrorToast('Failed to send message');
    }
  };

  // Send message in active conversation
  const handleSendConversationMessage = async () => {
    if (!openConversationId) return;
    
    const conversation = conversations.find(c => c._id === openConversationId);
    if (!conversation || !conversation.otherUser) {
      showErrorToast('Invalid conversation');
      return;
    }
    
    const content = messageInput[openConversationId] || '';
    if (!content || content.trim() === '') {
      showErrorToast('Message cannot be empty');
      return;
    }
  
    try {
      // Use recipientId from the conversation
      await sendMessage(conversation.otherUser._id, content);
      
      // Clear input
      setMessageInput(prev => ({
        ...prev,
        [openConversationId]: ''
      }));
      
      // Refresh messages
      fetchConversationMessages(openConversationId);
    } catch (error) {
      console.error('Message send failed', error);
      showErrorToast('Failed to send message');
    }
  };

  // Handle key press for message input
  const handleKeyPress = (event, userId) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (openConversationId) {
        handleSendConversationMessage();
      } else {
        const user = searchResults.find(u => u._id === userId);
        if (user) handleSendMessage(user);
      }
    }
  };

  // Render search results
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="text-center text-gray-500 py-4">
          <CircularProgress size={20} />
          <p className="mt-2">Searching...</p>
        </div>
      );
    }

    const results = Array.isArray(searchResults) ? searchResults : [];

    if (results.length === 0 && searchQuery) {
      return (
        <div className="text-center text-gray-500 py-4">
          No users found
        </div>
      );
    }

    return (
      <List>
        {results.map(user => (
          <ListItem 
            key={user._id} 
            className="flex flex-col items-start"
          >
            <div className="flex items-center w-full">
              <Avatar 
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                alt={user.name} 
                className="mr-2" 
              />
              <div className="flex-grow">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button 
                onClick={() => startConversation(user)}
                className="text-blue-500 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Chat
              </button>
            </div>
            <div className="w-full mt-2">
              <TextField 
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message"
                value={messageInput[user._id] || ''}
                onChange={(e) => setMessageInput(prev => ({
                  ...prev,
                  [user._id]: e.target.value
                }))}
                onKeyPress={(e) => handleKeyPress(e, user._id)}
                InputProps={{
                  endAdornment: (
                    <IconButton 
                      onClick={() => handleSendMessage(user)}
                      color="primary"
                      size="small"
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  )
                }}
              />
            </div>
          </ListItem>
        ))}
      </List>
    );
  };

  // Render conversations
const renderConversations = () => {
  const conversationList = Array.isArray(conversations) ? conversations : [];

  if (conversationList.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No conversations yet
      </div>
    );
  }

  return (
    <List>
      {conversationList.map(conv => {
        // Ensure otherUser and lastMessage exist
        const otherUser = conv.otherUser || {};
        const lastMessage = conv.lastMessage || {};
        const hasUnreadMessages = conv.unreadCount > 0;
        console.log('Conversation:', conv, 'Unread Count:', conv.unreadCount, 'Has Unread:', hasUnreadMessages);
        // Format timestamp
        const formatTimestamp = (timestamp) => {
          if (!timestamp) return '';
          const date = new Date(timestamp);
          const now = new Date();
          
          // Today
          if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString(undefined, { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          }
          
          // This year
          if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            });
          }
          
          // Different year
          return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        };
  
        return (
          <ListItem 
            key={conv._id} 
            button 
            onClick={() => openConversation(conv)}
            className={`
              hover:bg-gray-100 
              transition-colors 
              duration-200 
              ${hasUnreadMessages ? 'bg-blue-50' : ''}
            `}
          >
            <ListItemAvatar>
              <Badge 
                color="primary" 
                badgeContent={conv.unreadCount || 0}
                invisible={!conv.unreadCount}
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Avatar 
                  src={otherUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'User')}`} 
                  alt={otherUser.name || 'User'} 
                  className={`w-10 h-10 ${hasUnreadMessages ? 'ring-2 ring-blue-300' : ''}`}
                />
              </Badge>
            </ListItemAvatar>
            <ListItemText 
              primary={
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className={`
                      font-semibold 
                      ${hasUnreadMessages ? 'text-blue-800' : 'text-gray-800'}
                    `}>
                      {otherUser.name || 'Unknown User'}
                    </span>
                    {hasUnreadMessages && (
                      <span className="
                        bg-blue-500 
                        text-white 
                        text-xs 
                        rounded-full 
                        px-2 
                        py-0.5
                      ">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                  <span className={`
                    text-xs 
                    ${hasUnreadMessages ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {formatTimestamp(lastMessage.createdAt)}
                  </span>
                </div>
              }
              secondary={
                <span 
                  className={`
                    line-clamp-1 
                    ${hasUnreadMessages 
                      ? "font-semibold text-blue-700" 
                      : "text-gray-600"}
                  `}
                >
                  {lastMessage.content || 'No messages yet'}
                </span>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

// Render messages in conversation
const renderMessages = () => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No messages yet. Send a message to start the conversation.
      </div>
    );
  }

  // 1️⃣ Group messages by date (YYYY-MM-DD format for consistency)
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = new Date(message.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  // 2️⃣ Sort dates in descending order (most recent date first)
  const sortedDates = Object.keys(groupedMessages)
    .map(date => ({ date, timestamp: new Date(date).getTime() }))
    .sort((a, b) => b.timestamp - a.timestamp) // 🔥 Newest date first!
    .map(item => item.date);

  return (
    <div 
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-grow overflow-y-auto bg-gray-50 p-4"
      style={{ display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto' }}
    >
      <div ref={messagesEndRef} /> {/* Anchor for scrolling */}

      {sortedDates.map(date => (
        <div key={date} className="mb-4">
          {/* 🗓️ Date separator */}
          <div className="text-center text-xs text-gray-500 my-2">
            {new Date(date).toLocaleDateString(undefined, { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          {/* 3️⃣ Sort messages within each date in ascending order (oldest first) */}
          {groupedMessages[date]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // 🔥 Oldest to newest!
            .map((message, index) => {
              const showSenderInfo = index === 0 || message.sender._id !== groupedMessages[date][index - 1].sender._id;

              return (
                <div 
                  key={message._id}
                  className={`flex flex-col mb-2 ${
                    message.sender._id === currentUser?._id ? 'items-end' : 'items-start'
                  }`}
                >
                  {showSenderInfo && (
                    <div className="text-xs text-gray-500 mb-1">
                      {message.sender._id === currentUser?._id ? 'You' : message.sender.name}
                    </div>
                  )}
                  <div 
                    className={`p-3 rounded-lg max-w-[70%] ${
                      message.sender._id === currentUser?._id 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <small 
                      className={`text-xs block mt-1 ${
                        message.sender._id === currentUser?._id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString(undefined, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};


  // Handle drawer close
  const handleClose = () => {
    setOpenConversationId(null);
    setSearchQuery('');
    onClose();
  };
  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        width: 350,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
        },
      }}
    >
      {openConversationId ? (
        // Conversation View
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-2 border-b flex items-center bg-gray-50">
            <IconButton onClick={() => setOpenConversationId(null)} size="small">
              <ArrowBackIcon fontSize="small" />
            </IconButton>
  
            <div className="flex items-center flex-grow px-2">
              {conversations.find(c => c._id === openConversationId)?.otherUser && (
                <>
                  <Avatar
                    src={
                      conversations.find(c => c._id === openConversationId)?.otherUser?.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        conversations.find(c => c._id === openConversationId)?.otherUser?.name || 'User'
                      )}`
                    }
                    alt={conversations.find(c => c._id === openConversationId)?.otherUser?.name}
                    sx={{ width: 32, height: 32 }}
                    className="mr-2"
                  />
                  <span className="font-semibold">
                    {conversations.find(c => c._id === openConversationId)?.otherUser?.name}
                  </span>
                </>
              )}
            </div>
  
            {/* Delete Conversation Button */}
            <IconButton
              onClick={() => {
                // Confirm before deletion
                const confirmDelete = window.confirm(
                  'Are you sure you want to delete this conversation? This cannot be undone.'
                );
  
                if (confirmDelete) {
                  deleteConversation(openConversationId);
                  setOpenConversationId(null);
                }
              }}
              color="error"
              size="small"
              title="Delete Conversation"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
  
          {/* Messages list */}
          <div className="flex-grow overflow-y-auto bg-gray-50">{renderMessages()}</div>
  
          {/* Message input */}
          <div className="p-2 border-t bg-white">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message"
              value={messageInput[openConversationId] || ''}
              onChange={(e) =>
                setMessageInput((prev) => ({
                  ...prev,
                  [openConversationId]: e.target.value,
                }))
              }
              onKeyPress={(e) => handleKeyPress(e)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleSendConversationMessage}
                    color="primary"
                    disabled={!messageInput[openConversationId] || messageInput[openConversationId].trim() === ''}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
        </div>
      ) : (
        // Conversations/Search View
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 border-b bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" className="mr-1 text-gray-400" />,
              }}
            />
          </div>
  
          {/* Content */}
          <div className="flex-grow overflow-y-auto">
            {/* Search Results */}
            {searchQuery && renderSearchResults()}
  
            {/* Conversations List */}
            {!searchQuery && renderConversations()}
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default MessagePopup;