/**
 * TypeScript Config Generator
 *
 * Handles the generation of TypeScript configuration files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { JSON_INDENTATION } from '../config/constants.js';

/**
 * Generator for TypeScript configuration files
 */
export class TypeScriptConfigGenerator {
  /**
   * Generate TypeScript configuration (alias for generateTypeScriptConfig)
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript configuration content
   */
  generate(config: ProjectConfig): string {
    return this.generateTypeScriptConfig(config);
  }

  /**
   * Generate TypeScript configuration
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} TypeScript configuration content
   */
  generateTypeScriptConfig(_config: ProjectConfig): string {
    const compilerOptions = this.buildCompilerOptions();
    const baseConfig = this.buildTypeScriptBaseConfig(compilerOptions);

    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Build TypeScript base configuration
   * @param {Record<string, unknown>} compilerOptions - Compiler options object
   * @returns {Record<string, unknown>} Base configuration object
   */
  private buildTypeScriptBaseConfig(
    compilerOptions: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };
  }

  /**
   * Build TypeScript compiler options
   * @returns {Record<string, unknown>} Compiler options object
   */
  private buildCompilerOptions(): Record<string, unknown> {
    const basicOptions = this.getBasicCompilerOptions();
    const strictOptions = this.getStrictTypeCheckingOptions();
    const outputOptions = this.getOutputOptions();
    const moduleOptions = this.getModuleOptions();
    const advancedOptions = this.getAdvancedOptions();

    return {
      ...basicOptions,
      ...strictOptions,
      ...outputOptions,
      ...moduleOptions,
      ...advancedOptions,
    };
  }

  /**
   * Get basic TypeScript compiler options
   * @returns {Record<string, unknown>} Basic compiler options
   */
  private getBasicCompilerOptions(): Record<string, unknown> {
    return {
      target: 'ES2022',
      lib: ['ES2022'],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    };
  }

  /**
   * Get strict type checking options
   * @returns {Record<string, unknown>} Strict type checking options
   */
  private getStrictTypeCheckingOptions(): Record<string, unknown> {
    return {
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      exactOptionalPropertyTypes: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: false,
      noUncheckedIndexedAccess: true,
    };
  }

  /**
   * Get output and source map options
   * @returns {Record<string, unknown>} Output options
   */
  private getOutputOptions(): Record<string, unknown> {
    return {
      outDir: './dist',
      rootDir: './src',
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      removeComments: false,
    };
  }

  /**
   * Get module resolution options
   * @returns {Record<string, unknown>} Module options
   */
  private getModuleOptions(): Record<string, unknown> {
    return {
      module: 'ESNext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    };
  }

  /**
   * Get advanced TypeScript options
   * @returns {Record<string, unknown>} Advanced options
   */
  private getAdvancedOptions(): Record<string, unknown> {
    return {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    };
  }
}
