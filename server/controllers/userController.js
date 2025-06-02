// server/controllers/userController.js
import User from '../models/User.js';
import cloudinary from '../config/cloudinaryConfig.js'; // For deleting images from Cloudinary


// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    // Respond with user data, excluding sensitive fields like password (already excluded by .select('-password') in protect middleware)
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePictureUrl: req.user.profilePictureUrl,
      streak: req.user.streak,
      points: req.user.points,
      city: req.user.city,
      state: req.user.state,
      country: req.user.country,
      isAdmin: req.user.isAdmin,
      enrolledCourses: req.user.enrolledCourses,
      lastActivityDate: req.user.lastActivityDate,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } else {
    // This case should ideally be caught by the protect middleware if the token is valid but the user is not found.
    // However, as a fallback:
    res.status(404).json({ message: 'User not found.' });
  }
};


// @desc    Update user profile
// @route   PUT /api/users/me/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    // Fetch the user again to ensure we have the latest full document if needed,
    // though req.user from protect middleware should be a Mongoose document.
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { username, email, city, state, country } = req.body;
    let { profilePictureUrl } = req.body; // Can be an empty string to remove picture

    // Update email if provided and changed (with uniqueness check)
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
      user.email = email.toLowerCase();
    }

    // Update username if provided and changed (with uniqueness check)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
      user.username = username;
    }
    
    // Handle profile picture update
    if (req.file) { // A new file is uploaded
      // If there's an old picture and it has a Cloudinary ID, delete it
      if (user.profilePictureCloudinaryId) {
        try {
          await cloudinary.uploader.destroy(user.profilePictureCloudinaryId);
        } catch (delError) {
          console.error('Error deleting old profile picture from Cloudinary:', delError);
          // Decide if this should halt the update or just log. For now, it continues.
        }
      }
      user.profilePictureUrl = req.file.path; // URL from Cloudinary
      user.profilePictureCloudinaryId = req.file.filename; // Public ID from Cloudinary
    } else if (profilePictureUrl === '') { // Request to remove existing profile picture
      if (user.profilePictureCloudinaryId) {
        try {
          await cloudinary.uploader.destroy(user.profilePictureCloudinaryId);
          user.profilePictureCloudinaryId = '';
        } catch (delError) {
          console.error('Error deleting profile picture from Cloudinary:', delError);
        }
      }
      user.profilePictureUrl = '';
    }
    // If profilePictureUrl is provided in req.body but is not empty and no req.file,
    // it implies client might be trying to set a URL directly.
    // This example prioritizes req.file for new uploads.
    // If you want to allow direct URL setting, add logic here.


    // Update location fields if provided (undefined means no change requested)
    if (city !== undefined) {
        user.city = city.trim();
    }
    if (state !== undefined) {
        user.state = state.trim();
    }
    if (country !== undefined) {
        user.country = country.trim();
    }

    // Password updates should generally be handled by a separate, dedicated endpoint
    // that requires the current password for security reasons.

    const updatedUser = await user.save();

    // Respond with the updated user information
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePictureUrl: updatedUser.profilePictureUrl,
      streak: updatedUser.streak,
      points: updatedUser.points,
      city: updatedUser.city,
      state: updatedUser.state,
      country: updatedUser.country,
      isAdmin: updatedUser.isAdmin,
      enrolledCourses: updatedUser.enrolledCourses,
      lastActivityDate: updatedUser.lastActivityDate,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // Handle multer errors specifically (e.g., if passed via next(error) from middleware)
    // For instance, if multerUpload.js calls cb(new Error(...))
    if (error.message && error.message.includes('Not an image')) { 
        return res.status(400).json({ message: error.message });
    }
    // Generic server error
    res.status(500).json({ message: 'Server error during profile update. Please try again later.' });
  }
};

export { getUserProfile, updateUserProfile };