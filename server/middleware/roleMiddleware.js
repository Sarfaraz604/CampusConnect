// server/middleware/roleMiddleware.js
const ensureRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: `Access restricted. Required role: ${allowedRoles.join(' or ')}`
        });
      }
  
      next();
    };
  };
  
  const ensureInstitutionalEmail = (req, res, next) => {
    const email = req.body.email || (req.user && req.user.email);
    
    if (!email || !email.endsWith('@iiitagartala.ac.in')) {
      return res.status(403).json({ 
        error: 'Only @iiitagartala.ac.in email addresses are allowed'
      });
    }
    
    next();
  };
  
  module.exports = { ensureRole, ensureInstitutionalEmail };