// server/controllers/adminController.js
import User from '../models/User.js';
import SDG from '../models/SDG.js';
import News from '../models/News.js';
import RedemptionOption from '../models/RedemptionOption.js';
import UserProgress from '../models/UserProgress.js';
import cloudinary from '../config/cloudinaryConfig.js'; 
import mongoose from 'mongoose';


// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Add pagination later if needed
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};


// @desc    Get a single user by ID (admin)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
};


// @desc    Ban or unban a user (admin)
// @route   PUT /api/admin/users/:userId/banstatus
// @access  Private/Admin
const toggleUserBanStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body; // Expecting { isBanned: true/false } in body

    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ message: 'Invalid ban status value. Must be true or false.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from banning themselves (optional, but good practice)
    if (user._id.equals(req.user._id)) {
        return res.status(400).json({ message: 'Admins cannot ban themselves.'});
    }

    user.isBanned = isBanned;
    await user.save();

    res.status(200).json({ 
      message: `User ${user.username} ${isBanned ? 'banned' : 'unbanned'} successfully.`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBanned: user.isBanned,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error updating user ban status:', error);
    res.status(500).json({ message: 'Server error while updating ban status.' });
  }
};


// @desc    Toggle admin status for a user (admin)
// @route   PUT /api/admin/users/:userId/adminstatus
// @access  Private/Admin
const toggleUserAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdminRole } = req.body; // Expecting { isAdminRole: true/false }

    if (typeof isAdminRole !== 'boolean') {
      return res.status(400).json({ message: 'Invalid admin status value. Must be true or false.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from removing their own admin status if they are the only admin (more complex logic, skip for now)
    // Or simply prevent changing own admin status through this endpoint
    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'Admins cannot change their own admin status via this endpoint.' });
    }

    user.isAdmin = isAdminRole;
    await user.save();

    res.status(200).json({
      message: `User ${user.username} admin status set to ${isAdminRole}.`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBanned: user.isBanned,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    res.status(500).json({ message: 'Server error while toggling admin status.' });
  }
};



// @desc    Create a new SDG (admin)
// @route   POST /api/admin/sdgs
// @access  Private/Admin
const createSDG = async (req, res) => {
  try {
    const { 
      sdgNumber, title, shortDescription, fullDescription, 
      whatYouWillLearn, presentations, lessons, practicalActivities 
    } = req.body;

    // Basic validation
    if (!sdgNumber || !title || !shortDescription || !fullDescription) {
      // If image was uploaded, delete it from Cloudinary as validation failed
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: 'Please provide sdgNumber, title, shortDescription, and fullDescription.' });
    }

    // Check if SDG number already exists
    const existingSDG = await SDG.findOne({ sdgNumber });
    if (existingSDG) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: `SDG with number ${sdgNumber} already exists.` });
    }

    const sdgData = {
      sdgNumber,
      title,
      shortDescription,
      fullDescription,
      whatYouWillLearn: typeof whatYouWillLearn === 'string' ? JSON.parse(whatYouWillLearn) : whatYouWillLearn || [],
      presentations: typeof presentations === 'string' ? JSON.parse(presentations) : presentations || [],
      lessons: typeof lessons === 'string' ? JSON.parse(lessons) : lessons || [],
      practicalActivities: typeof practicalActivities === 'string' ? JSON.parse(practicalActivities) : practicalActivities || [],
    };

    if (req.file) {
      sdgData.imageUrl = req.file.path;
      sdgData.imageCloudinaryId = req.file.filename;
    } else {
        // You might want to require an image or set a default one
        // For now, not setting imageUrl if no file is uploaded
        // return res.status(400).json({ message: 'SDG image is required.' });
    }
    
    const newSDG = new SDG(sdgData);
    const savedSDG = await newSDG.save();
    res.status(201).json(savedSDG);

  } catch (error) {
    console.error('Error creating SDG:', error);
    if (req.file && req.file.filename) { // Attempt to clean up uploaded file on error
        try { await cloudinary.uploader.destroy(req.file.filename); }
        catch (e) { console.error("Error cleaning up file after SDG creation failure:", e); }
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    if (error.message.includes('JSON.parse')) {
        return res.status(400).json({ message: 'Invalid JSON format for nested arrays (presentations, lessons, etc.).' });
    }
    res.status(500).json({ message: 'Server error while creating SDG.' });
  }
};


// @desc    Update an existing SDG (admin)
// @route   PUT /api/admin/sdgs/:sdgId
// @access  Private/Admin
const updateSDG = async (req, res) => {
  try {
    const { sdgId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename); // Clean up if new image uploaded
      return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }

    const sdg = await SDG.findById(sdgId);
    if (!sdg) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(404).json({ message: 'SDG not found.' });
    }

    const { 
      sdgNumber, title, shortDescription, fullDescription, 
      whatYouWillLearn, presentations, lessons, practicalActivities 
    } = req.body;

    // Update fields if provided
    if (sdgNumber) {
      // Check if new sdgNumber conflicts with another SDG
      if (sdg.sdgNumber !== parseInt(sdgNumber)) {
        const existingSDG = await SDG.findOne({ sdgNumber: parseInt(sdgNumber) });
        if (existingSDG && existingSDG._id.toString() !== sdgId) {
          if (req.file) await cloudinary.uploader.destroy(req.file.filename);
          return res.status(400).json({ message: `SDG with number ${sdgNumber} already exists.` });
        }
      }
      sdg.sdgNumber = parseInt(sdgNumber);
    }
    if (title) sdg.title = title;
    if (shortDescription) sdg.shortDescription = shortDescription;
    if (fullDescription) sdg.fullDescription = fullDescription;
    
    // For array fields, expect full array replacement. Client should send the whole array.
    // Handle cases where these might be sent as JSON strings from multipart/form-data
    if (whatYouWillLearn) sdg.whatYouWillLearn = typeof whatYouWillLearn === 'string' ? JSON.parse(whatYouWillLearn) : whatYouWillLearn;
    if (presentations) sdg.presentations = typeof presentations === 'string' ? JSON.parse(presentations) : presentations;
    if (lessons) sdg.lessons = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
    if (practicalActivities) sdg.practicalActivities = typeof practicalActivities === 'string' ? JSON.parse(practicalActivities) : practicalActivities;


    // Handle image update
    if (req.file) {
      if (sdg.imageCloudinaryId) { // Delete old image from Cloudinary
        try { await cloudinary.uploader.destroy(sdg.imageCloudinaryId); }
        catch (e) { console.error("Error deleting old SDG image:", e); }
      }
      sdg.imageUrl = req.file.path;
      sdg.imageCloudinaryId = req.file.filename;
    }
    // Add logic here if you want to allow removing an image by sending an empty imageUrl
    // else if (req.body.imageUrl === '' && sdg.imageCloudinaryId) { ... }

    const updatedSDG = await sdg.save();
    res.status(200).json(updatedSDG);

  } catch (error) {
    console.error('Error updating SDG:', error);
    if (req.file && req.file.filename) { // Attempt to clean up newly uploaded file on error
        try { await cloudinary.uploader.destroy(req.file.filename); }
        catch (e) { console.error("Error cleaning up file after SDG update failure:", e); }
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    if (error.message.includes('JSON.parse')) {
        return res.status(400).json({ message: 'Invalid JSON format for nested arrays (presentations, lessons, etc.).' });
    }
    res.status(500).json({ message: 'Server error while updating SDG.' });
  }
};


// @desc    Delete an SDG (admin)
// @route   DELETE /api/admin/sdgs/:sdgId
// @access  Private/Admin
const deleteSDG = async (req, res) => {
  try {
    const { sdgId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
      return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }

    const sdg = await SDG.findById(sdgId);
    if (!sdg) {
      return res.status(404).json({ message: 'SDG not found.' });
    }

    // Delete image from Cloudinary if it exists
    if (sdg.imageCloudinaryId) {
      try { await cloudinary.uploader.destroy(sdg.imageCloudinaryId); }
      catch (e) { console.error("Error deleting SDG image from Cloudinary:", e); }
    }

    await sdg.deleteOne(); // Mongoose v6+ uses deleteOne(), remove() is deprecated for documents
    // Or await SDG.findByIdAndDelete(sdgId);

    res.status(200).json({ message: 'SDG deleted successfully.' });

  } catch (error) {
    console.error('Error deleting SDG:', error);
    res.status(500).json({ message: 'Server error while deleting SDG.' });
  }
};




// @desc    Create a news item (admin)
// @route   POST /api/admin/news
// @access  Private/Admin
const createNewsItem = async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename); // Clean up uploaded file
      return res.status(400).json({ message: 'Please provide title and text for the news item.' });
    }

    const newsItemPayload = {
      title,
      text,
      postedByAdmin: req.user._id,
    };

    if (req.file) {
      newsItemPayload.imageUrl = req.file.path;
      newsItemPayload.imageCloudinaryId = req.file.filename;
    }

    const newsItem = new News(newsItemPayload);
    const createdNewsItem = await newsItem.save();

    res.status(201).json(createdNewsItem);

  } catch (error) {
    console.error('Error creating news item (admin):', error);
    if (req.file && req.file.filename) {
        try { await cloudinary.uploader.destroy(req.file.filename); }
        catch (e) { console.error("Error cleaning up file after news creation failure:", e); }
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating news item.' });
  }
};


// @desc    Update a news item (admin)
// @route   PUT /api/admin/news/:newsId
// @access  Private/Admin
const updateNewsItem = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { title, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ message: 'Invalid news ID format.' });
    }

    const newsItem = await News.findById(newsId);
    if (!newsItem) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(404).json({ message: 'News item not found.' });
    }

    // Update fields if provided
    if (title) newsItem.title = title;
    if (text) newsItem.text = text;
    // The admin posting it doesn't change on update, it remains the original poster.
    // newsItem.postedByAdmin = req.user._id; // Usually not updated

    // Handle image update
    if (req.file) {
      if (newsItem.imageCloudinaryId) { // Delete old image from Cloudinary
        try { await cloudinary.uploader.destroy(newsItem.imageCloudinaryId); }
        catch (e) { console.error("Error deleting old news image:", e); }
      }
      newsItem.imageUrl = req.file.path;
      newsItem.imageCloudinaryId = req.file.filename;
    }
    // Add logic here if you want to allow removing an image:
    // else if (req.body.imageUrl === '' && newsItem.imageCloudinaryId) { ... delete from cloudinary and clear fields ... }


    const updatedNewsItem = await newsItem.save();
    res.status(200).json(updatedNewsItem);

  } catch (error) {
    console.error('Error updating news item (admin):', error);
     if (req.file && req.file.filename) {
        try { await cloudinary.uploader.destroy(req.file.filename); }
        catch (e) { console.error("Error cleaning up file after news update failure:", e); }
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while updating news item.' });
  }
};


// @desc    Delete a news item (admin)
// @route   DELETE /api/admin/news/:newsId
// @access  Private/Admin
const deleteNewsItem = async (req, res) => {
  try {
    const { newsId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: 'Invalid news ID format.' });
    }

    const newsItem = await News.findById(newsId);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found.' });
    }

    // Delete image from Cloudinary if it exists
    if (newsItem.imageCloudinaryId) {
      try { await cloudinary.uploader.destroy(newsItem.imageCloudinaryId); }
      catch (e) { console.error("Error deleting news image from Cloudinary:", e); }
    }

    await newsItem.deleteOne();
    res.status(200).json({ message: 'News item deleted successfully.' });

  } catch (error) {
    console.error('Error deleting news item (admin):', error);
    res.status(500).json({ message: 'Server error while deleting news item.' });
  }
};




// @desc    Get basic site statistics (admin)
// @route   GET /api/admin/analytics/stats
// @access  Private/Admin
const getSiteStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalBannedUsers = await User.countDocuments({ isBanned: true });
    const totalSDGs = await SDG.countDocuments({});
    const totalNewsItems = await News.countDocuments({});
    
    // Total enrollments can be represented by the number of UserProgress documents
    const totalEnrollments = await UserProgress.countDocuments({}); 
    
    // Could also add more complex stats like active users in last 7 days, etc.
    // For example, active users (who had activity in the last 7 days):
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsersLast7Days = await User.countDocuments({ lastActivityDate: { $gte: sevenDaysAgo } });

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalBannedUsers,
      activeUsersLast7Days,
      totalSDGs,
      totalNewsItems,
      totalEnrollments, 
    });

  } catch (error) {
    console.error('Error fetching site stats:', error);
    res.status(500).json({ message: 'Server error while fetching site statistics.' });
  }
};



// redemption

// @desc    Add a new redemption option
// @route   POST /api/admin/redemption/options
// @access  Admin
const addRedemptionOption = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            pointsRequired, 
            stock, 
            imageUrl, 
            linkToCourse, 
            isActive 
        } = req.body;

        if (!title || !pointsRequired) {
            return res.status(400).json({ message: 'Please provide a title and pointsRequired.' });
        }

        const newOption = new RedemptionOption({
            title,
            description,
            pointsRequired,
            stock: stock === 'Infinity' ? Infinity : Number(stock), // Handle 'Infinity' string from form
            imageUrl,
            linkToCourse,
            isActive: isActive !== undefined ? isActive : true, // Default to active
        });

        const createdOption = await newOption.save();
        res.status(201).json(createdOption);

    } catch (error) {
        console.error('Error adding redemption option:', error);
        res.status(500).json({ message: 'Server error while adding redemption option.' });
    }
};



// @desc    Update an existing redemption option
// @route   PUT /api/admin/redemption/options/:optionId
// @access  Admin
const updateRedemptionOption = async (req, res) => {
    try {
        const { optionId } = req.params;
        const { 
            title, 
            description, 
            pointsRequired, 
            stock, 
            imageUrl, 
            linkToCourse, 
            isActive 
        } = req.body;

        const option = await RedemptionOption.findById(optionId);

        if (!option) {
            return res.status(404).json({ message: 'Redemption option not found.' });
        }

        // Update fields if they are provided in the request body
        option.title = title ?? option.title;
        option.description = description ?? option.description;
        option.pointsRequired = pointsRequired ?? option.pointsRequired;
        option.stock = stock === 'Infinity' ? Infinity : (stock ?? option.stock);
        option.imageUrl = imageUrl ?? option.imageUrl;
        option.linkToCourse = linkToCourse ?? option.linkToCourse;
        option.isActive = isActive !== undefined ? isActive : option.isActive;

        const updatedOption = await option.save();
        res.status(200).json(updatedOption);

    } catch (error) {
        console.error('Error updating redemption option:', error);
        res.status(500).json({ message: 'Server error while updating redemption option.' });
    }
};



// @desc    Delete a redemption option
// @route   DELETE /api/admin/redemption/options/:optionId
// @access  Admin
const deleteRedemptionOption = async (req, res) => {
    try {
        const { optionId } = req.params;

        const option = await RedemptionOption.findById(optionId);

        if (!option) {
            return res.status(404).json({ message: 'Redemption option not found.' });
        }

        await option.deleteOne();
        res.status(200).json({ message: 'Redemption option removed successfully.' });

    } catch (error) {
        console.error('Error deleting redemption option:', error);
        res.status(500).json({ message: 'Server error while deleting redemption option.' });
    }
};




export { getAllUsers, getUserById, toggleUserBanStatus, toggleUserAdminStatus, createSDG, updateSDG, deleteSDG, createNewsItem, updateNewsItem, deleteNewsItem, getSiteStats,  addRedemptionOption, updateRedemptionOption, deleteRedemptionOption };