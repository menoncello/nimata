/**
 * TypeScript Configuration Generators
 *
 * Handles TypeScript configuration content generation
 */
import type { ProjectConfig, ProjectType } from '../../../types/project-config.js';

// Constants
const JSON_INDENTATION = 2;

/**
 * TypeScript configuration generators
 */
export class TypescriptConfigGenerators {
  /**
   * Generate TypeScript configuration content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} TypeScript configuration content
   */
  static generateTsConfigContent(config: ProjectConfig): string {
    const baseConfig = TypescriptConfigGenerators.createBaseTsConfig();
    const compilerOptions = TypescriptConfigGenerators.createTsCompilerOptions();
    const projectSpecificConfig = TypescriptConfigGenerators.applyProjectSpecificConfig(config);

    return JSON.stringify(
      {
        ...baseConfig,
        compilerOptions: {
          ...compilerOptions,
          ...projectSpecificConfig,
        },
      },
      null,
      JSON_INDENTATION
    );
  }

  /**
   * Create base TypeScript configuration
   * @returns {string} Base TypeScript configuration
   */
  private static createBaseTsConfig(): {
    compilerOptions: Record<string, unknown>;
    include: string[];
    exclude: string[];
  } {
    return {
      compilerOptions: {},
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'build'],
    };
  }

  /**
   * Create TypeScript compiler options
   * @returns {string} TypeScript compiler options
   */
  private static createTsCompilerOptions(): Record<string, unknown> {
    return {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'preserve',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      removeComments: false,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    };
  }

  /**
   * Apply project-specific TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {boolean}ic TypeScript configuration
   */
  private static applyProjectSpecificConfig(config: ProjectConfig): Record<string, unknown> {
    const projectConfig: Record<string, unknown> = {};

    TypescriptConfigGenerators.applyProjectTypeConfig(projectConfig, config.projectType);
    TypescriptConfigGenerators.applyFrameworkConfig(projectConfig, config.framework);
    TypescriptConfigGenerators.applyQualityConfig(projectConfig, config.qualityLevel);

    return projectConfig;
  }

  /**
   * Apply project type specific configuration
   * @param {Record<string, unknown>} projectConfig - Project configuration object
   * @param {ProjectType} projectType - Project type
   */
  private static applyProjectTypeConfig(
    projectConfig: Record<string, unknown>,
    projectType: ProjectType
  ): void {
    switch (projectType) {
      case 'cli':
        projectConfig.moduleResolution = 'node';
        projectConfig.esModuleInterop = true;
        projectConfig.allowSyntheticDefaultImports = true;
        break;
      case 'library':
        projectConfig.declaration = true;
        projectConfig.declarationMap = true;
        projectConfig.outDir = './dist';
        break;
      case 'web':
        projectConfig.jsx = 'react-jsx';
        projectConfig.module = 'ESNext';
        projectConfig.moduleResolution = 'bundler';
        break;
    }
  }

  /**
   * Apply framework specific configuration
   * @param {Record<string, unknown>} projectConfig - Project configuration object
   * @param {string} framework - Framework type
   */
  private static applyFrameworkConfig(
    projectConfig: Record<string, unknown>,
    framework: string
  ): void {
    switch (framework) {
      case 'react':
        projectConfig.jsx = 'react-jsx';
        projectConfig.lib = ['DOM', 'DOM.Iterable', 'ES2022'];
        break;
      case 'vue':
        projectConfig.jsx = 'preserve';
        projectConfig.lib = ['DOM', 'DOM.Iterable', 'ES2022'];
        projectConfig.allowJs = true;
        break;
      case 'express':
        projectConfig.moduleResolution = 'node';
        projectConfig.esModuleInterop = true;
        projectConfig.allowSyntheticDefaultImports = true;
        break;
    }
  }

  /**
   * Apply quality level specific configuration
   * @param {Record<string, unknown>} projectConfig - Project configuration object
   * @param {string} qualityLevel - Quality level
   */
  private static applyQualityConfig(
    projectConfig: Record<string, unknown>,
    qualityLevel: string
  ): void {
    if (qualityLevel === 'strict') {
      Object.assign(projectConfig, {
        strict: true,
        noImplicitAny: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        exactOptionalPropertyTypes: true,
      });
    }
  }

  /**
   * Create tsconfig.json file item for DirectoryItem structure
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Directory item
   */
  static createTsConfigFile(config: ProjectConfig): {
    path: string;
    type: 'file';
    content: string;
  } {
    return {
      path: 'tsconfig.json',
      type: 'file',
      content: TypescriptConfigGenerators.generateTsConfigContent(config),
    };
  }
}
