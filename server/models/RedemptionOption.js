// server/models/RedemptionOption.js
import mongoose from 'mongoose';

const RedemptionOptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the redemption option.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Please specify the points required.'],
    min: [0, 'Points required cannot be negative.'],
  },
  imageUrl: { 
    type: String,
    trim: true,
  },
  linkToCourse: { // Optional: if this redemption links to an external resource/course
    type: String,
    trim: true,
  },
  stock: { // Optional: for limited quantity rewards
    type: Number,
    default: Infinity, // Default to unlimited stock
  },
  isActive: { // To easily enable/disable options
    type: Boolean,
    default: true,
  },
  // You could add an image field (imageUrl, imageCloudinaryId) if needed
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Ensure pointsRequired is indexed if you query by it frequently
RedemptionOptionSchema.index({ pointsRequired: 1 });
RedemptionOptionSchema.index({ isActive: 1 });

const RedemptionOption = mongoose.model('RedemptionOption', RedemptionOptionSchema);

export default RedemptionOption;