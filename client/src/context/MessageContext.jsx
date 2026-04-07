import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import socketService from '../services/socketService';
import { showErrorToast, showSuccessToast } from '../utils/toast';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser();

  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadByConversation, setUnreadByConversation] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
    unreadCount: false,
  });

  const fetchConversations = async () => {
    setLoading((prev) => ({ ...prev, conversations: true }));

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/messages/conversations`,
        {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );

      const conversationsData = Array.isArray(response.data) ? response.data : [];
      setConversations(conversationsData);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
      setConversations([]);
    } finally {
      setLoading((prev) => ({ ...prev, conversations: false }));
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/messages/unread`,
        { withCredentials: true }
      );

      setUnreadCount(response.data.totalUnreadCount || 0);

      const unreadMap = {};
      (response.data.unreadByConversation || []).forEach((item) => {
        unreadMap[item.conversationId] = item.unreadCount;
      });

      setConversations((prevConversations) =>
        prevConversations.map((conversation) => ({
          ...conversation,
          unreadCount: unreadMap[conversation._id] || 0,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch unread count', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (userLoading) {
      return undefined;
    }

    if (!user) {
      setConversations([]);
      setUnreadCount(0);
      setUnreadByConversation([]);
      setActiveConversation(null);
      setMessages([]);
      return undefined;
    }

    fetchConversations();
    fetchUnreadCount();
    return undefined;
  }, [user, userLoading]);

  useEffect(() => {
    if (userLoading || !user) {
      return undefined;
    }

    const fetchData = async () => {
      await fetchConversations();
      await fetchUnreadCount();
    };

    fetchData();

    const unreadInterval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(unreadInterval);
  }, [user, userLoading]);

  const fetchConversationMessages = async (conversationId, page = 1, lastMessageId = null) => {
    setLoading((prev) => ({ ...prev, messages: true }));

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_backend_URL}/api/messages/conversation/${conversationId}`,
        {
          withCredentials: true,
          params: { page, limit: 20, lastMessageId },
        }
      );

      setMessages((prevMessages) =>
        page === 1 ? response.data.messages : [...response.data.messages, ...prevMessages]
      );

      return response.data.hasMore;
    } catch (error) {
      console.error('Failed to fetch conversation messages', error);
      showErrorToast('Failed to load messages');
      setMessages([]);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  const sendMessage = async (recipientId, content) => {
    try {
      if (sendingMessage) {
        return undefined;
      }

      setSendingMessage(true);

      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/messages/send`,
        { recipientId, content },
        { withCredentials: true }
      );

      await Promise.all([fetchConversations(), fetchUnreadCount()]);

      showSuccessToast('Message sent successfully');
      return response.data;
    } catch (error) {
      showErrorToast('Failed to send message');
      throw error;
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/messages/conversation/${conversationId}`,
        { withCredentials: true }
      );

      await fetchConversations();
      showSuccessToast('Conversation deleted successfully');
    } catch (error) {
      console.error('Failed to delete conversation', error);
      showErrorToast('Failed to delete conversation');
    }
  };

  const markMessagesAsRead = async (conversationId, messageIds) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/messages/mark-read`,
        { conversationId, messageIds },
        { withCredentials: true }
      );

      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark messages as read', error);
      showErrorToast('Failed to mark messages as read');
    }
  };

  useEffect(() => {
    if (userLoading) {
      return undefined;
    }

    if (!user) {
      socketService.disconnect();
      return undefined;
    }

    socketService.connect(user);

    const handleNewMessage = (message) => {
      console.log('[MessageContext] Received newMessage event:', message);
      fetchConversations();
      fetchUnreadCount();
    };

    socketService.onNewMessage(handleNewMessage);

    return () => {
      const currentSocket = socketService.getSocket();
      if (currentSocket) {
        currentSocket.off('newMessage', handleNewMessage);
      }
      socketService.disconnect();
    };
  }, [user, userLoading]);

  return (
    <MessageContext.Provider
      value={{
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
        deleteConversation,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
