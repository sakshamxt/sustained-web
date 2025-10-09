// server/controllers/newsController.js
import News from '../models/News.js';
import User from '../models/User.js';



// @desc    Get users with notable streaks
// @route   GET /api/community/streaks/notable
// @access  Private/Admin
const getNotableStreaks = async (req, res) => {
  try {
    const notableStreakThreshold = parseInt(req.query.threshold, 10) || 15; // Default to 15, or configurable via query param

    const usersWithNotableStreaks = await User.find({ streak: { $gte: notableStreakThreshold } })
      .sort({ streak: -1 }) // Show highest streaks first
      .select('username profilePictureUrl streak lastActivityDate') // Select relevant fields
      .limit(20); // Limit the number of results

    res.status(200).json(usersWithNotableStreaks);

  } catch (error) {
    console.error('Error fetching notable streaks:', error);
    res.status(500).json({ message: 'Server error while fetching notable streaks.' });
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

// @desc    Get a specific news item by ID
// @route   GET /api/community/news/:id
// @access  Public
const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id)
                                .populate('postedByAdmin', 'username profilePictureUrl');
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found.' });
    }
    res.status(200).json(newsItem);
  } catch (error) {
    console.error('Error fetching news item by ID:', error);
    res.status(500).json({ message: 'Server error while fetching news item.' });
  }
};

export { getAllNews, getNotableStreaks, getNewsById };