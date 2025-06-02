// server/routes/sdgRoutes.js
import express from 'express';
import { getAllSDGs, getSDGByIdOrNumber, enrollInSDG } from '../controllers/sdgController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to enroll a user in an SDG course

// GET /api/sdgs
router.get('/', getAllSDGs);

// GET /api/sdgs/:idOrNumber
router.get('/:idOrNumber', getSDGByIdOrNumber);

// POST /api/sdgs/:sdgId/enroll
router.post('/:sdgId/enroll', protect, enrollInSDG);

export default router;