/**
 * Web index file generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { generateIndexDocumentation } from '../shared/common-generators.js';
import { generateWebClass } from './web-classes.js';
import { generateWebExports } from './web-exports.js';
import { generateWebInterface } from './web-interfaces.js';

/**
 * Generate Web project index file
 * @param {ProjectConfig} _config - Project configuration (unused parameter kept for interface consistency)
 * @returns {string} Web index file TypeScript code
 */
export function generateWebIndexFile(_config: ProjectConfig): string {
  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './styles/main.css';

/**
 * Initialize and render the React application
 */
function initializeApp(): void {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Initialize the application
initializeApp();

export { initializeApp };`;
}

/**
 * Generate comprehensive web project index file with interfaces and classes
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Web index file TypeScript code
 */
export function generateWebProjectIndexFile(config: ProjectConfig): string {
  const documentation = generateIndexDocumentation(config);
  const interfaceCode = generateWebInterface(config);
  const classCode = generateWebClass(config);
  const exports = generateWebExports(config);

  return `${documentation}

${interfaceCode}

${classCode}

${exports}`;
}
