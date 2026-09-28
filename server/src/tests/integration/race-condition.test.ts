import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';

describe('Race Condition Tests', () => {
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
        title: 'Race Condition Test Campaign',
        totalCoupons: 10,
        startsAt: new Date().toISOString(),
      });

    campaignId = campaignResponse.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should not oversell coupons with concurrent requests', async () => {
    const totalCoupons = 10;
    const concurrentRequests = 20;

    const registerPromises = Array.from({ length: concurrentRequests }, () =>
      request(app)
        .post('/auth/register')
        .send({
          email: `race-test-${Date.now()}-${Math.random()}@example.com`,
          password: 'password123',
        })
    );

    const registerResponses = await Promise.all(registerPromises);
    const tokens = registerResponses.map((r) => r.body.accessToken);

    const claimPromises = tokens.map((token) =>
      request(app)
        .post('/claims')
        .set('Authorization', `Bearer ${token}`)
        .send({ campaignId })
    );

    const claimResponses = await Promise.all(claimPromises);
    const successfulClaims = claimResponses.filter((r) => r.status === 201).length;

    expect(successfulClaims).toBeLessThanOrEqual(totalCoupons);
  });
});
