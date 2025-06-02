// server/routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile  } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerUpload.js';

const router = express.Router();

// Define routes for user-related operations

// GET /api/users/me - Get current user profile
router.get('/me', protect, getUserProfile);

// PUT /api/users/me/profile - Update user profile
router.put('/me/profile', protect, upload.single('profilePicture'), updateUserProfile);


export default router;