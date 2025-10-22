/**
 * Integration tests for the web server
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import request from 'supertest';
import app from '../src/server';

describe('TestWebCheck Web Server', () => {
  describe('Health Check', () => {
    it('should return 200 OK for health check', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('API Routes', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty('name', 'TestWebCheck API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Hello API', () => {
    it('should return default greeting', async () => {
      const response = await request(app).get('/api/hello').expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.message).toContain('Hello, World');
    });

    it('should return custom greeting with query parameter', async () => {
      const response = await request(app).get('/api/hello?name=TypeScript').expect(200);

      expect(response.body.message).toContain('Hello, TypeScript');
    });

    it('should create custom greeting with POST', async () => {
      const response = await request(app)
        .post('/api/hello')
        .send({ name: 'Bun', options: { uppercase: true, exclamation: true } })
        .expect(201);

      expect(response.body.message).toContain('HELLO, BUN!');
      expect(response.body).toHaveProperty('options');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 400 for missing name in POST request', async () => {
      const response = await request(app)
        .post('/api/hello')
        .send({ options: { uppercase: true } })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name is required');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route').expect(404);

      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('availableRoutes');
    });
  });
});
