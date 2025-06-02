// server/routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  toggleUserBanStatus,
  toggleUserAdminStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

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

export default router;