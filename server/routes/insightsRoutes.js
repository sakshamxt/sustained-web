// server/routes/insightsRoutes.js
import express from 'express';
import { getLearnerOfTheWeek } from '../controllers/insightsController.js';
// Import protect/isAdmin if some insight routes need protection later

const router = express.Router();

// GET /api/insights/learner-of-the-week
router.get('/learner-of-the-week', getLearnerOfTheWeek);

export default router;