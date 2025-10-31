/**
 * Dependency Manager
 *
 * Manages project dependencies and scripts configuration
 */

import { type ProjectConfig } from './enhanced-init-types.js';

/**
 * Dependency Manager Class
 */
export class DependencyManager {
  /**
   * Get development dependencies based on configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, string>} Development dependencies object
   */
  getDevDependencies(config: ProjectConfig): Record<string, string> {
    const deps: Record<string, string> = {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
      'ts-node': '^10.9.0',
      eslint: '^8.0.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      prettier: '^3.0.0',
      vitest: '^1.0.0',
      '@vitest/coverage-v8': '^1.0.0',
    };

    if (config.projectType === 'library') {
      deps['@types/eslint'] = '^8.0.0';
    }

    return deps;
  }

  /**
   * Get runtime dependencies for project type
   * @param {string} projectType - Project type
   * @returns {Record<string, string>} Dependencies object
   */
  getDependencies(projectType: string): Record<string, string> {
    if (projectType === 'cli') {
      return {
        commander: '^11.0.0',
      };
    }
    return {};
  }

  /**
   * Get scripts for project type
   * @param {string} projectType - Project type
   * @returns {Record<string, string>} Scripts object
   */
  getScripts(projectType: string): Record<string, string> {
    const baseScripts = {
      build: 'tsc',
      start: 'node dist/index.js',
      dev: 'ts-node src/index.ts',
      lint: 'eslint src --ext .ts',
      'lint:fix': 'eslint src --ext .ts --fix',
      format: 'prettier --write "src/**/*.ts"',
      'format:check': 'prettier --check "src/**/*.ts"',
      clean: 'rm -rf dist',
    };

    switch (projectType) {
      case 'cli':
        return {
          ...baseScripts,
          start: 'node dist/bin/cli.js',
          dev: 'ts-node src/bin/cli.ts',
          prepublishOnly: 'npm run build',
        };
      case 'library':
        return {
          ...baseScripts,
          prepublishOnly: 'npm run build && npm run test',
        };
      default:
        return baseScripts;
    }
  }

  /**
   * Get keywords for project type
   * @param {string} projectType - Project type
   * @returns {string[]} Keywords array
   */
  getKeywords(projectType: string): string[] {
    const baseKeywords = ['typescript', 'node'];

    switch (projectType) {
      case 'web':
        return [...baseKeywords, 'web', 'frontend'];
      case 'cli':
        return [...baseKeywords, 'cli', 'command-line', 'tool'];
      case 'library':
        return [...baseKeywords, 'library', 'package'];
      default:
        return baseKeywords;
    }
  }

  /**
   * Get main entry point for project type
   * @param {string} projectType - Project type
   * @returns {string} Main entry point path
   */
  getMainEntry(projectType: string): string {
    switch (projectType) {
      case 'cli':
        return 'dist/bin/cli.js';
      case 'library':
        return 'dist/index.js';
      default:
        return 'dist/index.js';
    }
  }

  /**
   * Get types entry point for project type
   * @param {string} projectType - Project type
   * @returns {string | undefined} Types entry point path
   */
  getTypesEntry(projectType: string): string | undefined {
    return projectType === 'library' ? 'dist/index.d.ts' : undefined;
  }

  /**
   * Get bin field for CLI projects
   * @param {string} projectName - Project name
   * @param {string} projectType - Project type
   * @returns {Record<string, string> | undefined} Bin field object
   */
  getBinField(projectName: string, projectType: string): Record<string, string> | undefined {
    if (projectType === 'cli') {
      return {
        [projectName]: `./bin/${projectName}`,
      };
    }
    return undefined;
  }
}
