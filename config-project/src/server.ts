/**
 * Development Server Configuration
 *
 * This file can be used for custom development server setup
 * For most use cases, Vite's built-in development server should be sufficient.
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ViteDevServer } from 'vite';

// Simple logger for development server
const logger = {
  log: (message: string) => {
    // Only log during development
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(`${message}\n`);
    }
  },
};

// Default port for development server
const DEFAULT_PORT = 3000;

/**
 * Setup custom development server with proxy configuration
 * This is useful when you need custom middleware or proxy setup
 * @param {_vite} _vite - Vite development server instance
 * @returns {Promise<express.Express>} Express application instance
 */
export async function setupDevServer(_vite: ViteDevServer): Promise<express.Express> {
  const app = express();

  // API proxy configuration
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    })
  );

  // Custom middleware examples
  app.use((req, res, next) => {
    // Add custom headers or logging here
    next();
  });

  return app;
}

/**
 * Standalone development server (alternative to Vite)
 * @returns {express.Express} Express application instance
 */
export function createStandaloneServer(): express.Express {
  const app = express();
  const port = process.env.PORT || DEFAULT_PORT;

  // Serve static files from dist directory
  app.use(express.static('dist'));

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Catch-all handler for SPA routing
  app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });

  app.listen(port, () => {
    // Log server startup information
    const serverUrl = `http://localhost:${port}`;
    logger.log(`Development server running on ${serverUrl}`);
  });

  return app;
}

// Named exports are already available above
