// server/routes/communityRoutes.js
import express from 'express';
import { 
    createNewsItem, 
    getAllNews,
    getNotableStreaks // Added
} from '../controllers/communityController.js'; // Renamed controller
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/multerUpload.js';

const router = express.Router();

// Community Routes

// /api/community/news 
router.post(
  '/news', // Now /api/community/news
  protect,       
  isAdmin,       
  upload.single('newsImage'), 
  createNewsItem
);
router.get('/news', getAllNews); // Now /api/community/news

// Streak Endpoints

// /api/community/streaks/notable
router.get(
  '/streaks/notable', // Now /api/community/streaks/notable
  protect,
  isAdmin,
  getNotableStreaks
);

export default router;