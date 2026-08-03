import { Router } from 'express';
import { claimCouponController } from '../controllers/claim.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, claimCouponController);

export default router;
