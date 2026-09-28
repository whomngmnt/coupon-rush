import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject duplicate email', async () => {
      const email = `test-${Date.now()}@example.com`;

      await request(app).post('/auth/register').send({
        email,
        password: 'password123',
      });

      const response = await request(app).post('/auth/register').send({
        email,
        password: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'password123';

      await request(app).post('/auth/register').send({ email, password });

      const response = await request(app).post('/auth/login').send({
        email,
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
