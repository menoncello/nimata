/**
 * Constants for content generators
 */

/** JSON indentation spacing */
export const JSON_INDENTATION = 2;

/** Maximum recommended file length */
export const MAX_FILE_LENGTH = 300;

/** Maximum recommended function length */
export const MAX_FUNCTION_LENGTH = 30;

/** Coverage thresholds */
export const COVERAGE_THRESHOLDS = {
  HIGH: 80,
  LOW: 60,
} as const;

/** Node versions for CI matrix */
export const NODE_VERSIONS = ['18.x', '20.x'] as const;

/** Common file patterns */
export const FILE_PATTERNS = {
  SOURCE: 'src/**/*',
  TESTS: 'src/**/*.test.ts',
  SPECS: 'src/**/*.spec.ts',
} as const;

/** Common directory names */
export const DIRECTORIES = {
  SOURCE: 'src',
  TESTS: 'tests',
  DOCS: 'docs',
  DIST: 'dist',
  BUILD: 'build',
  COVERAGE: 'coverage',
  CACHE: '.cache',
  TEMP: 'temp',
  LOGS: 'logs',
} as const;

/** License types */
export const LICENSE_TYPES = {
  MIT: 'MIT',
  APACHE: 'Apache-2.0',
  GPL: 'GPL-3.0',
} as const;

/** TypeScript configuration targets */
export const TS_TARGETS = {
  ES2022: 'ES2022',
} as const;

/** TypeScript module systems */
export const TS_MODULES = {
  ESNEXT: 'ESNext',
} as const;

/** TypeScript JSX configurations */
export const TS_JSX = {
  REACT: 'react-jsx',
} as const;

/** ESLint rule values */
export const ESLINT_RULE_VALUES = {
  ERROR: 'error',
  WARN: 'warn',
} as const;
