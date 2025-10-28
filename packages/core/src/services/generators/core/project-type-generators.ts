/**
 * Project Type Generators
 *
 * Generates project type specific directory structures and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem } from './core-file-operations.js';

// File permission constants
const DEFAULT_DIR_PERMISSIONS = 0o755;

/**
 * Handles project type specific structure generation
 */
export class ProjectTypeGenerators {
  /**
   * Generate base directory structure
   * @returns Base directory structure
   */
  static generateBaseStructure(): DirectoryItem[] {
    return [
      // Core directories (AC1) - Following SOLID principles
      { path: 'src', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/core', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/services', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/utils', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/types', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/interfaces', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'bin', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'docs', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata/cache', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata/config', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.claude', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.github', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },

      // Test structure directories (AC5)
      { path: 'tests/unit', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/integration', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/e2e', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/fixtures', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/factories', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },

      // Documentation structure directories (AC4)
      { path: 'docs/api', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'docs/examples', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }

  /**
   * Generate project type specific structure
   * @param projectType - Project type
   * @returns Project type specific structure
   */
  static generateProjectTypeStructure(projectType: string): DirectoryItem[] {
    switch (projectType) {
      case 'cli':
        return [
          { path: 'src/cli', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          { path: 'tests/unit/cli', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
        ];
      case 'web':
        return [
          { path: 'public', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          { path: 'src/components', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          { path: 'src/styles', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          { path: 'tests/unit/components', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          {
            path: 'tests/integration/components',
            type: 'directory',
            mode: DEFAULT_DIR_PERMISSIONS,
          },
        ];
      case 'library':
        return [
          { path: 'dist', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
          { path: 'tests/unit/library', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
        ];
      default:
        return [];
    }
  }

  /**
   * Generate web-specific core files
   * @param config - Project configuration
   * @returns Web-specific core files
   */
  static generateWebCoreFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'index.html',
        type: 'file' as const,
        content: ProjectTypeGenerators.generateWebIndexHtml(config),
      },

      {
        path: 'src/App.tsx',
        type: 'file' as const,
        content: ProjectTypeGenerators.generateWebAppFile(config),
      },

      {
        path: 'public/styles.css',
        type: 'file' as const,
        content: ProjectTypeGenerators.generateWebStylesFile(config),
      },

      {
        path: 'src/styles/main.css',
        type: 'file' as const,
        content: ProjectTypeGenerators.generateWebMainStylesFile(config),
      },
    ];
  }

  /**
   * Generate library-specific core files
   * @param config - Project configuration
   * @returns Library-specific core files
   */
  static generateLibraryCoreFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'docs/api.md',
        type: 'file' as const,
        content: ProjectTypeGenerators.generateLibraryAPIDocumentation(config),
      },
    ];
  }

  /**
   * Generate .gitkeep files for empty directories
   * @param config - Project configuration to determine project-specific empty directories
   * @returns Array of .gitkeep file directory items
   */
  static generateGitkeepFiles(config: ProjectConfig): DirectoryItem[] {
    const directoriesToKeep = [
      'dist',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/fixtures',
      'tests/factories',
      'docs/api',
      'docs/examples',
      '.nimata/cache',
      '.nimata/config',
      'bin',
      'docs',
    ];

    // Add project-type specific directories that might be empty
    if (config.projectType === 'cli') {
      directoriesToKeep.push('src/cli');
    }
    if (config.projectType === 'web') {
      directoriesToKeep.push('public');
      directoriesToKeep.push('src/components');
      directoriesToKeep.push('src/styles');
    }

    return directoriesToKeep.map((dir) => ({
      path: `${dir}/.gitkeep`,
      type: 'file' as const,
      content: '',
      mode: 0o644, // Regular file permissions
    }));
  }

  /**
   * Generate web index.html file
   * @param config - Project configuration
   * @returns HTML content
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
   * @param config - Project configuration
   * @returns TSX content
   */
  private static generateWebAppFile(config: ProjectConfig): string {
    return [
      ProjectTypeGenerators.generateWebAppImports(),
      ProjectTypeGenerators.generateWebAppComponent(config),
      ProjectTypeGenerators.generateWebAppInitialization(),
      ProjectTypeGenerators.generateWebAppExport(),
    ].join('\n\n');
  }

  /**
   * Generate web app imports
   * @returns Import statements
   */
  private static generateWebAppImports(): string {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';`;
  }

  /**
   * Generate web app component
   * @param config - Project configuration
   * @returns App component code
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
   * @returns App initialization code
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
   * @returns Export statement
   */
  private static generateWebAppExport(): string {
    return `export default App;`;
  }

  /**
   * Generate web public styles.css file
   * @param config - Project configuration
   * @returns CSS content
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
   * @param config - Project configuration
   * @returns CSS content
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

  /**
   * Generate library API documentation
   * @param config - Project configuration
   * @returns API documentation markdown
   */
  private static generateLibraryAPIDocumentation(config: ProjectConfig): string {
    return `# API Documentation

## Overview

${config.description || 'A modern TypeScript library'}

## Installation

\`\`\`bash
npm install ${config.name}
\`\`\`

## Usage

\`\`\`typescript
import { main } from '${config.name}';

// TODO: Add usage examples
\`\`\`

## API Reference

### Functions

\`\`\`typescript
// TODO: Add function documentation
\`\`\`

## Contributing

Please see the main README.md for contribution guidelines.

## License

${config.license || 'MIT'}
`;
  }
}
