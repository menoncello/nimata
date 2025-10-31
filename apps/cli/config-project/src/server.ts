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
 * Setup custom development server with proxy configuration
 * This is useful when you need custom middleware or proxy setup
 */
export async function setupDevServer(vite: ViteDevServer) {
  const app = express();

  // API proxy configuration
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }));

  // Custom middleware examples
  app.use((req, res, next) => {
    // Add custom headers or logging here
    next();
  });

  return app;
}

/**
 * Standalone development server (alternative to Vite)
 */
export function createStandaloneServer() {
  const app = express();
  const port = process.env.PORT || 3000;

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
    console.log(`🚀 Development server running on http://localhost:${port}`);
  });

  return app;
}

// Export for potential use
export default {
  setupDevServer,
  createStandaloneServer,
};
