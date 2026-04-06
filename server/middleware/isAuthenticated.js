// server/middleware/isAuthenticated.js
module.exports = {
  isAuthenticated: function(req, res, next) {
    // console.log('===== AUTHENTICATION MIDDLEWARE =====');
    // console.log('Request Session:', req.session);
    // console.log('Passport User:', req.session?.passport?.user);
    // console.log('Current User:', req.user);
    
    // Check if authentication methods exist
    console.log('Authentication Methods:', {
      isAuthenticated: typeof req.isAuthenticated,
      user: req.user
    });

    // Perform authentication check
    if (!req.user) {
      console.warn('No user found in request');
      return res.status(401).json({ 
        message: 'Authentication required',
        details: {
          sessionExists: !!req.session,
          passportUser: req.session?.passport?.user
        }
      });
    }

    // Log successful authentication
    console.log('User authenticated:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });

    next();
  }
};