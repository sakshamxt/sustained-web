// server/models/News.js
import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the news item.'],
    trim: true,
  },
  text: {
    type: String,
    required: [true, 'Please add content for the news item.'],
  },
  imageUrl: { // URL to the image for the news item (could be from Cloudinary)
    type: String,
    // Not strictly required, can be text-only news
  },
  imageCloudinaryId: { // Optional: if image is uploaded via admin panel and stored on Cloudinary
    type: String,
  },
  postedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming only admin users (User model) can post news
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const News = mongoose.model('News', NewsSchema);

export default News;