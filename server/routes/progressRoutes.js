// server/routes/progressRoutes.js
import express from 'express';
import { markContentAsComplete } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/progress/:sdgId/complete/:contentType/:contentId
// contentType can be 'presentation', 'lesson', 'activity'
// contentId would be the unique title or ID of the specific item
router.post('/:sdgId/complete/:contentType/:contentId', protect, markContentAsComplete);

export default router;