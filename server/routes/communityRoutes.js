// server/routes/communityRoutes.js
import express from 'express';
import { 
    getAllNews,
    getNewsById,
    getNotableStreaks
} from '../controllers/communityController.js'; // Renamed controller
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Community Routes

router.get('/news', getAllNews); // Now /api/community/news
router.get('/news/:id', getNewsById); // Now /api/community/news/:id

// Streak Endpoints

// /api/community/streaks/notable
router.get(
  '/streaks/notable', // Now /api/community/streaks/notable
  protect,
  isAdmin,
  getNotableStreaks
);

export default router;