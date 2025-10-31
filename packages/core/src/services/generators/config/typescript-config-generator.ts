/**
 * TypeScript Configuration Generator
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { JSON_INDENTATION, TS_TARGETS, TS_MODULES, TS_JSX } from './constants.js';

/**
 * TypeScript configuration generator
 */
export class TypeScriptConfigGenerator {
  /**
   * Build basic TypeScript configuration options
   * @returns {Record<string, unknown>} Basic compiler options
   */
  private static buildBasicOptions(): Record<string, unknown> {
    return {
      target: TS_TARGETS.ES2022,
      module: TS_MODULES.ESNEXT,
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      checkJs: false,
      jsx: TS_JSX.REACT,
    };
  }

  /**
   * Build output configuration options
   * @returns {Record<string, unknown>} Output compiler options
   */
  private static buildOutputOptions(): Record<string, unknown> {
    return {
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: 'dist',
      rootDir: 'src',
      removeComments: false,
      noEmit: true,
    };
  }

  /**
   * Build strict type checking options
   * @returns {Record<string, unknown>} Strict type checking options
   */
  private static buildStrictOptions(): Record<string, unknown> {
    return {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true,
      noImplicitOverride: true,
      exactOptionalPropertyTypes: true,
    };
  }

  /**
   * Build module resolution options
   * @returns {Record<string, unknown>} Module resolution options
   */
  private static buildModuleOptions(): Record<string, unknown> {
    return {
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
      verbatimModuleSyntax: true,
      resolveJsonModule: true,
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
        '@/types/*': ['src/types/*'],
        '@/utils/*': ['src/utils/*'],
        '@/config/*': ['src/config/*'],
        '@/services/*': ['src/services/*'],
      },
    };
  }

  /**
   * Build TypeScript compiler options
   * @returns {Record<string, unknown>} Compiler options object
   */
  private static buildCompilerOptions(): Record<string, unknown> {
    return {
      ...this.buildBasicOptions(),
      ...this.buildOutputOptions(),
      ...this.buildStrictOptions(),
      ...this.buildModuleOptions(),
    };
  }

  /**
   * Generates TypeScript configuration file content
   * @param {ProjectConfig} _config - The project configuration (unused for TypeScript config generation)
   * @returns {string} TypeScript config JSON string
   */
  static generateTypeScriptConfig(_config: ProjectConfig): string {
    const compilerOptions = this.buildCompilerOptions();
    const baseConfig = {
      compilerOptions,
      include: ['src/**/*', 'tests/**/*'],
      exclude: ['node_modules', 'dist', 'build', 'coverage'],
      'ts-node': {
        esm: true,
        experimentalSpecifierResolution: 'node',
      },
    };

    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Generate TypeScript configuration (instance method for backward compatibility)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript config JSON
   */
  generate(config: ProjectConfig): string {
    return TypeScriptConfigGenerator.generateTypeScriptConfig(config);
  }
}
