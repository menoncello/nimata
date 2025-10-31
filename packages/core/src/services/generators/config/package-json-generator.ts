/**
 * Package.json Configuration Generator
 */

import type {
  ProjectConfig,
  ProjectQualityLevel,
  ProjectType,
} from '../../../types/project-config.js';
import { JSON_INDENTATION } from './constants.js';

/**
 * Package.json configuration generator
 */
export class PackageJsonGenerator {
  /**
   * Build package.json scripts
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, string>} Scripts object
   */
  private static buildPackageScripts(config: ProjectConfig): Record<string, string> {
    const baseScripts = {
      build: 'tsc',
      test: 'vitest',
      'test:watch': 'vitest --watch',
      'test:coverage': 'vitest --coverage',
      lint: 'eslint src/**/*.ts',
      'lint:fix': 'eslint src/**/*.ts --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      clean: 'rimraf dist',
      'type-check': 'tsc --noEmit',
      prebuild: 'npm run clean',
    };

    // Add project type-specific scripts
    const projectTypeScripts = this.getProjectTypeScripts(config);

    const qualityScripts = this.getQualityScripts(config.qualityLevel);

    return { ...baseScripts, ...projectTypeScripts, ...qualityScripts };
  }

  /**
   * Get project type-specific scripts
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, string>} Project type-specific scripts
   */
  private static getProjectTypeScripts(config: ProjectConfig): Record<string, string> {
    switch (config.projectType) {
      case 'basic':
        return {
          dev: 'tsx watch src/index.ts',
          'test:ui': 'vitest --ui',
        };
      case 'cli':
        return {
          dev: 'tsx src/index.ts',
          'dev:cli': 'tsx src/index.ts',
          start: 'node dist/index.js',
          prepack: 'npm run build',
        };
      case 'web':
        return {
          dev: 'vite',
          'dev:server': 'vite --port 3000',
          build: 'tsc && vite build',
          preview: 'vite preview',
        };
      default:
        return {
          dev: 'tsc --watch',
        };
    }
  }

  /**
   * Get quality level specific scripts
   * @param {ProjectQualityLevel} qualityLevel - Project quality level
   * @returns {Record<string, string>} Quality-specific scripts
   */
  private static getQualityScripts(qualityLevel: ProjectQualityLevel): Record<string, string> {
    switch (qualityLevel) {
      case 'high':
        return {
          'test:mutation': 'stryker run',
          'test:ci': 'vitest run --coverage && eslint . --ext .ts,.tsx',
          'quality:all': 'bun run lint && bun run test:coverage && bun run test:mutation',
        };
      case 'strict':
        return {
          'test:ci': 'vitest run --coverage && eslint . --ext .ts,.tsx',
          'quality:all': 'bun run lint && bun run test:coverage',
        };
      default:
        return {
          'test:ci': 'vitest run',
        };
    }
  }

  /**
   * Build package.json keywords
   * @param {ProjectConfig} config - Project configuration
   * @returns {string[]} Keywords array
   */
  private static buildPackageKeywords(config: ProjectConfig): string[] {
    const baseKeywords = ['typescript', 'bun'];

    const typeKeywords = this.getTypeKeywords(config.projectType);

    return [...baseKeywords, ...typeKeywords];
  }

  /**
   * Get keywords based on project type
   * @param {ProjectType} projectType - Project type
   * @returns {string[]} Type-specific keywords
   */
  private static getTypeKeywords(projectType: ProjectType): string[] {
    switch (projectType) {
      case 'cli':
        return ['cli', 'command-line'];
      case 'web':
        return ['web', 'frontend'];
      case 'library':
        return ['library', 'package'];
      case 'bun-react':
        return ['react', 'jsx', 'frontend'];
      case 'bun-vue':
        return ['vue', 'frontend'];
      case 'bun-express':
        return ['express', 'backend', 'api'];
      default:
        return [];
    }
  }

  /**
   * Build dependencies based on project type
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, string>} Dependencies object
   */
  private static buildDependencies(config: ProjectConfig): Record<string, string> {
    const dependencies: Record<string, string> = {};

    switch (config.projectType) {
      case 'cli':
        dependencies.commander = '^11.0.0';
        dependencies.chalk = '^5.3.0';
        break;
      case 'bun-react':
      case 'web':
        dependencies.react = '^18.2.0';
        dependencies['react-dom'] = '^18.2.0';
        dependencies['react-router-dom'] = '^6.8.0';
        break;
      case 'bun-express':
        dependencies.express = '^4.18.0';
        break;
      case 'bun-vue':
        dependencies.vue = '^3.3.0';
        break;
    }

    return dependencies;
  }

  /**
   * Build dev dependencies
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, string>} Dev dependencies object
   */
  private static buildDevDependencies(config: ProjectConfig): Record<string, string> {
    const baseDevDependencies = this.getBaseDevDependencies();

    switch (config.projectType) {
      case 'basic':
        return this.getBasicDevDependencies(baseDevDependencies);
      case 'cli':
        return this.getCliDevDependencies(baseDevDependencies);
      case 'web':
        return this.getWebDevDependencies();
      case 'library':
        return this.getLibraryDevDependencies();
      default:
        return this.getDefaultDevDependencies(baseDevDependencies);
    }
  }

  /**
   * Get base development dependencies common to most project types
   * @returns {Record<string, string>} Base dev dependencies
   */
  private static getBaseDevDependencies(): Record<string, string> {
    return {
      typescript: '^5.0.0',
      vitest: '^1.0.0',
    };
  }

  /**
   * Get development dependencies for basic project type
   * @param {Record<string, string>} baseDevDependencies - Base dependencies
   * @returns {Record<string, string>} Basic project dev dependencies
   */
  private static getBasicDevDependencies(
    baseDevDependencies: Record<string, string>
  ): Record<string, string> {
    return {
      ...baseDevDependencies,
      '@types/node': '^20.0.0',
      tsx: '^4.0.0',
      eslint: '^8.40.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      rimraf: '^5.0.0',
      '@vitest/coverage-v8': '^1.0.0',
      '@vitest/ui': '^1.0.0',
    };
  }

  /**
   * Get development dependencies for CLI project type
   * @param {Record<string, string>} baseDevDependencies - Base dependencies
   * @returns {Record<string, string>} CLI project dev dependencies
   */
  private static getCliDevDependencies(
    baseDevDependencies: Record<string, string>
  ): Record<string, string> {
    return {
      ...baseDevDependencies,
      '@types/commander': '^2.12.2',
      '@types/node': '^20.0.0',
    };
  }

  /**
   * Get development dependencies for web project type
   * @returns {Record<string, string>} Web project dev dependencies
   */
  private static getWebDevDependencies(): Record<string, string> {
    return {
      vite: '^5.0.0',
      '@vitejs/plugin-react': '^4.0.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      typescript: '^5.0.0',
      vitest: '^1.0.0',
    };
  }

  /**
   * Get development dependencies for library project type
   * @returns {Record<string, string>} Library project dev dependencies
   */
  private static getLibraryDevDependencies(): Record<string, string> {
    return {
      typescript: '^5.0.0',
      vitest: '^1.0.0',
      '@types/node': '^20.0.0',
      tsx: '^4.0.0',
      eslint: '^8.40.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      rimraf: '^5.0.0',
      '@vitest/coverage-v8': '^1.0.0',
      '@vitest/ui': '^1.0.0',
    };
  }

  /**
   * Get default development dependencies for unknown project types
   * @param {Record<string, string>} baseDevDependencies - Base dependencies
   * @returns {Record<string, string>} Default dev dependencies
   */
  private static getDefaultDevDependencies(
    baseDevDependencies: Record<string, string>
  ): Record<string, string> {
    return {
      ...baseDevDependencies,
      '@types/node': '^20.0.0',
      eslint: '^9.0.0',
      '@typescript-eslint/eslint-plugin': '^8.0.0',
      '@typescript-eslint/parser': '^8.0.0',
      prettier: '^3.0.0',
      '@vitest/coverage-v8': '^1.0.0',
    };
  }

  /**
   * Generates package.json file content with appropriate dependencies and scripts
   * @param {ProjectConfig} config - The project configuration containing name, description, and project type
   * @returns {string} Package.json content as JSON string
   */
  static generatePackageJson(config: ProjectConfig): string {
    const packageConfig = this.buildBasePackageConfig(config);
    this.addProjectSpecificFields(packageConfig, config);

    return JSON.stringify(packageConfig, null, JSON_INDENTATION);
  }

  /**
   * Generate package.json content (instance method for backward compatibility)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Package.json content
   */
  generate(config: ProjectConfig): string {
    return PackageJsonGenerator.generatePackageJson(config);
  }

  /**
   * Build base package configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {Record<string, unknown>} Base package configuration
   */
  private static buildBasePackageConfig(config: ProjectConfig): Record<string, unknown> {
    return {
      name: config.name,
      version: config.version || '1.0.0',
      description: config.description || `${config.name} project`,
      main: config.projectType === 'cli' ? 'dist/index.js' : 'src/index.ts',
      module: config.projectType === 'library' ? './dist/index.esm.js' : undefined,
      types: config.projectType === 'library' ? './dist/index.d.ts' : 'dist/index.d.ts',
      type: 'module',
      scripts: this.buildPackageScripts(config),
      keywords: this.buildPackageKeywords(config),
      author: config.author || '',
      license: config.license || 'MIT',
      dependencies: this.buildDependencies(config),
      devDependencies: this.buildDevDependencies(config),
      engines: {
        node: '>=18.0.0',
        npm: '>=8.0.0',
        bun: '>=1.3.0',
      },
    };
  }

  /**
   * Add project-specific fields to package configuration
   * @param {Record<string, unknown>} packageConfig - Package configuration to modify
   * @param {ProjectConfig} config - Project configuration
   */
  private static addProjectSpecificFields(
    packageConfig: Record<string, unknown>,
    config: ProjectConfig
  ): void {
    if (config.projectType === 'cli') {
      packageConfig.bin = {
        [config.name]: 'dist/index.js',
      };
    }

    if (config.projectType === 'library') {
      packageConfig.exports = {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js',
        },
      };
    }
  }
}
