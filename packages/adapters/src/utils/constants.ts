/**
 * System Constants
 *
 * Centralized constants for exit codes, timeouts, and other magic numbers
 * used throughout the project generation system.
 */

/**
 * Process exit codes
 */
export const EXIT_CODES = {
  /** Successful execution */
  SUCCESS: 0,
  /** General error */
  ERROR: 1,
  /** Invalid arguments */
  INVALID_ARGS: 2,
  /** Command not found */
  COMMAND_NOT_FOUND: 127,
  /** Process terminated by signal */
  TERMINATED: 130,
} as const;

/**
 * Timeout constants (in milliseconds)
 */
export const TIMEOUTS = {
  /** Default operation timeout */
  DEFAULT: 5000,
  /** Short operation timeout */
  SHORT: 1000,
  /** Very short delay (for UI updates) */
  UI_DELAY: 100,
  /** Test timeout for unit tests */
  TEST_TIMEOUT: 5000,
  /** Integration test timeout */
  INTEGRATION_TEST_TIMEOUT: 10000,
  /** File operation timeout */
  FILE_OPERATION: 1000,
  /** Network operation timeout */
  NETWORK_OPERATION: 30000,
} as const;

/**
 * Text length limits
 */
export const TEXT_LIMITS = {
  /** Maximum author name length */
  AUTHOR_NAME_MAX: 100,
  /** Maximum line length for code formatting */
  MAX_LINE_LENGTH: 100,
  /** Maximum description length */
  DESCRIPTION_MAX: 500,
  /** Maximum project name length */
  PROJECT_NAME_MAX: 50,
  /** Maximum file system path length */
  PATH_MAX: 1000,
} as const;

/**
 * Retry constants
 */
export const RETRY = {
  /** Default number of retries */
  DEFAULT_COUNT: 3,
  /** Maximum retry count */
  MAX_COUNT: 10,
  /** Base delay for exponential backoff (ms) */
  BASE_DELAY: 1000,
} as const;

/**
 * Progress tracking constants
 */
export const PROGRESS = {
  /** Total progress percentage */
  TOTAL_PERCENT: 100,
  /** Progress update interval (percentage) */
  UPDATE_INTERVAL: 10,
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  /** Maximum timeout for validation (ms) */
  MAX_TIMEOUT: 300000, // 5 minutes
  /** Maximum retry count warning threshold */
  HIGH_RETRY_WARNING: 10,
} as const;

/**
 * Formatting and Indentation Constants
 */
export const FORMATTING = {
  /** Standard indentation size for JSON/TypeScript configurations */
  JSON_INDENT_SIZE: 2,
  /** Standard tab width for code formatting */
  TAB_WIDTH: 2,
  /** Maximum empty lines between code blocks */
  MAX_EMPTY_LINES: 2,
  /** Switch case indentation offset */
  SWITCH_CASE_OFFSET: 1,
} as const;

/**
 * JSON Serialization Constants
 */
export const JSON_SERIALIZATION = {
  /** Standard indentation for pretty-printed JSON */
  PRETTY_INDENT: 2,
  /** Deep indentation for nested ESLint configs */
  DEEP_INDENT: 6,
} as const;

/**
 * Code Quality and Coverage Constants
 */
export const COVERAGE_LEVELS = {
  /** Light quality level coverage threshold */
  LIGHT_THRESHOLD: 70,
  /** Medium quality level coverage threshold */
  MEDIUM_THRESHOLD: 85,
  /** Strict quality level coverage threshold */
  STRICT_THRESHOLD: 95,
  /** Default coverage percentage for strict quality */
  DEFAULT_STRICT: 80,
} as const;

/**
 * Network and Port Constants
 */
export const NETWORK = {
  /** Default development server port */
  DEFAULT_DEV_PORT: 3000,
  /** Default PostgreSQL port */
  DEFAULT_POSTGRES_PORT: 5432,
  /** Base year for ES target calculations */
  ES_BASE_YEAR: 2015,
  /** ES version calculation multiplier */
  ES_VERSION_MULTIPLIER: 2,
  /** Maximum ES target year for calculations */
  MAX_ES_YEAR_2020: 2020,
  /** Maximum ES target year for modern calculations */
  MAX_ES_YEAR_2022: 2022,
  /** Minimum Node.js version for ES target calculations */
  MIN_NODE_VERSION: 14,
} as const;

/**
 * Progress and Display Constants
 */
export const DISPLAY = {
  /** Standard border length for console output */
  BORDER_LENGTH: 40,
  /** Default step number for instructions */
  DEFAULT_STEP: 1,
} as const;

/**
 * List and Array Constants
 */
export const LISTS = {
  /** Default array index offset for operations */
  INDEX_OFFSET: 1,
  /** Minimum length for project names */
  MIN_NAME_LENGTH: 2,
  /** Maximum length for project names */
  MAX_NAME_LENGTH: 50,
} as const;
