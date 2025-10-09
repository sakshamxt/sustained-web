// server/middleware/authMiddleware.js - FIXED

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined.');
        return res.status(500).json({ message: 'Server configuration error.' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }
      
      if (req.user.isBanned) {
        return res.status(403).json({ message: 'User account is banned. Access denied.' });
      }

      next(); // If everything is successful, proceed to the next middleware/controller
    } catch (error) {
      console.error('Token verification failed:', error.name);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    // --- THE FIX ---
    // We add a `return` statement here to stop the execution after sending the response.
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

export { protect };