// server/routes/sdgRoutes.js
import express from 'express';
import { getAllSDGs, getSDGByIdOrNumber } from '../controllers/sdgController.js';
// Will add enrollToSDG controller and protect middleware later

const router = express.Router();

router.get('/', getAllSDGs);
router.get('/:idOrNumber', getSDGByIdOrNumber);

export default router;