/**
 * CLI Constants
 *
 * Exit codes following Unix conventions:
 * 0 = Success
 * 1 = Validation errors
 * 3 = Configuration errors
 * 130 = Interrupted (Ctrl+C)
 */
export const EXIT_CODES = {
  SUCCESS: 0,
  VALIDATION_ERROR: 1,
  CONFIG_ERROR: 3,
  INTERRUPTED: 130,
} as const;
