/**
 * Main Entry Generator
 *
 * Generates main React entry file for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate main React entry file
 * @param {ProjectConfig} _config - Project configuration (unused)
 * @returns {string} Main entry file code
 */
export function generateMainEntry(_config: ProjectConfig): string {
  const imports = getImports();
  const rootElementCode = getRootElementCode();
  const renderCode = getRenderCode();
  const productionCode = getProductionFeatures();
  const devCode = getDevelopmentFeatures();
  const errorHandling = getErrorHandling();

  return `${imports}

${rootElementCode}

${renderCode}

${productionCode}

${devCode}

${errorHandling}
`;
}

/**
 * Get import statements for main entry
 * @returns {string} Import statements
 */
function getImports(): string {
  return `import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { registerServiceWorker } from './utils/service-worker';
import { reportWebVitals } from './utils/web-vitals';
import './styles/main.css';`;
}

/**
 * Get root element finding code
 * @returns {string} Root element code
 */
function getRootElementCode(): string {
  return `// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create React root
const root = createRoot(rootElement);`;
}

/**
 * Get React render code
 * @returns {string} Render code
 */
function getRenderCode(): string {
  return `// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

/**
 * Get production features code
 * @returns {string} Production features code
 */
function getProductionFeatures(): string {
  return `// Register service worker for production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Report web vitals
reportWebVitals(console.log);`;
}

/**
 * Get development features code
 * @returns {string} Development features code
 */
function getDevelopmentFeatures(): string {
  return `// Hot module replacement
if (import.meta.env.DEV) {
  import.meta.hot?.accept();
}`;
}

/**
 * Get error handling code
 * @returns {string} Error handling code
 */
function getErrorHandling(): string {
  return `// Error boundary setup
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // You can send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can send this to an error tracking service
});`;
}
