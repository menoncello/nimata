/**
 * Development Server Configuration
 *
 * This file can be used for custom development server setup
 * For most use cases, Vite's built-in development server should be sufficient.
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ViteDevServer } from 'vite';

/**
 * Development logger for server messages
 */
const logger = {
  log: (message: string) => {
    // In production, this could be replaced with a proper logger
    process.stdout.write(`[Server] ${message}\n`);
  },
};

/**
 * Setup custom development server with proxy configuration
 * This is useful when you need custom middleware or proxy setup
 * @param {ViteDevServer} _vite - Vite development server instance
 * @returns {Promise<express.Application>} Express application instance
 */
export async function setupDevServer(_vite: ViteDevServer): Promise<express.Application> {
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
  /**
   * Custom middleware for adding headers or logging
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  app.use((req, res, next) => {
    // Add custom headers or logging here
    next();
  });

  return app;
}

/**
 * Standalone development server (alternative to Vite)
 * @returns Express application instance
 */
/**
 * Default port for the standalone development server
 * @type {number}
 */
const DEFAULT_PORT = 3000;

/**
 * Standalone development server (alternative to Vite)
 * @returns {express.Application} Express application instance
 */
export function createStandaloneServer(): express.Application {
  const app = express();
  /**
   * Port number for the development server
   * @type {number}
   */
  const port = Number(process.env.PORT) || DEFAULT_PORT;

  // Serve static files from dist directory
  /**
   * Serve static files from the dist directory
   */
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
    logger.log(`Development server running on http://localhost:${port}`);
  });

  return app;
}

// Re-export functions for easy importing
export { setupDevServer, createStandaloneServer };
