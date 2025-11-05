// server/routes/chatRoutes.js
import express from 'express';
import { generateChatResponse } from '../controllers/chatController.js';

// We'll assume you have a 'protect' middleware that verifies the JWT and attaches the user to the request.
import { protect } from '../middleware/authMiddleware.js'; // Adjust the path if yours is different

const router = express.Router();

// When a POST request is made to '/api/chat', it will first run the 'protect' middleware.
// If the user is authenticated, it will then run our 'generateChatResponse' controller.
router.post('/', protect, generateChatResponse);

export default router;