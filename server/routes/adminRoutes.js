// server/routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  toggleUserBanStatus,
  toggleUserAdminStatus,
  createSDG,
  updateSDG,
  deleteSDG,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  getSiteStats
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/multerUpload.js';

const router = express.Router();


// Admin routes for managing users

// All routes in this file should be protected by 'protect' and 'isAdmin'
router.use(protect, isAdmin);

// GET /api/admin/users - Get all users
router.get('/users', getAllUsers);

// GET /api/admin/users/:userId - Get single user
router.get('/users/:userId', getUserById);

// PUT /api/admin/users/:userId/banstatus - Ban/Unban a user
router.put('/users/:userId/banstatus', toggleUserBanStatus);

// PUT /api/admin/users/:userId/adminstatus - Toggle admin role for a user
router.put('/users/:userId/adminstatus', toggleUserAdminStatus);



// Admin routes for managing SDGs

// POST /api/admin/sdgs - Create a new SDG
router.post('/sdgs', upload.single('sdgImage'), createSDG);

// PUT /api/admin/sdgs/:sdgId - Update an SDG
router.put('/sdgs/:sdgId', upload.single('sdgImage'), updateSDG);

// DELETE /api/admin/sdgs/:sdgId - Delete an SDG
router.delete('/sdgs/:sdgId', deleteSDG);



// Admin routes for news

// POST /api/admin/news - Create a new news item
router.post('/news', upload.single('newsImage'), createNewsItem);

// PUT /api/admin/news/:newsId - Update a news item
router.put('/news/:newsId', upload.single('newsImage'), updateNewsItem);

// DELETE /api/admin/news/:newsId - Delete a news item
router.delete('/news/:newsId', deleteNewsItem);




// Admin route for site statistics

// GET /api/admin/analytics/stats
router.get('/analytics/stats', getSiteStats);




export default router;