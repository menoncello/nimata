/**
 * Gitignore Generators
 *
 * Handles .gitignore content generation and related operations
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Gitignore content generators
 */
export class GitignoreGenerators {
  /**
   * Generate .gitignore content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} .gitignore content
   */
  static generateGitignoreContent(config: ProjectConfig): string {
    return [
      GitignoreGenerators.generateDependencyIgnores(),
      GitignoreGenerators.generateBuildIgnores(),
      GitignoreGenerators.generateEnvironmentIgnores(),
      GitignoreGenerators.generateEditorIgnores(),
      GitignoreGenerators.generateOSIgnores(),
      GitignoreGenerators.generateLogIgnores(),
      GitignoreGenerators.generateRuntimeIgnores(),
      GitignoreGenerators.generateCoverageIgnores(),
      GitignoreGenerators.generateCacheIgnores(),
      GitignoreGenerators.generateTempIgnores(),
      GitignoreGenerators.generateProjectSpecificIgnores(config),
    ].join('\n');
  }

  /**
   * Generate dependency ignore patterns
   * @returns {string} Dependency ignore patterns
   */
  private static generateDependencyIgnores(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun.lockb`;
  }

  /**
   * Generate build output ignore patterns
   * @returns {string} Build output ignore patterns
   */
  private static generateBuildIgnores(): string {
    return `# Build outputs
dist/
build/
*.tsbuildinfo
*.d.ts`;
  }

  /**
   * Generate environment file ignore patterns
   * @returns {string} Environment file ignore patterns
   */
  private static generateEnvironmentIgnores(): string {
    return `# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;
  }

  /**
   * Generate editor file ignore patterns
   * @returns {string} Editor file ignore patterns
   */
  private static generateEditorIgnores(): string {
    return `# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~`;
  }

  /**
   * Generate OS file ignore patterns
   * @returns {string} OS file ignore patterns
   */
  private static generateOSIgnores(): string {
    return `# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  }

  /**
   * Generate log file ignore patterns
   * @returns {string} Log file ignore patterns
   */
  private static generateLogIgnores(): string {
    return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*`;
  }

  /**
   * Generate runtime file ignore patterns
   * @returns {string} Runtime file ignore patterns
   */
  private static generateRuntimeIgnores(): string {
    return `# Runtime data
pids
*.pid
*.seed
*.pid.lock`;
  }

  /**
   * Generate coverage ignore patterns
   * @returns {string} Coverage ignore patterns
   */
  private static generateCoverageIgnores(): string {
    return `# Coverage directory used by tools like istanbul
coverage/
*.lcov`;
  }

  /**
   * Generate cache ignore patterns
   * @returns {string} Cache ignore patterns
   */
  private static generateCacheIgnores(): string {
    return `# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Nimata cache directory
.nimata/cache/`;
  }

  /**
   * Generate temporary file ignore patterns
   * @returns {string} Temporary file ignore patterns
   */
  private static generateTempIgnores(): string {
    return `# Temporary folders
tmp/
temp/

# Temporary files
*.tmp`;
  }

  /**
   * Generate project-specific ignore patterns
   * @param {ProjectConfig} config - Project configuration
   * @returns {boolean}ic ignore patterns
   */
  private static generateProjectSpecificIgnores(config: ProjectConfig): string {
    const ignores: string[] = [];

    // Add CLI-specific ignores
    if (config.projectType === 'cli') {
      ignores.push(`# CLI specific
bin/
*.cli`);
    }

    // Add framework-specific ignores
    if (config.framework === 'react' || config.framework === 'vue') {
      ignores.push(`# Frontend specific
public/build/
dist-ssr/
*.local`);
    }

    // Add testing framework ignores
    ignores.push(`# Testing
/coverage
/reports`);

    return ignores.length > 0 ? `\n# Project specific\n${ignores.join('\n')}` : '';
  }

  /**
   * Create gitignore file item for DirectoryItem structure
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Directory item
   */
  static createGitignoreFile(config: ProjectConfig): {
    path: string;
    type: 'file';
    content: string;
  } {
    return {
      path: '.gitignore',
      type: 'file',
      content: GitignoreGenerators.generateGitignoreContent(config),
    };
  }
}
