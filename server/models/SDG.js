// server/models/SDG.js
import mongoose from 'mongoose';

// Sub-schema for Presentations
const PresentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  urlOrContent: { // Could be a URL to a slideshare, PDF, or markdown content
    type: String,
    required: true,
  },
  // You might add a type field here e.g., 'url', 'markdown'
});

// Sub-schema for Lessons
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: { // Could be markdown, HTML, or plain text
    type: String,
    required: true,
  },
  type: { // E.g., 'video', 'text', 'quiz_link'
    type: String,
    required: true,
    default: 'text',
  },
});

// Sub-schema for Practical Activities
const PracticalActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  submissionType: { // E.g., 'text', 'file_upload', 'url'
    type: String,
    required: true,
    default: 'text',
  },
});

const SDGSchema = new mongoose.Schema({
  sdgNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 17,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  whatYouWillLearn: [{
    type: String,
  }],
  imageUrl: { // URL to the main image for the SDG (could be from Cloudinary)
    type: String,
    required: true,
  },
  imageCloudinaryId: { // Optional: if uploaded via an admin panel later
    type: String,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  presentations: [PresentationSchema],
  lessons: [LessonSchema],
  practicalActivities: [PracticalActivitySchema],
}, {
  timestamps: true,
});


const SDG = mongoose.model('SDG', SDGSchema);

export default SDG;