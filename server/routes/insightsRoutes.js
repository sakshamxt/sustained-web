// server/routes/insightsRoutes.js
import express from 'express';
import { getLearnerOfTheWeek, getHeatmapData } from '../controllers/insightsController.js';
// Import protect/isAdmin if some insight routes need protection later

const router = express.Router();

// GET /api/insights/learner-of-the-week
router.get('/learner-of-the-week', getLearnerOfTheWeek);


// GET /api/insights/heatmap
router.get('/heatmap', getHeatmapData);

export default router;