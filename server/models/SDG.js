// server/models/SDG.js

import mongoose from 'mongoose';

const PresentationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  urlOrContent: { type: String, required: true },
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: { type: String, required: true, default: 'text' },
});

const QuizOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false }
});

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [QuizOptionSchema],
  explanation: { type: String, required: true } // Explanation shown after answering
});

const PracticalActivitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  submissionType: { type: String, required: true, default: 'text' },
  quiz: { 
    type: QuizSchema,
    required: false
  }
});

const SDGSchema = new mongoose.Schema({
  sdgNumber: { type: Number, required: true, unique: true, min: 1, max: 17 },
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  whatYouWillLearn: [{ type: String }],
  imageUrl: { type: String, required: true },
  imageCloudinaryId: { type: String },
  fullDescription: { type: String, required: true },
  presentations: [PresentationSchema],
  lessons: [LessonSchema],
  practicalActivities: [PracticalActivitySchema],
}, {
  timestamps: true,
});


const SDG = mongoose.model('SDG', SDGSchema);

export default SDG;