const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }



      // ✅ Update lastActive timestamp (real-time tracking)
      req.user.lastActive = new Date();
      await req.user.save().catch(err => console.error("Failed to update lastActive:", err));
      
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

module.exports = { protect };