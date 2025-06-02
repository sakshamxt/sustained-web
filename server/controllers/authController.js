import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, profilePictureUrl } = req.body;

    // 1. Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
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

    // 3. Create new user instance (password will be hashed by the pre-save hook in User model)
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
      profilePictureUrl: profilePictureUrl || 'https://avatar.iran.liara.run/public',
    });

    // 4. Save the user to the database
    const savedUser = await newUser.save();

    // 5. Generate token and respond
    const token = generateToken(savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      profilePictureUrl: savedUser.profilePictureUrl,
      streak: savedUser.streak,
      points: savedUser.points,
      enrolledCourses: savedUser.enrolledCourses,
      createdAt: savedUser.createdAt,
      token,
    });

  } catch (error) {
    console.error('Registration Error:', error);
    // Handle specific errors thrown by generateToken or Mongoose validation
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.message === 'Server configuration error: JWT_SECRET is missing.' || 
        error.message === 'Could not generate authentication token.') {
      // This indicates a server-side configuration issue.
      return res.status(500).json({ message: 'Server configuration error, please try again later.' });
    }
    // Default to a generic server error
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
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        streak: user.streak,
        points: user.points,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    if (error.message === 'Server configuration error: JWT_SECRET is missing.' || 
        error.message === 'Could not generate authentication token.') {
        return res.status(500).json({ message: 'Server configuration error, please try again later.' });
    }
    res.status(500).json({ message: 'Server error during login. Please try again later.' });
  }
};




export { registerUser, loginUser };