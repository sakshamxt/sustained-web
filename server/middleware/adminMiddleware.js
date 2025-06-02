// server/middleware/adminMiddleware.js

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed to the next middleware/controller
  } else {
    res.status(403).json({ message: 'Not authorized as an admin. Access denied.' });
  }
};

export { isAdmin };