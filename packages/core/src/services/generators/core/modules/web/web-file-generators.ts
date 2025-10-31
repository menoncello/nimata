/**
 * Web Project File Generators
 *
 * Generates web-specific files and content
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { WebConfigGenerators } from '../../../web/web-config-generators.js';
import { DirectoryItem } from '../../file-operations/types.js';

/**
 * Handles web-specific file generation
 */
export class WebFileGenerators {
  /**
   * Generate web-specific core files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Web-specific core files
   */
  static generateWebCoreFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'index.html',
        type: 'file' as const,
        content: WebFileGenerators.generateWebIndexHtml(config),
      },
      {
        path: 'src/App.tsx',
        type: 'file' as const,
        content: WebFileGenerators.generateWebAppFile(config),
      },
      {
        path: 'public/styles.css',
        type: 'file' as const,
        content: WebFileGenerators.generateWebStylesFile(config),
      },
      {
        path: 'src/styles/main.css',
        type: 'file' as const,
        content: WebFileGenerators.generateWebMainStylesFile(config),
      },
      {
        path: 'vite.config.ts',
        type: 'file' as const,
        content: WebConfigGenerators.generateViteConfig(config),
      },
    ];
  }

  /**
   * Generate web index.html file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML content
   */
  private static generateWebIndexHtml(config: ProjectConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <link rel="stylesheet" href="./src/styles/main.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./src/index.ts"></script>
</body>
</html>`;
  }

  /**
   * Generate web App.tsx file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TSX content
   */
  private static generateWebAppFile(config: ProjectConfig): string {
    return [
      WebFileGenerators.generateWebAppImports(),
      WebFileGenerators.generateWebAppComponent(config),
      WebFileGenerators.generateWebAppInitialization(),
      WebFileGenerators.generateWebAppExport(),
    ].join('\n\n');
  }

  /**
   * Generate web app imports
   * @returns {string} Import statements
   */
  private static generateWebAppImports(): string {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';`;
  }

  /**
   * Generate web app component
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App component code
   */
  private static generateWebAppComponent(config: ProjectConfig): string {
    return `/**
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
}`;
  }

  /**
   * Generate web app initialization
   * @returns {string} App initialization code
   */
  private static generateWebAppInitialization(): string {
    return `// Initialize and render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}`;
  }

  /**
   * Generate web app export
   * @returns {string} Export statement
   */
  private static generateWebAppExport(): string {
    return `export default App;`;
  }

  /**
   * Generate web public styles.css file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  private static generateWebStylesFile(config: ProjectConfig): string {
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

  /**
   * Generate web src/styles/main.css file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  private static generateWebMainStylesFile(config: ProjectConfig): string {
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
}
