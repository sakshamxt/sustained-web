// server/routes/redemptionRoutes.js
import express from 'express';
import { getRedemptionOptions, redeemPointsForOption } from '../controllers/redemptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/redemption/options - List available redemption options
router.get('/options', getRedemptionOptions); // Could be `protect`ed too if desired

// POST /api/redemption/redeem/:optionId - Redeem an option
router.post('/redeem/:optionId', protect, redeemPointsForOption);

export default router;