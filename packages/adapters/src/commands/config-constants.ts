/**
 * Configuration Constants
 *
 * Constants used in configuration generation
 */

import { COVERAGE_LEVELS, FORMATTING, TEXT_LIMITS } from '../utils/constants.js';

// Re-export coverage thresholds with backward compatibility
export const COVERAGE_THRESHOLDS = {
  LIGHT: COVERAGE_LEVELS.LIGHT_THRESHOLD,
  MEDIUM: COVERAGE_LEVELS.MEDIUM_THRESHOLD,
  STRICT: COVERAGE_LEVELS.STRICT_THRESHOLD,
} as const;

// Re-export formatting constants with backward compatibility
export const FORMATTING_CONSTANTS = {
  INDENT_SIZE: FORMATTING.JSON_INDENT_SIZE,
  MAX_LINE_LENGTH: TEXT_LIMITS.MAX_LINE_LENGTH,
  TAB_SIZE: FORMATTING.TAB_WIDTH,
} as const;

// File path and structure constants
export const FILE_STRUCTURE = {
  SRC_DIR: 'src',
  DIST_DIR: 'dist',
  TESTS_DIR: 'src/tests',
  DOCS_DIR: 'docs',
  GITHUB_DIR: '.github',
} as const;

// TypeScript configuration constants
export const TS_CONFIG = {
  TARGET_VERSION: 'ES2022',
  MODULE_SYSTEM: 'ESNext',
  MODULE_RESOLUTION: 'node',
} as const;

// Node.js version requirements
export const NODE_VERSIONS = {
  MINIMUM_NODE: '>=18.0.0',
  MINIMUM_NPM: '>=8.0.0',
} as const;
