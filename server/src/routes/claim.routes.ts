import { Router } from 'express';
import { claimCouponController, getMyClaimsController } from '../controllers/claim.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { claimRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', authMiddleware, claimRateLimit, claimCouponController);
router.get('/', authMiddleware, getMyClaimsController);

export default router;
