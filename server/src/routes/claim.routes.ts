import { Router } from 'express';
import { claimCouponController } from '../controllers/claim.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { claimRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', authMiddleware, claimRateLimit, claimCouponController);

export default router;
