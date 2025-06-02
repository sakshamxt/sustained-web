// server/controllers/adminController.js
import User from '../models/User.js';
import mongoose from 'mongoose';


// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Add pagination later if needed
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};


// @desc    Get a single user by ID (admin)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
};


// @desc    Ban or unban a user (admin)
// @route   PUT /api/admin/users/:userId/banstatus
// @access  Private/Admin
const toggleUserBanStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body; // Expecting { isBanned: true/false } in body

    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ message: 'Invalid ban status value. Must be true or false.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from banning themselves (optional, but good practice)
    if (user._id.equals(req.user._id)) {
        return res.status(400).json({ message: 'Admins cannot ban themselves.'});
    }

    user.isBanned = isBanned;
    await user.save();

    res.status(200).json({ 
      message: `User ${user.username} ${isBanned ? 'banned' : 'unbanned'} successfully.`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBanned: user.isBanned,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error updating user ban status:', error);
    res.status(500).json({ message: 'Server error while updating ban status.' });
  }
};


// @desc    Toggle admin status for a user (admin)
// @route   PUT /api/admin/users/:userId/adminstatus
// @access  Private/Admin
const toggleUserAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdminRole } = req.body; // Expecting { isAdminRole: true/false }

    if (typeof isAdminRole !== 'boolean') {
      return res.status(400).json({ message: 'Invalid admin status value. Must be true or false.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from removing their own admin status if they are the only admin (more complex logic, skip for now)
    // Or simply prevent changing own admin status through this endpoint
    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'Admins cannot change their own admin status via this endpoint.' });
    }

    user.isAdmin = isAdminRole;
    await user.save();

    res.status(200).json({
      message: `User ${user.username} admin status set to ${isAdminRole}.`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBanned: user.isBanned,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    res.status(500).json({ message: 'Server error while toggling admin status.' });
  }
};


export { getAllUsers, getUserById, toggleUserBanStatus, toggleUserAdminStatus };