import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  createCampaignSchema,
  claimCouponSchema,
} from './validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      expect(() => registerSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid-email', password: 'password123' };
      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject short password', () => {
      const data = { email: 'test@example.com', password: '12345' };
      expect(() => registerSchema.parse(data)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid-email', password: 'password123' };
      expect(() => loginSchema.parse(data)).toThrow();
    });
  });

  describe('createCampaignSchema', () => {
    it('should validate correct campaign data', () => {
      const data = {
        title: 'Test Campaign',
        description: 'Test description',
        totalCoupons: 100,
        startsAt: '2024-01-01T00:00:00Z',
      };
      expect(() => createCampaignSchema.parse(data)).not.toThrow();
    });

    it('should reject empty title', () => {
      const data = {
        title: '',
        totalCoupons: 100,
        startsAt: '2024-01-01T00:00:00Z',
      };
      expect(() => createCampaignSchema.parse(data)).toThrow();
    });

    it('should reject invalid totalCoupons', () => {
      const data = {
        title: 'Test Campaign',
        totalCoupons: -1,
        startsAt: '2024-01-01T00:00:00Z',
      };
      expect(() => createCampaignSchema.parse(data)).toThrow();
    });

    it('should reject invalid date format', () => {
      const data = {
        title: 'Test Campaign',
        totalCoupons: 100,
        startsAt: 'invalid-date',
      };
      expect(() => createCampaignSchema.parse(data)).toThrow();
    });
  });

  describe('claimCouponSchema', () => {
    it('should validate correct claim data', () => {
      const data = { campaignId: '123e4567-e89b-12d3-a456-426614174000' };
      expect(() => claimCouponSchema.parse(data)).not.toThrow();
    });

    it('should reject invalid UUID', () => {
      const data = { campaignId: 'invalid-uuid' };
      expect(() => claimCouponSchema.parse(data)).toThrow();
    });
  });
});
