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
    const coreSections = [
      this.getDependenciesSection(),
      this.getBuildSection(),
      this.getEnvironmentSection(),
    ];

    const toolingSections = [
      this.getIDESection(),
      this.getLogsSection(),
      this.getCoverageSection(),
      this.getTypeScriptSection(),
    ];

    const systemSections = [this.getOSSection(), this.getCacheSection(), this.getTempSection()];

    const projectSections = [this.getBunSection()];

    return [...coreSections, ...toolingSections, ...systemSections, ...projectSections].join(
      '\n\n'
    );
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
   * Get TypeScript section
   * @returns TypeScript section content
   */
  private static getTypeScriptSection(): string {
    return `# TypeScript
*.tsbuildinfo
*.d.ts.map`;
  }

  /**
   * Get cache section
   * @returns Cache section content
   */
  private static getCacheSection(): string {
    return `# Cache
${DIRECTORIES.CACHE}/
.nimata/cache/
temp/`;
  }

  /**
   * Get temporary files section
   * @returns Temporary files section content
   */
  private static getTempSection(): string {
    return `# Temporary files
*.tmp
*.temp
*.swp
*.swo
*~`;
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
