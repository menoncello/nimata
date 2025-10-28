/**
 * Configuration File Generators
 */

import type {
  ProjectConfig,
  ProjectQualityLevel,
  ProjectType,
} from '../../../types/project-config.js';
import {
  JSON_INDENTATION,
  TS_TARGETS,
  TS_MODULES,
  TS_JSX,
  ESLINT_RULE_VALUES,
} from './constants.js';

/**
 * TypeScript configuration generator
 */
class TypeScriptConfigGenerator {
  /**
   * Build TypeScript compiler options
   * @returns Compiler options object
   */
  private static buildCompilerOptions(): Record<string, unknown> {
    return {
      target: TS_TARGETS.ES2022,
      module: TS_MODULES.ESNEXT,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      checkJs: false,
      jsx: TS_JSX.REACT,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      removeComments: false,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      exactOptionalPropertyTypes: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    };
  }

  /**
   * Generates TypeScript configuration file content
   * @param _config - The project configuration (unused for TypeScript config generation)
   * @returns TypeScript config JSON string
   */
  static generateTypeScriptConfig(_config: ProjectConfig): string {
    const compilerOptions = this.buildCompilerOptions();
    const baseConfig = {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };

    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }
}

/**
 * Prettier configuration generator
 */
class PrettierConfigGenerator {
  /**
   * Build Prettier options
   * @returns Prettier configuration object
   */
  private static buildPrettierOptions(): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: JSON_INDENTATION,
      useTabs: false,
    };
  }

  /**
   * Generate Prettier configuration
   * @returns Prettier config JSON
   */
  static generatePrettierConfig(): string {
    const config = this.buildPrettierOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }
}

/**
 * ESLint configuration generator
 */
class ESLintConfigGenerator {
  /**
   * Build ESLint options
   * @returns ESLint configuration object
   */
  private static buildESLintOptions(): Record<string, unknown> {
    return {
      root: true,
      env: {
        node: true,
        es2022: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        '@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': ESLINT_RULE_VALUES.ERROR,
        '@typescript-eslint/explicit-function-return-type': ESLINT_RULE_VALUES.WARN,
        '@typescript-eslint/no-explicit-any': ESLINT_RULE_VALUES.ERROR,
        '@typescript-eslint/no-non-null-assertion': ESLINT_RULE_VALUES.ERROR,
        'prefer-const': ESLINT_RULE_VALUES.ERROR,
        'no-var': ESLINT_RULE_VALUES.ERROR,
      },
    };
  }

  /**
   * Generate ESLint configuration
   * @returns ESLint config ESM format
   */
  static generateESLintConfig(): string {
    const config = this.buildESLintOptions();
    return `export default ${JSON.stringify(config, null, JSON_INDENTATION)};`;
  }
}

/**
 * Vitest configuration generator
 */
class VitestConfigGenerator {
  /**
   * Generate Vitest configuration
   * @returns Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    }
  }
});`;
  }
}

/**
 * Stryker configuration generator
 */
class StrykerConfigGenerator {
  /**
   * Build Stryker options
   * @returns Stryker configuration object
   */
  private static buildStrykerOptions(): Record<string, unknown> {
    return {
      _comment: 'This config was generated using stryker config init',
      $schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
      testRunner: 'vitest',
      coverageAnalysis: 'perTest',
      reporters: ['progress', 'clear-text', 'html'],
      thresholds: {
        high: 80,
        low: 60,
      },
    };
  }

  /**
   * Generate Stryker configuration
   * @returns Stryker config JSON
   */
  static generateStrykerConfig(): string {
    const config = this.buildStrykerOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }
}

/**
 * Package.json configuration generator
 */
class PackageJsonGenerator {
  /**
   * Build package.json scripts
   * @param config - Project configuration
   * @returns Scripts object
   */
  private static buildPackageScripts(config: ProjectConfig): Record<string, string> {
    const baseScripts = {
      build: 'tsc',
      dev: 'tsc --watch',
      test: 'bun test',
      'test:watch': 'bun test --watch',
      'test:coverage': 'bun test --coverage',
      lint: 'eslint . --ext .ts,.tsx',
      'lint:fix': 'eslint . --ext .ts,.tsx --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      clean: 'rm -rf dist',
    };

    const qualityScripts = this.getQualityScripts(config.qualityLevel);

    return { ...baseScripts, ...qualityScripts };
  }

  /**
   * Get quality level specific scripts
   * @param qualityLevel - Project quality level
   * @returns Quality-specific scripts
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
   * @param config - Project configuration
   * @returns Keywords array
   */
  private static buildPackageKeywords(config: ProjectConfig): string[] {
    const baseKeywords = ['typescript', 'bun'];

    const typeKeywords = this.getTypeKeywords(config.projectType);

    return [...baseKeywords, ...typeKeywords];
  }

  /**
   * Get keywords based on project type
   * @param projectType - Project type
   * @returns Type-specific keywords
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
   * @param config - Project configuration
   * @returns Dependencies object
   */
  private static buildDependencies(config: ProjectConfig): Record<string, string> {
    const dependencies: Record<string, string> = {};

    switch (config.projectType) {
      case 'cli':
        dependencies.commander = '^12.0.0';
        dependencies.chalk = '^5.0.0';
        break;
      case 'bun-react':
      case 'web':
        dependencies.react = '^18.0.0';
        dependencies['react-dom'] = '^18.0.0';
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
   * @param _config - Project configuration
   * @returns Dev dependencies object
   */
  private static buildDevDependencies(_config: ProjectConfig): Record<string, string> {
    return {
      '@types/bun': '^1.3.0',
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      vitest: '^1.0.0',
      eslint: '^9.0.0',
      '@typescript-eslint/eslint-plugin': '^8.0.0',
      '@typescript-eslint/parser': '^8.0.0',
      prettier: '^3.0.0',
      '@vitest/coverage-v8': '^1.0.0',
    };
  }

  /**
   * Generates package.json file content with appropriate dependencies and scripts
   * @param config - The project configuration containing name, description, and project type
   * @returns Package.json content as JSON string
   */
  static generatePackageJson(config: ProjectConfig): string {
    const packageConfig: Record<string, unknown> = {
      name: config.name,
      version: '1.0.0',
      description: config.description || 'A modern TypeScript project',
      main: config.projectType === 'library' ? './dist/index.js' : 'dist/index.js',
      module: config.projectType === 'library' ? './dist/index.esm.js' : undefined,
      types: config.projectType === 'library' ? './dist/index.d.ts' : 'dist/index.d.ts',
      type: 'module',
      scripts: this.buildPackageScripts(config),
      keywords: this.buildPackageKeywords(config),
      author: config.author === undefined ? 'Your Name' : config.author,
      license: config.license || 'MIT',
      dependencies: this.buildDependencies(config),
      devDependencies: this.buildDevDependencies(config),
      engines: {
        node: '>=18.0.0',
        bun: '>=1.3.0',
      },
    };

    // Add bin field for CLI projects
    if (config.projectType === 'cli') {
      packageConfig.bin = {
        [config.name]: `./bin/${config.name}`,
      };
    }

    // Add exports field for library projects
    if (config.projectType === 'library') {
      packageConfig.exports = {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js',
        },
      };
    }

    return JSON.stringify(packageConfig, null, JSON_INDENTATION);
  }
}

/**
 * Documentation generator
 */
class DocumentationGenerator {
  /**
   * Generate API documentation placeholder
   * @param config - Project configuration
   * @returns API documentation markdown
   */
  static generateAPIDocumentation(config: ProjectConfig): string {
    return `# API Documentation

## Overview

${config.description || 'A modern TypeScript project'}

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

## Installation

\`\`\`bash
bun install
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

/**
 * Main configuration generators facade
 */
export class ConfigGenerators {
  /**
   * Generate TypeScript configuration
   * @param config - Project configuration
   * @returns TypeScript config JSON
   */
  static generateTypeScriptConfig(config: ProjectConfig): string {
    return TypeScriptConfigGenerator.generateTypeScriptConfig(config);
  }

  /**
   * Generate Prettier configuration
   * @returns Prettier config JSON
   */
  static generatePrettierConfig(): string {
    return PrettierConfigGenerator.generatePrettierConfig();
  }

  /**
   * Generate ESLint configuration
   * @returns ESLint config ESM format
   */
  static generateESLintConfig(): string {
    return ESLintConfigGenerator.generateESLintConfig();
  }

  /**
   * Generate Vitest configuration
   * @returns Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return VitestConfigGenerator.generateVitestConfig();
  }

  /**
   * Generate Stryker configuration
   * @returns Stryker config JSON
   */
  static generateStrykerConfig(): string {
    return StrykerConfigGenerator.generateStrykerConfig();
  }

  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns Package.json content
   */
  static generatePackageJson(config: ProjectConfig): string {
    return PackageJsonGenerator.generatePackageJson(config);
  }

  /**
   * Generate API documentation placeholder
   * @param config - Project configuration
   * @returns API documentation markdown
   */
  static generateAPIDocumentation(config: ProjectConfig): string {
    return DocumentationGenerator.generateAPIDocumentation(config);
  }
}
