/**
 * TypeScript Utilities
 *
 * Helper methods and utilities for TypeScript configuration generation
 */

import type { TypeScriptConfigOptions } from './typescript-generator.js';

// Common path mappings
const BASE_PATHS = {
  '@': './src/*',
  '@/utils': './src/utils/*',
  '@/types': './src/types/*',
} as const;

const COMPONENT_PATHS = {
  '@/components': './src/components/*',
} as const;

const COMMAND_PATHS = {
  '@/commands': './src/commands/*',
} as const;

/**
 * Get include patterns for TypeScript configuration
 * @param {TypeScriptConfigOptions} options - TypeScript configuration options
 * @returns {TypeScriptConfigOptions): string[]} Include patterns array
 */
export function getIncludePatterns(options: TypeScriptConfigOptions): string[] {
  const patterns = ['src/**/*.ts'];

  if (options.testing) {
    patterns.push('tests/**/*.ts');
    patterns.push('**/*.test.ts');
    patterns.push('**/*.spec.ts');
  }

  return patterns;
}

/**
 * Get exclude patterns for TypeScript configuration
 * @param {TypeScriptConfigOptions} _options - TypeScript configuration options (unused but kept for interface consistency)
 * @returns {TypeScriptConfigOptions): string[]} Exclude patterns array
 */
export function getExcludePatterns(_options: TypeScriptConfigOptions): string[] {
  return ['node_modules', 'dist', 'build', 'coverage', '**/*.d.ts', '**/*.js', '**/*.mjs'];
}

/**
 * Get ESBuild target based on target environment
 * @param {string} targetEnvironment - Target environment
 * @returns {string): string} ESBuild target string
 */
export function getESBuildTarget(targetEnvironment: string): string {
  switch (targetEnvironment) {
    case 'node':
      return 'node18';
    case 'browser':
      return 'es2020';
    case 'both':
      return 'es2020';
    default:
      return 'es2020';
  }
}

/**
 * Get default path mappings for project type
 * @param {string} projectType - Project type
 * @returns {void} Default path mappings
 */
export function getDefaultPaths(projectType: string): Record<string, string> {
  switch (projectType) {
    case 'web':
      return {
        ...BASE_PATHS,
        ...COMPONENT_PATHS,
      };
    case 'cli':
      return {
        ...BASE_PATHS,
        ...COMMAND_PATHS,
      };
    case 'library':
    case 'basic':
    default:
      return BASE_PATHS;
  }
}

/**
 * Get target environment based on project type
 * @param {string} projectType - Project type
 * @returns {string): 'node' | 'browser' | 'both'} Target environment
 */
export function getTargetEnvironment(projectType: string): 'node' | 'browser' | 'both' {
  switch (projectType) {
    case 'web':
      return 'browser';
    case 'cli':
      return 'node';
    case 'library':
      return 'both';
    case 'basic':
    default:
      return 'both';
  }
}

/**
 * Get build system based on project type
 * @param {string} projectType - Project type
 * @returns {string): 'esbuild' | 'tsc' | 'both'} Build system
 */
export function getBuildSystem(projectType: string): 'esbuild' | 'tsc' | 'both' {
  switch (projectType) {
    case 'web':
      return 'esbuild';
    case 'cli':
      return 'esbuild';
    case 'library':
      return 'both';
    case 'basic':
    default:
      return 'both';
  }
}

/**
 * Get project type display name
 * @param {string} projectType - Project type
 * @returns {string): string} Project type display name
 */
export function getProjectTypeName(projectType: string): string {
  switch (projectType) {
    case 'web':
      return 'Web Application';
    case 'cli':
      return 'CLI Application';
    case 'library':
      return 'Library Package';
    case 'basic':
      return 'Basic TypeScript Project';
    default:
      return 'TypeScript Project';
  }
}

/**
 * Get ESBuild base configuration
 * @param {TypeScriptConfigOptions} options - TypeScript configuration options
 * @returns {TypeScriptConfigOptions): string} ESBuild base configuration string
 */
export function getESBuildBaseConfig(options: TypeScriptConfigOptions): string {
  return `const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: '${getESBuildTarget(options.targetEnvironment)}',
  format: 'esm',
  sourcemap: true,
  outdir: 'dist',
  platform: '${options.targetEnvironment === 'node' ? 'node' : 'browser'}',
  treeShaking: true,
  minify: true
}`;
}

/**
 * Get ESBuild defines
 * @param {TypeScriptConfigOptions} options - TypeScript configuration options
 * @returns {TypeScriptConfigOptions): string} ESBuild defines string
 */
export function getESBuildDefines(options: TypeScriptConfigOptions): string {
  const defines: Record<string, string> = {
    'process.env.NODE_ENV': '"development"',
  };

  if (options.projectType === 'web') {
    defines['process.env.BROWSER'] = '"true"';
  }

  if (options.projectType === 'cli') {
    defines['process.env.NODE'] = '"true"';
  }

  const defineEntries = Object.entries(defines)
    .map(([key, value]) => `  '${key}': ${value}`)
    .join(',\n');

  return `const defines = {
${defineEntries}
};`;
}

/**
 * Get ESBuild plugins
 * @returns {string} ESBuild plugins string
 */
export function getESBuildPlugins(): string {
  return `const plugins = [
  {
    name: 'resolve-imports',
    setup(build) {
      build.onResolve({ filter: NETWORK.TYPESCRIPT_FILE_PATTERN }, (args) => {
        if (args.kind === 'import-statement') {
          return {
            path: args.path,
            external: false
          };
        }
      });
    }
  }
];`;
}

/**
 * Get ESBuild build configuration
 * @returns {string} ESBuild build configuration string
 */
export function getESBuildBuildConfig(): string {
  return `const buildConfig = {
  plugins: plugins,
  define: defines
};`;
}
