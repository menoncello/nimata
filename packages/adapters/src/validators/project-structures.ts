/**
 * Project structure definitions and constants
 */

export const PROJECT_PATH_PLACEHOLDER = '${projectPath}';
export const ERROR_OCCURRED = 'error occurred';
export const VALIDATION_FAILED = 'Validation failed';
export const UNKNOWN_ERROR = 'Unknown error';

export const REQUIRED_FIELDS = ['name', 'version', 'description'];
export const ESSENTIAL_DEPS = ['eslint', 'prettier'];
export const BASE_SCRIPTS = ['test', 'lint', 'build'];
export const CONFIG_FILES = [
  'tsconfig.json',
  'tsconfig.base.json',
  'tsconfig.test.json',
  '.eslintrc.json',
];

export const ESLINT_CONFIGS = ['.eslintrc.json', 'eslint.config.mjs', '.eslintrc.js'];
export const TEST_CONFIGS = [
  'vitest.config.ts',
  'vitest.config.js',
  'jest.config.js',
  'jest.config.json',
];
export const TEST_DIRS = ['tests', 'test', '__tests__'];

// Common file paths
const MAIN_INDEX_FILE = 'index.js';

export const CLI_FILES = [MAIN_INDEX_FILE, 'src/cli.ts', 'src/bin.ts'];
export const WEB_SERVER_FILES = ['src/server.ts', 'src/app.ts', MAIN_INDEX_FILE];
export const LIBRARY_MAIN_FILES = [MAIN_INDEX_FILE, 'index.ts'];
