/**
 * config-project Main Entry Point
 *
 * Application bootstrap and initialization
 */

import './styles/main.css';
import { App } from './App.js';
import type { AppConfig } from './types/app.types.js';

/**
 * Application configuration
 */
const config: AppConfig = {
  name: 'config-project',
  version: '1.0.0',
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Initialize and mount the application
 */
async function initializeApp(): Promise<void> {
  try {
    // Create app instance
    const app = new App(config);

    // Initialize app
    await app.initialize();

    // Mount to DOM
    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }

    app.mount(root);

    // Log initialization
    if (config.debug) {
      console.log(`${config.name} v${config.version} initialized successfully`);
    }
  } catch (error) {
    console.error('Failed to initialize application:', error);

    // Show error page
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #e53e3e;">
          <h1>Application Error</h1>
          <p>Failed to initialize ${config.name}. Please refresh the page.</p>
          <details style="margin-top: 1rem; text-align: left;">
            <summary>Error Details</summary>
            <pre style="background: #f7fafc; padding: 1rem; margin-top: 0.5rem; border-radius: 0.25rem; overflow: auto;">
              ${error instanceof Error ? error.stack : String(error)}
            </pre>
          </details>
        </div>
      `;
    }
  }
}

/**
 * Start the application
 */
initializeApp();
