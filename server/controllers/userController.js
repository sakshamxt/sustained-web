// server/controllers/userController.js
import User from '../models/User.js';


// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePictureUrl: req.user.profilePictureUrl,
      streak: req.user.streak,
      points: req.user.points,
      enrolledCourses: req.user.enrolledCourses,
      createdAt: req.user.createdAt,
    });
  } else {
    // This case should ideally be caught by protect middleware if user not found after decode
    res.status(404).json({ message: 'User not found.' });
  }
};



export { getUserProfile };