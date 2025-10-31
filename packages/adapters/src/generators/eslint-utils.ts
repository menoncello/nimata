/**
 * ESLint Configuration Utilities
 *
 * Utility functions for ESLint configuration generation
 */

export interface ESLintConfigOptions {
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  targetEnvironment: 'node' | 'browser' | 'both';
  enableTypeScript: boolean;
  enableTesting: boolean;
  customRules?: Record<string, unknown>;
}

/**
 * Get target environment based on project type
 * @param {string} projectType - The project type ('basic', 'web', 'cli', 'library')
 * @returns {string): 'node' | 'browser' | 'both'} Target environment for ESLint configuration
 */
export function getTargetEnvironment(projectType: string): 'node' | 'browser' | 'both' {
  switch (projectType) {
    case 'cli':
      return 'node';
    case 'web':
      return 'browser';
    case 'library':
      return 'both';
    default:
      return 'node';
  }
}

/**
 * Get parser options based on project type
 * @param {string} projectType - The project type ('basic', 'web', 'cli', 'library')
 * @returns {void} Parser options for ESLint configuration
 */
export function getParserOptions(projectType: string): Record<string, unknown> {
  const baseOptions = {
    ecmaVersion: 'latest',
    sourceType: 'module',
  };

  if (projectType === 'web') {
    return {
      ...baseOptions,
      ecmaFeatures: {
        jsx: true,
      },
    };
  }

  return baseOptions;
}

/**
 * Get global variables based on target environment
 * @param {string} targetEnvironment - The target environment ('node', 'browser', 'both')
 * @returns {void} Global variables for ESLint configuration
 */
export function getGlobalVariables(targetEnvironment: string): Record<string, string> {
  const globals: Record<string, string> = {};

  switch (targetEnvironment) {
    case 'node':
      globals['process'] = 'readonly';
      globals['Buffer'] = 'readonly';
      globals['__dirname'] = 'readonly';
      globals['__filename'] = 'readonly';
      globals['global'] = 'readonly';
      break;
    case 'browser':
      globals['window'] = 'readonly';
      globals['document'] = 'readonly';
      globals['navigator'] = 'readonly';
      globals['console'] = 'readonly';
      globals['setTimeout'] = 'readonly';
      globals['setInterval'] = 'readonly';
      break;
    case 'both':
      globals['process'] = 'readonly';
      globals['Buffer'] = 'readonly';
      globals['window'] = 'readonly';
      globals['document'] = 'readonly';
      globals['console'] = 'readonly';
      break;
  }

  return globals;
}

/**
 * Get global variables for testing environment
 * @returns {string[]} Array of testing global variables
 */
export function getTestingGlobals(): string[] {
  return ['describe', 'it', 'test', 'expect', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'];
}

/**
 * Get testing rules based on quality level
 * @param {string} _qualityLevel - The quality level (unused parameter for future extensibility)
 * @returns {void} Testing rules for ESLint configuration
 */
export function getTestingRules(_qualityLevel: string): Record<string, unknown> {
  return {
    // Basic testing rules
    'no-magic-numbers': 'off', // Allow magic numbers in tests
    'max-lines-per-function': 'off', // Allow longer test functions
  };
}
