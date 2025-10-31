/**
 * Generator Constants
 *
 * Common constants used throughout the generators to avoid magic numbers
 */

/**
 * JSON indentation level for pretty-printing
 */
export const JSON_INDENT = 2;

/**
 * Default timeout in milliseconds for operations
 */
export const DEFAULT_TIMEOUT_MS = 20000;

/**
 * Maximum number of retries for failed operations
 */
export const MAX_RETRIES = 3;

/**
 * Common colors used in generators
 */
export const COLORS = {
  RED: 0xFF0000,
  GREEN: 0x00FF00,
  BLUE: 0x0000FF,
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
} as const;

/**
 * Common color channel values
 */
export const COLOR_CHANNELS = {
  MAX_BYTE: 255,
  RED_SHIFT: 0x1000000,
  GREEN_SHIFT: 0x10000,
  BLUE_SHIFT: 0x100,
  HEX_BASE: 16,
} as const;

/**
 * File system constants
 */
export const FILE_SYSTEM = {
  DEFAULT_DIRECTORY_PERMISSIONS: 0o755,
  DEFAULT_FILE_PERMISSIONS: 0o644,
} as const;

/**
 * Port numbers
 */
export const PORTS = {
  DEFAULT_DEV_PORT: 3000,
  DEFAULT_TEST_PORT: 3001,
  DEFAULT_PROD_PORT: 8080,
} as const;

/**
 * Common limits
 */
export const LIMITS = {
  MAX_COMMAND_ARGS: 10,
  MAX_FILE_SIZE_MB: 100,
  MAX_CONCURRENT_OPERATIONS: 5,
} as const;
