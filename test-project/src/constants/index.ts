/**
 * Application constants
 */

export const APP_NAME = 'test-project';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'A modern TypeScript library';

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100,
} as const;

export const API_LIMITS = {
  MAX_REQUEST_SIZE: '10mb',
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
} as const;
