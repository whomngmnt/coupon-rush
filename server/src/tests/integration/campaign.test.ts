import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';

describe('Campaign Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    await prisma.$connect();

    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
      });

    authToken = registerResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /campaigns', () => {
    it('should create a campaign', async () => {
      const response = await request(app)
        .post('/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Campaign',
          description: 'Test description',
          totalCoupons: 100,
          startsAt: new Date().toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body.title).toBe('Test Campaign');
    });

    it('should reject unauthorized request', async () => {
      const response = await request(app).post('/campaigns').send({
        title: 'Test Campaign',
        totalCoupons: 100,
        startsAt: new Date().toISOString(),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /campaigns', () => {
    it('should list campaigns', async () => {
      const response = await request(app).get('/campaigns');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /campaigns/:id', () => {
    it('should get campaign by id', async () => {
      const createResponse = await request(app)
        .post('/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Campaign',
          totalCoupons: 100,
          startsAt: new Date().toISOString(),
        });

      const campaignId = createResponse.body.id;

      const response = await request(app).get(`/campaigns/${campaignId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(campaignId);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app).get('/campaigns/non-existent-id');

      expect(response.status).toBe(404);
    });
  });
});
