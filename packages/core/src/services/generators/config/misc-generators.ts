/**
 * Miscellaneous Content Generators
 */

import { DIRECTORIES } from './constants.js';

/**
 * Generates miscellaneous file content
 */
export class MiscGenerators {
  /**
   * Generate .gitignore content
   * @returns Gitignore content
   */
  static generateGitignore(): string {
    const sections = [
      this.getDependenciesSection(),
      this.getBuildSection(),
      this.getEnvironmentSection(),
      this.getIDESection(),
      this.getOSSection(),
      this.getLogsSection(),
      this.getCoverageSection(),
      this.getCacheSection(),
      this.getBunSection(),
    ];

    return sections.join('\n\n');
  }

  /**
   * Get dependencies section
   * @returns Dependencies section content
   */
  private static getDependenciesSection(): string {
    return `# Dependencies
node_modules/
bun.lockb`;
  }

  /**
   * Get build section
   * @returns Build section content
   */
  private static getBuildSection(): string {
    return `# Build output
${DIRECTORIES.DIST}/
${DIRECTORIES.BUILD}/`;
  }

  /**
   * Get environment section
   * @returns Environment section content
   */
  private static getEnvironmentSection(): string {
    return `# Environment variables
.env
.env.local
.env.production`;
  }

  /**
   * Get IDE section
   * @returns IDE section content
   */
  private static getIDESection(): string {
    return `# IDE
.vscode/
.idea/
*.swp
*.swo`;
  }

  /**
   * Get OS section
   * @returns OS section content
   */
  private static getOSSection(): string {
    return `# OS
.DS_Store
Thumbs.db`;
  }

  /**
   * Get logs section
   * @returns Logs section content
   */
  private static getLogsSection(): string {
    return `# Logs
${DIRECTORIES.LOGS}/
*.log`;
  }

  /**
   * Get coverage section
   * @returns Coverage section content
   */
  private static getCoverageSection(): string {
    return `# Coverage
${DIRECTORIES.COVERAGE}/`;
  }

  /**
   * Get cache section
   * @returns Cache section content
   */
  private static getCacheSection(): string {
    return `# Cache
${DIRECTORIES.CACHE}/
temp/`;
  }

  /**
   * Get Bun section
   * @returns Bun section content
   */
  private static getBunSection(): string {
    return `# Bun
bun.lockb`;
  }
}
