// server/controllers/newsController.js
import News from '../models/News.js';
import cloudinary from '../config/cloudinaryConfig.js'; // For deleting images if needed


// @desc    Create a news item
// @route   POST /api/community/news
// @access  Private/Admin
const createNewsItem = async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: 'Please provide title and text for the news item.' });
    }

    const newsItemPayload = {
      title,
      text,
      postedByAdmin: req.user._id, // From 'protect' middleware
    };

    if (req.file) { // If an image was uploaded
      newsItemPayload.imageUrl = req.file.path; // URL from Cloudinary
      newsItemPayload.imageCloudinaryId = req.file.filename; // Public ID from Cloudinary
    }

    const newsItem = new News(newsItemPayload);
    const createdNewsItem = await newsItem.save();

    res.status(201).json(createdNewsItem);

  } catch (error) {
    console.error('Error creating news item:', error);
    // If error occurs after file upload, attempt to delete from Cloudinary
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (delError) {
        console.error('Error deleting uploaded news image after news creation failure:', delError);
      }
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating news item.' });
  }
};


// @desc    Get all news items
// @route   GET /api/community/news
// @access  Public
const getAllNews = async (req, res) => {
  try {
    // Sort by newest first, optionally populate admin username
    const newsItems = await News.find({})
                              .sort({ createdAt: -1 })
                              .populate('postedByAdmin', 'username profilePictureUrl'); // Populate admin details
    res.status(200).json(newsItems);
  } catch (error) {
    console.error('Error fetching news items:', error);
    res.status(500).json({ message: 'Server error while fetching news items.' });
  }
};

export { createNewsItem, getAllNews };