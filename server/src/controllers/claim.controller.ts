import { Request, Response } from 'express';
import claimService from '../services/claim.service';
import { claimCouponSchema } from '../lib/validation';

export const claimCouponController = async (req: Request, res: Response) => {
  try {
    const validatedData = claimCouponSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const claim = await claimService.claimCoupon({
      campaignId: validatedData.campaignId,
      userId,
    });

    res.status(201).json(claim);
  } catch (error) {
    throw error;
  }
};

export const getMyClaimsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const claims = await claimService.getUserClaims(userId);
    res.status(200).json(claims);
  } catch (error) {
    throw error;
  }
};
