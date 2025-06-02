// server/routes/newsRoutes.js
import express from 'express';
import { createNewsItem, getAllNews } from '../controllers/newsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/multerUpload.js'; // Multer for file uploads

const router = express.Router();


// POST /api/community/news - Create a new news item (Admin only)
router.post(
  '/', // Route path will be /api/community/news
  protect,        // 1. User must be logged in
  isAdmin,        // 2. User must be an admin
  upload.single('newsImage'), // 3. Handle 'newsImage' file upload
  createNewsItem
);

// GET /api/community/news - Get all news items (Public)
router.get('/', getAllNews);

export default router;