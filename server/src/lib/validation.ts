import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createCampaignSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  totalCoupons: z.number().int().min(1).max(10000),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
});

export const claimCouponSchema = z.object({
  campaignId: z.string().uuid(),
});
