// server/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Define routes for authentication

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Authenticate user and get token
router.post('/login', loginUser);



export default router;