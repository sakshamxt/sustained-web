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

    const { username, email } = req.body; // Get text fields

    // Handling username and email updates (check for uniqueness if changed)
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
      user.email = email.toLowerCase();
    }
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username already taken.' });
      }
      user.username = username;
    }
    
    // Handle profile picture update
    if (req.file) {
      // If there's an old picture and it has a Cloudinary ID, delete it
      if (user.profilePictureCloudinaryId) {
        try {
          await cloudinary.uploader.destroy(user.profilePictureCloudinaryId);
        } catch (delError) {
          console.error('Error deleting old profile picture from Cloudinary:', delError);
          // Optionally, decide if this should halt the update or just log
        }
      }
      user.profilePictureUrl = req.file.path;
      user.profilePictureCloudinaryId = req.file.filename;
    }
    // If `profilePictureUrl` is explicitly sent as empty string in form-data to remove picture
    // and no new file is uploaded, you might want to handle that.
    // For now, this only updates if a new file is present.

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePictureUrl: updatedUser.profilePictureUrl,
      // profilePictureCloudinaryId: updatedUser.profilePictureCloudinaryId, // Not sent to client
      streak: updatedUser.streak,
      points: updatedUser.points,
      enrolledCourses: updatedUser.enrolledCourses,
      createdAt: updatedUser.createdAt,
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    // If file was uploaded but save failed, consider deleting new file from Cloudinary
    // if (req.file && req.file.filename) { /* ... delete req.file.filename ... */ }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.message.includes('Not an image')) {
        return res.status(400).json({ message: error.message });
    }
    // ... (rest of your existing error handling) ...
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};


export { getUserProfile, updateUserProfile };