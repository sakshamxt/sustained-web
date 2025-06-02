// server/models/UserProgress.js
import mongoose from 'mongoose';

const CompletedActivitySchema = new mongoose.Schema({
  // Assuming contentId refers to the title or a unique ID of the activity
  // within the SDG.practicalActivities array.
  activityId: {
    type: String, // Could be title or a generated unique ID from the SDG's activity definition
    required: true,
  },
  submissionData: { // Flexible field for storing submission details
    type: mongoose.Schema.Types.Mixed, // e.g., { text: "My answer", fileUrl: "...", submittedAt: Date }
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false }); // No separate _id for these sub-documents unless needed

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sdgCourse: { // Referencing the SDG course
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SDG',
    required: true,
  },
  completedPresentations: [{ // Array of presentation titles or unique IDs
    type: String,
  }],
  completedLessons: [{ // Array of lesson titles or unique IDs
    type: String,
  }],
  completedActivities: [CompletedActivitySchema], // Array of completed activity details
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Compound index to ensure a user has only one progress document per SDG course
UserProgressSchema.index({ user: 1, sdgCourse: 1 }, { unique: true });

// Middleware to update lastAccessed before saving
UserProgressSchema.pre('save', function(next) {
  this.lastAccessed = new Date();
  next();
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);

export default UserProgress;