import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';

describe('Claim Integration Tests', () => {
  let authToken: string;
  let campaignId: string;

  beforeAll(async () => {
    await prisma.$connect();

    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
      });

    authToken = registerResponse.body.accessToken;

    const campaignResponse = await request(app)
      .post('/campaigns')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Campaign',
        totalCoupons: 10,
        startsAt: new Date().toISOString(),
      });

    campaignId = campaignResponse.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /claims', () => {
    it('should claim a coupon', async () => {
      const response = await request(app)
        .post('/claims')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ campaignId });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('campaignId');
      expect(response.body.campaignId).toBe(campaignId);
    });

    it('should reject duplicate claim from same user', async () => {
      await request(app)
        .post('/claims')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ campaignId });

      const response = await request(app)
        .post('/claims')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ campaignId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject unauthorized request', async () => {
      const response = await request(app).post('/claims').send({ campaignId });

      expect(response.status).toBe(401);
    });
  });
});
