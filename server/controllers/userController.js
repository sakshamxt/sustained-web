// server/controllers/userController.js
import User from '../models/User.js';
import cloudinary from '../config/cloudinaryConfig.js';


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



// @desc    Update user profile
// @route   PUT /api/users/me/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { username, email, profilePictureUrl, city, state, country } = req.body; // Added state

    // ... (username, email, profilePictureUrl update logic as before) ...
    if (email && email.toLowerCase() !== user.email) {
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Email already in use by another account.' });
        }
        user.email = email.toLowerCase();
    }
    if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        user.username = username;
    }
    if (req.file) {
        if (user.profilePictureCloudinaryId) {
            try { await cloudinary.uploader.destroy(user.profilePictureCloudinaryId); }
            catch (delError) { console.error('Error deleting old profile picture:', delError); }
        }
        user.profilePictureUrl = req.file.path;
        user.profilePictureCloudinaryId = req.file.filename;
    } else if (profilePictureUrl === '') {
        if (user.profilePictureCloudinaryId) {
            try {
                await cloudinary.uploader.destroy(user.profilePictureCloudinaryId);
                user.profilePictureCloudinaryId = '';
            } catch (delError) { console.error('Error deleting profile picture:', delError); }
        }
        user.profilePictureUrl = '';
    }

    // Update location fields if provided
    if (city !== undefined) {
        user.city = city.trim();
    }
    if (state !== undefined) { // Handle state update
        user.state = state.trim();
    }
    if (country !== undefined) {
        user.country = country.trim();
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePictureUrl: updatedUser.profilePictureUrl,
      streak: updatedUser.streak,
      points: updatedUser.points,
      city: updatedUser.city,
      state: updatedUser.state,       // Include new field in response
      country: updatedUser.country,
      enrolledCourses: updatedUser.enrolledCourses,
      createdAt: updatedUser.createdAt,
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.message.includes('Not an image')) { 
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};


export { getUserProfile, updateUserProfile };