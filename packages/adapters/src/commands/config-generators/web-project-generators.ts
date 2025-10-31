/**
 * Web Project Generators
 *
 * Generates Vite configuration, HTML, React components, and CSS for web projects
 */

import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * Web Project Generators Class
 */
export class WebProjectGenerators {
  /**
   * Generate Vite configuration for web projects
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Vite configuration content
   */
  generateViteConfig(_config: ProjectConfig): string {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});`;
  }

  /**
   * Generate index.html for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML content
   */
  generateIndexHtml(config: ProjectConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <link rel="stylesheet" href="./public/styles.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./src/index.ts"></script>
</body>
</html>`;
  }

  /**
   * Generate App.tsx for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App.tsx content
   */
  generateAppTsx(config: ProjectConfig): string {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';

/**
 * Main App component for ${config.name}
 */
function App() {
  return (
    <div className="app">
      <header>
        <h1>Welcome to ${config.name}</h1>
      </header>
      <main>
        <p>Your React application is ready!</p>
      </main>
    </div>
  );
}

// Initialize and render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;`;
  }

  /**
   * Generate main.css for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  generateMainCss(config: ProjectConfig): string {
    return `/* Main styles for ${config.name} */

.app {
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  color: #7f8c8d;
  font-size: 1.1rem;
}`;
  }

  /**
   * Generate public/styles.css for web projects
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  generatePublicCss(config: ProjectConfig): string {
    return `/* Public styles for ${config.name} */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

main {
  flex: 1;
  padding: 2rem;
}`;
  }
}
