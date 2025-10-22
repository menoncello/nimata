/**
 * Hello API Routes
 */

import { Router } from 'express';
import { hello } from '../services/helloService.js';

const router = Router();

/**
 * GET /api/hello
 * Get a simple greeting
 */
router.get('/', (req, res) => {
  const { name = 'World' } = req.query;

  try {
    const greeting = hello(String(name));
    res.json({
      message: greeting,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate greeting',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/hello
 * Create a custom greeting
 */
router.post('/', (req, res) => {
  const { name, options = {} } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'Name is required',
      message: 'Please provide a name in the request body',
    });
  }

  try {
    const greeting = hello(name, options);
    res.status(201).json({
      message: greeting,
      options,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate greeting',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as helloRouter };
