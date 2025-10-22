/**
 * API Routes
 */

import { Router } from 'express';
import { helloRouter } from './hello.js';

const router = Router();

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'TestWebCheck API',
    version: '1.0.0',
    description: '',
    endpoints: {
      '/health': 'Health check endpoint',
      '/hello': 'Greeting endpoint',
      '/docs': 'API documentation',
    },
  });
});

// Mount sub-routes
router.use('/hello', helloRouter);

export function createApiRouter(): Router {
  return router;
}
