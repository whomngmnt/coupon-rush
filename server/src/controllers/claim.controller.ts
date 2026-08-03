import { Request, Response } from 'express';
import claimService from '../services/claim.service';

export const claimCouponController = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;
    const userId = req.user?.userId;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const claim = await claimService.claimCoupon({
      campaignId,
      userId,
    });

    res.status(201).json(claim);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Campaign not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'No coupons left') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
