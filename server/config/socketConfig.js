const socketIo = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const User = require('../models/users');

module.exports = (server, sessionConfig) => {
  // CORS configuration
  const corsOptions = {
    origin: [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // Backend server
      process.env.VITE_API_BASE_URL,  // Production frontend URL
      process.env.VITE_backend_URL,  // Production backend URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST'],
  };

  // Initialize Socket.IO
  const io = socketIo(server, {
    cors: corsOptions,
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Middleware wrapper
  const wrap = middleware => (socket, next) => 
    middleware(socket.request, socket.request.res || {}, next);

  // Apply session and passport to Socket.IO
  io.use(wrap(session(sessionConfig)));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    console.log('===== SOCKET CONNECTION MIDDLEWARE =====');
    
    try {
      // Log session details
      console.log('Socket Session:', socket.request.session);
      console.log('Passport User:', socket.request.session?.passport?.user);
      
      // Check if user is authenticated
      if (!socket.request.session?.passport?.user) {
        console.error('No authenticated user in socket session');
        return next(new Error('Authentication required'));
      }

      // Find user
      const user = await User.findById(socket.request.session.passport.user);
      
      if (!user) {
        console.error('User not found');
        return next(new Error('User not found'));
      }

      // Attach user to socket
      socket.user = user;
      next();

    } catch (error) {
      console.error('Socket Authentication Error:', error);
      next(new Error('Authentication process failed'));
    }
  });

  // Load socket middleware
  require('./socketMiddleware')(io, session(sessionConfig));

  return io;
};

