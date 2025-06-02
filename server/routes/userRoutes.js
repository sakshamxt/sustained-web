// server/routes/userRoutes.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes for user-related operations

// GET /api/users/me - Get current user profile
router.get('/me', protect, getUserProfile);


export default router;