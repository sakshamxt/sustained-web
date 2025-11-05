// server/controllers/authController.js - FIXED

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // The new country and state fields are now correctly read from req.body
    const { username, email, password, country, state } = req.body;

    // 1. Validate input
    if (!username || !email || !password || !country || !state) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // 2. Check if user already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // --- THE FIX ---
    // The newUserPayload now includes the country and state,
    // ensuring they are saved to the new user document.
    const newUserPayload = {
      username,
      email: email.toLowerCase(),
      password,
      country,
      state,
    };

    if (req.file) {
      newUserPayload.profilePictureUrl = req.file.path;
      newUserPayload.profilePictureCloudinaryId = req.file.filename;
    }

    const newUser = new User(newUserPayload);
    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    // This response will now correctly include the country and state
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      profilePictureUrl: savedUser.profilePictureUrl,
      streak: savedUser.streak,
      points: savedUser.points,
      enrolledCourses: savedUser.enrolledCourses,
      country: savedUser.country,
      state: savedUser.state,
      createdAt: savedUser.createdAt,
      token,
    });

  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      // The login response will automatically include the country and state
      // because they exist on the user document now.
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        streak: user.streak,
        points: user.points,
        enrolledCourses: user.enrolledCourses,
        country: user.country,
        state: user.state,
        createdAt: user.createdAt,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};

export { registerUser, loginUser };