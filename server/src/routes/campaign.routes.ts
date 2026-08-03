import { Router } from 'express';
import { createCampaignController, listCampaignsController, getCampaignController } from '../controllers/campaign.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createCampaignController);
router.get('/', listCampaignsController);
router.get('/:id', getCampaignController);

export default router;
