/**
 * TypeScript Compiler Options Management
 *
 * Helper methods for managing TypeScript compiler options
 */

import type { TypeScriptConfigOptions, CompilerOptions } from './typescript-generator.js';

// Common library configurations
const DOM_LIBRARIES = ['DOM', 'DOM.Iterable', 'ES6'];

// Individual DOM library components
const DOM_LIBRARY = 'DOM';
const DOM_ITERABLE_LIBRARY = 'DOM.Iterable';

// DOM library configuration for browser projects
const BROWSER_LIBRARIES = [DOM_LIBRARY, DOM_ITERABLE_LIBRARY, 'ES2020'];

/**
 * Get base compiler options
 * @param options - TypeScript configuration options
 * @returns Base compiler options
 */
export function getBaseCompilerOptions(options: TypeScriptConfigOptions): CompilerOptions {
  return {
    target: getLanguageTarget(options.targetEnvironment),
    module: getModuleType(options.targetEnvironment),
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    noEmit: true,
    isolatedModules: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedIndexedAccess: true,
    resolveJsonModule: true,
  };
}

/**
 * Get web project compiler options
 * @returns Web project compiler options
 */
export function getWebProjectOptions(): CompilerOptions {
  return {
    lib: DOM_LIBRARIES,
    allowJs: true,
    jsx: 'react-jsx',
  };
}

/**
 * Get library project compiler options
 * @returns Library project compiler options
 */
export function getLibraryProjectOptions(): CompilerOptions {
  return {
    lib: ['ES6'],
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    outDir: './dist',
    rootDir: './src',
    baseUrl: './src',
    paths: {
      '@/*': './src/*',
    },
  };
}

/**
 * Get CLI project compiler options
 * @returns CLI project compiler options
 */
export function getCliProjectOptions(): CompilerOptions {
  return {
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    target: 'ES2022',
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
  };
}

/**
 * Get custom path options
 * @param options - TypeScript configuration options
 * @returns Custom path options
 */
export function getCustomPathOptions(options: TypeScriptConfigOptions): CompilerOptions {
  const result: CompilerOptions = {};

  if (options.baseUrl !== undefined) {
    result['baseUrl'] = options.baseUrl;
  }

  if (options.paths !== undefined) {
    result['paths'] = options.paths as unknown as Record<string, string>;
  }

  return result;
}

/**
 * Get project-specific compiler options
 * @param options - TypeScript configuration options
 * @returns Project-specific compiler options
 */
export function getProjectSpecificOptions(options: TypeScriptConfigOptions): CompilerOptions {
  switch (options.projectType) {
    case 'web':
      return getWebProjectOptions();
    case 'library':
      return getLibraryProjectOptions();
    case 'cli':
      return getCliProjectOptions();
    case 'basic':
    default:
      return {};
  }
}

/**
 * Get light quality compiler options
 * @returns Light quality compiler options
 */
export function getLightQualityOptions(): CompilerOptions {
  return {
    strict: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: false,
    noFallthroughCasesInSwitch: false,
    noUncheckedIndexedAccess: false,
    noImplicitAny: false,
  };
}

/**
 * Get medium quality compiler options
 * @returns Medium quality compiler options
 */
export function getMediumQualityOptions(): CompilerOptions {
  return {
    strict: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedIndexedAccess: false,
    noImplicitAny: true,
  };
}

/**
 * Get strict quality compiler options
 * @returns Strict quality compiler options
 */
export function getStrictQualityOptions(): CompilerOptions {
  return {
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedIndexedAccess: true,
    exactOptionalPropertyTypes: true,
    noImplicitOverride: true,
    noImplicitAny: true,
  };
}

/**
 * Get quality-specific compiler options
 * @param qualityLevel - Quality level
 * @returns Quality-specific compiler options
 */
export function getQualitySpecificOptions(qualityLevel: string): CompilerOptions {
  switch (qualityLevel) {
    case 'light':
      return getLightQualityOptions();
    case 'medium':
      return getMediumQualityOptions();
    case 'strict':
      return getStrictQualityOptions();
    default:
      return getMediumQualityOptions();
  }
}

/**
 * Get advanced compiler options
 * @param options - TypeScript configuration options
 * @returns Advanced compiler options
 */
export function getAdvancedOptions(options: TypeScriptConfigOptions): CompilerOptions {
  const advancedOptions: CompilerOptions = {};

  if (options.jsx) {
    advancedOptions['jsx'] = 'react-jsx';
  }

  if (options.decorators) {
    advancedOptions['experimentalDecorators'] = true;
    advancedOptions['emitDecoratorMetadata'] = true;
  }

  return advancedOptions;
}

/**
 * Get complete compiler options
 * @param options - TypeScript configuration options
 * @returns Complete compiler options
 */
export function getCompilerOptions(options: TypeScriptConfigOptions): CompilerOptions {
  const baseOptions = getBaseCompilerOptions(options);
  const projectOptions = getProjectSpecificOptions(options);
  const qualityOptions = getQualitySpecificOptions(options.qualityLevel);
  const pathOptions = getCustomPathOptions(options);
  const advancedOptions = getAdvancedOptions(options);

  return {
    ...baseOptions,
    ...projectOptions,
    ...qualityOptions,
    ...pathOptions,
    ...advancedOptions,
  };
}

/**
 * Get language target based on target environment
 * @param targetEnvironment - Target environment
 * @returns Language target string
 */
function getLanguageTarget(targetEnvironment: string): string {
  switch (targetEnvironment) {
    case 'node':
      return 'ES2022';
    case 'browser':
      return 'ES2020';
    case 'both':
      return 'ES2020';
    default:
      return 'ES2020';
  }
}

/**
 * Get library includes based on target environment
 * @param targetEnvironment - Target environment
 * @returns Library includes array
 */
function _getLibraryIncludes(targetEnvironment: string): string[] {
  switch (targetEnvironment) {
    case 'node':
      return ['ES2022'];
    case 'browser':
      return BROWSER_LIBRARIES;
    case 'both':
      return BROWSER_LIBRARIES;
    default:
      return ['ES2020'];
  }
}

/**
 * Get module type based on target environment
 * @param _targetEnvironment - Target environment (parameter not used but kept for interface consistency)
 * @returns Module type string
 */
function getModuleType(_targetEnvironment: string): string {
  return 'ESNext';
}
