/**
 * TypeScript Configuration Generator
 *
 * Generates TypeScript configuration files
 */
import type { ProjectConfig } from '../../../../../src/types/project-config.js';

/**
 * Constants for configuration formatting
 */
const JSON_INDENTATION = 2;

/**
 * TypeScript configuration generator class
 */
export class TypeScriptConfigGenerator {
  /**
   * Generate TypeScript configuration
   * @param config - Project configuration
   * @returns TypeScript configuration content
   */
  static generateTypeScriptConfig(config: ProjectConfig): string {
    const baseConfig = TypeScriptConfigGenerator.buildBaseTypeScriptConfig();
    TypeScriptConfigGenerator.applyProjectTypeSpecificConfig(baseConfig, config.projectType);
    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Build base TypeScript configuration
   * @returns Base TypeScript configuration
   */
  private static buildBaseTypeScriptConfig(): {
    compilerOptions: Record<string, unknown>;
    include: string[];
    exclude: string[];
  } {
    return {
      compilerOptions: TypeScriptConfigGenerator.buildCompilerOptions(),
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'tests'],
    };
  }

  /**
   * Build compiler options
   * @returns Compiler options object
   */
  private static buildCompilerOptions(): Record<string, unknown> {
    return {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      strict: true,
      noEmit: true,
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      verbatimModuleSyntax: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: false,
      allowUnusedLabels: false,
      allowUnreachableCode: false,
    };
  }

  /**
   * Apply project type specific configuration
   * @param config - Base configuration to modify
   * @param config.compilerOptions - Compiler options to modify
   * @param projectType - Project type
   */
  private static applyProjectTypeSpecificConfig(
    config: { compilerOptions: Record<string, unknown> },
    projectType: string
  ): void {
    if (projectType === 'web') {
      config.compilerOptions.lib = ['ES2022', 'DOM', 'DOM.Iterable'];
      config.compilerOptions.jsx = 'react-jsx';
    } else if (projectType === 'cli') {
      config.compilerOptions.lib = ['ES2022'];
    }
  }
}
