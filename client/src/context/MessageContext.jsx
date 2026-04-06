import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserContext';
import socketService from '../services/socketService';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {

  const { user } = useUser();
  
  // Only fetch if user is logged in
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [user]);

  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false); // Add this state
  const [unreadByConversation, setUnreadByConversation] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
    unreadCount: false
  });

  // Fetch conversations
// In your MessageContext.jsx
const fetchConversations = async () => {
  setLoading(prev => ({ ...prev, conversations: true }));
  try {
    const response = await axios.get(`${import.meta.env.VITE_backend_URL}/api/messages/conversations`, {
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    console.log('Conversations API Response:', response.data);
    
    // Ensure data is an array
    const conversationsData = Array.isArray(response.data) 
      ? response.data 
      : [];

    setConversations(conversationsData);
  } catch (error) {
    console.error('Failed to fetch conversations', error);
    // showErrorToast('Failed to fetch conversations');
    setConversations([]);
  } finally {
    setLoading(prev => ({ ...prev, conversations: false }));
  }
};


  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/messages/unread`,
        { withCredentials: true }
      );
      
      console.log('Unread Count Response:', response.data);
      
      setUnreadCount(response.data.totalUnreadCount || 0);
      
      // Create a map of conversation IDs to unread counts
      const unreadMap = {};
      response.data.unreadByConversation.forEach(item => {
        unreadMap[item.conversationId] = item.unreadCount;
      });
      
      // Update conversations with their unread counts
      setConversations(prevConversations => {
        return prevConversations.map(conv => ({
          ...conv,
          unreadCount: unreadMap[conv._id] || 0
        }));
      });
    } catch (error) {
      console.error('Failed to fetch unread count', error);
      setUnreadCount(0);
    }
  };
  // Modify useEffect to handle unread count
  useEffect(() => {
    if (user) {
      // Fetch conversations first, then unread counts
      const fetchData = async () => {
        await fetchConversations();
        await fetchUnreadCount();
      };
      
      fetchData();
      
      // Set up interval to periodically check unread count
      const unreadInterval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Check every half minute
      
      // Cleanup interval
      return () => clearInterval(unreadInterval);
    }
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchConversationMessages = async (conversationId, page = 1, lastMessageId = null) => {
    setLoading(prev => ({ ...prev, messages: true }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/messages/conversation/${conversationId}`,
        { 
          withCredentials: true,
          params: { page, limit: 20, lastMessageId }
        }
      );
  
      // If it's the first page, replace messages
      // If it's subsequent pages, prepend messages
      setMessages(prevMessages => 
        page === 1 
          ? response.data.messages 
          : [...response.data.messages, ...prevMessages]
      );
  
      return response.data.hasMore;
    } catch (error) {
      console.error('Failed to fetch conversation messages', error);
      showErrorToast('Failed to load messages');
      setMessages([]);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };
  useEffect(() => {
    if (user) {
      // Connect socket
      const socket = socketService.connect(user);
  
      // Listen for new messages
      const handleNewMessage = (message) => {
        // Immediately update conversations and unread count
        fetchConversations();
        fetchUnreadCount();
      };
  
      socketService.onNewMessage(handleNewMessage);
  
      // Cleanup
      return () => {
        const currentSocket = socketService.getSocket();
        if (currentSocket) {
          currentSocket.off('newMessage', handleNewMessage);
        }
      };
    }
  }, [user]);
  // Send a message
  const sendMessage = async (recipientId, content) => {
    try {
        // Prevent multiple simultaneous sends
        if (sendingMessage) return;
        setSendingMessage(true);
  
        const response = await axios.post(
          `${import.meta.env.VITE_backend_URL}/api/messages/send`, 
          { recipientId, content },
          { withCredentials: true }
        );
  
        // Refresh only after successful send
        await Promise.all([
          fetchConversations(),
          fetchUnreadCount()
        ]);
  
        showSuccessToast('Message sent successfully');
        return response.data;
      } catch (error) {
        showErrorToast('Failed to send message');
        throw error;
      } finally {
        setSendingMessage(false);
      }
    };
  // Delete entire chat
  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/messages/conversation/${conversationId}`,
        { withCredentials: true }
      );
  
      // Refresh conversations
      await fetchConversations();
  
      showSuccessToast('Conversation deleted successfully');
    } catch (error) {
      console.error('Failed to delete conversation', error);
      showErrorToast('Failed to delete conversation');
    }
  };

  
  // Mark messages as read
  const markMessagesAsRead = async (conversationId, messageIds) => {
    try {
      await axios.patch(`${import.meta.env.VITE_backend_URL}/api/messages/mark-read`, {
        conversationId,
        messageIds
      }, {
        withCredentials: true
      });

      // Refresh unread count
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark messages as read', error);
      showErrorToast('Failed to mark messages as read');
    }
  };

  
  useEffect(() => {
    if (user) {
      // Connect socket
      const socket = socketService.connect(user);
  
      // Listen for new messages
      const handleNewMessage = (message) => {
        console.log('📨 [MessageContext] Received newMessage event:', message);
        // Immediately update conversations and unread count
        console.log('🔄 [MessageContext] Fetching conversations and unread count...');
        fetchConversations();
        fetchUnreadCount();
      };
  
      socketService.onNewMessage(handleNewMessage);
      console.log('👂 [MessageContext] Listener registered for newMessage events');
  
      // Cleanup
      return () => {
        const currentSocket = socketService.getSocket();
        if (currentSocket) {
          currentSocket.off('newMessage', handleNewMessage);
          console.log('🧹 [MessageContext] Removed newMessage listener');
        }
      };
    }
  }, [user]);
 

  return (
    <MessageContext.Provider value={{
      conversations,
      unreadCount,
      unreadByConversation,
      activeConversation,
      setActiveConversation,
      messages,
      loading,
      fetchConversations,
      fetchUnreadCount,
      fetchConversationMessages,
      sendMessage,
      markMessagesAsRead,
      deleteConversation 
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);