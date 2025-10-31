/**
 * Project Templates
 *
 * Template generation logic for different project types and configurations
 */

import { type ProjectConfig } from './enhanced-init-types.js';

/**
 * Project Templates Class
 */
export class ProjectTemplates {
  /**
   * Get main file content based on project type
   * @param {string} projectType - Project type
   * @param {string} projectName - Project name
   * @returns { string} Main file content
   */
  getMainFileContent(projectType: string, projectName: string): string {
    switch (projectType) {
      case 'cli':
        return this.getCliTemplate(projectName);
      case 'web':
        return this.getWebTemplate(projectName);
      case 'library':
        return this.getLibraryTemplate(projectName);
      default:
        return this.getBasicTemplate(projectName);
    }
  }

  /**
   * Get index file content for libraries
   * @param {string} projectName - Project name
   * @returns {string): string} Index file content
   */
  getIndexFileContent(projectName: string): string {
    return `/**
 * ${projectName}
 * ${projectName.charAt(0).toUpperCase() + projectName.slice(1)} library
 */

// Export your public API here
export * from './main';
`;
  }

  /**
   * Get main file name for project type
   * @param {string} projectType - Project type
   * @returns {string): string} Main file name
   */
  getMainFileName(projectType: string): string {
    if (projectType === 'cli') {
      return 'bin/cli.ts';
    }
    return 'index.ts';
  }

  /**
   * Generate README content
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): string} README content
   */
  generateReadmeContent(config: ProjectConfig): string {
    return `# ${config.name}

${config.description || `A ${config.projectType} project built with TypeScript.`}

## Features

- Written in TypeScript
- ESLint for code linting
- Prettier for code formatting
- Vitest for testing
- ${config.aiAssistants.join(' and ')} integration

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm run dev
\`\`\`

## Scripts

- \`npm run build\` - Build the project
- \`npm run dev\` - Run in development mode
- \`npm run test\` - Run tests
- \`npm run lint\` - Run ESLint
- \`npm run format\` - Format code with Prettier

## License

MIT
`;
  }

  /**
   * Generate .gitignore content
   * @returns {string} .gitignore content
   */
  generateGitignoreContent(): string {
    return [
      this.getGitignoreDependencies(),
      this.getGitignoreBuildOutputs(),
      this.getGitignoreEnvironment(),
      this.getGitignoreIde(),
      this.getGitignoreOs(),
      this.getGitignoreCoverage(),
      this.getGitignoreLogs(),
      this.getGitignoreTempFiles(),
    ].join('\n');
  }

  /**
   * Get dependencies section for .gitignore
   * @returns {string} Dependencies gitignore content
   */
  private getGitignoreDependencies(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*`;
  }

  /**
   * Get build outputs section for .gitignore
   * @returns {string} Build outputs gitignore content
   */
  private getGitignoreBuildOutputs(): string {
    return `# Build outputs
dist/
build/
*.tsbuildinfo`;
  }

  /**
   * Get environment section for .gitignore
   * @returns {string} Environment gitignore content
   */
  private getGitignoreEnvironment(): string {
    return `# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;
  }

  /**
   * Get IDE section for .gitignore
   * @returns {string} IDE gitignore content
   */
  private getGitignoreIde(): string {
    return `# IDE
.vscode/
.idea/
*.swp
*.swo`;
  }

  /**
   * Get OS section for .gitignore
   * @returns {string} OS gitignore content
   */
  private getGitignoreOs(): string {
    return `# OS
.DS_Store
Thumbs.db`;
  }

  /**
   * Get coverage section for .gitignore
   * @returns {string} Coverage gitignore content
   */
  private getGitignoreCoverage(): string {
    return `# Coverage
coverage/
*.lcov`;
  }

  /**
   * Get logs section for .gitignore
   * @returns {string} Logs gitignore content
   */
  private getGitignoreLogs(): string {
    return `# Logs
logs/
*.log`;
  }

  /**
   * Get temporary files section for .gitignore
   * @returns {string} Temporary files gitignore content
   */
  private getGitignoreTempFiles(): string {
    return `# Temporary files
*.tmp
*.temp`;
  }

  /**
   * Get CLI project template
   * @param {string} projectName - Project name
   * @returns {string): string} CLI template content
   */
  private getCliTemplate(projectName: string): string {
    return `#!/usr/bin/env bun

import { Command } from 'commander';

const program = new Command();

program
  .name('${projectName}')
  .description('A CLI tool built with TypeScript')
  .version('1.0.0');

program.parse();
`;
  }

  /**
   * Get web project template
   * @param {string} projectName - Project name
   * @returns {string): string} Web template content
   */
  private getWebTemplate(projectName: string): string {
    return `console.log('Hello, ${projectName}!');

// Your web application logic here
export class App {
  constructor() {
    // Initialize your app
  }
}

new App();
`;
  }

  /**
   * Get library project template
   * @param {string} projectName - Project name
   * @returns {string): string} Library template content
   */
  private getLibraryTemplate(projectName: string): string {
    return `/**
 * Main entry point for ${projectName}
 */

/**


 *  method


 */


export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

export default hello;
`;
  }

  /**
   * Get basic project template
   * @param {string} projectName - Project name
   * @returns {string): string} Basic template content
   */
  private getBasicTemplate(projectName: string): string {
    return `console.log('Hello from ${projectName}!');

/**


 *  method


 */


export function main(): void {
  // Your application logic here
}

main();
`;
  }
}
