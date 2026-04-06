// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  static instance = null;
  socket = null;

  constructor() {
    if (SocketService.instance) {
      return SocketService.instance;
    }
    SocketService.instance = this;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  connect(user) {
    // Only connect if user is logged in
    if (!user) {
      console.log('No user, skipping socket connection');
      return null;
    }

    const baseURL = import.meta.env.VITE_backend_URL || 'http://localhost:3000';
    
    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(baseURL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully for user:', user.email);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return this.socket;
  }

  // Add this method to match the usage in MessageContext
  getSocket() {
    return this.socket;
  }

  // Existing methods...
  sendMessage(recipientId, content) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject(new Error('Socket not connected'));
      }

      this.socket.emit('sendMessage', { 
        recipientId, 
        content 
      });
      
      this.socket.once('messageSent', (message) => {
        resolve(message);
      });
      
      this.socket.once('messageError', (error) => {
        reject(error);
      });
      
      // Timeout
      setTimeout(() => {
        reject(new Error('Message sending timeout'));
      }, 5000);
    });
  }

  onNewMessage(callback) {
    const socket = this.getSocket();
    if (socket) {
      console.log('🔌 [SocketService] Registering onNewMessage listener');
      socket.on('newMessage', (message) => {
        console.log('🔔 [SocketService] Received newMessage on socket:', message);
        callback(message);
      });
    } else {
      console.warn('⚠️ [SocketService] Socket not connected, cannot register newMessage listener');
    }
  }
    // New method to listen for message read events
    onMessageRead(callback) {
      const socket = this.getSocket();
      if (socket) {
        socket.on('messageRead', (data) => {
          console.log('Message read event received:', data);
          callback(data);
        });
      }
    }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// socketService.js


export default SocketService.getInstance();