const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Basic email validation
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    default: 'https://avatar.iran.liara.run/public', // Default profile picture URL
  },
  streak: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SDG', // Assuming 'SDG' will be the model name for SDG courses
  }],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const User = mongoose.model('User', UserSchema);