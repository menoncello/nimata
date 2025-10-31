/**
 * Test Setup Configuration for config-project
 *
 * This file provides common setup for all test files
 * Configure global test environment, mocks, and utilities here
 */

import { beforeAll, afterAll } from 'bun:test';

// Configure console output for tests
const originalConsole = global.console;

beforeAll(() => {
  // Disable console logs in tests unless debug mode is enabled
  if (!process.env.DEBUG) {
    global.console = {
      ...originalConsole,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      log: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      debug: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      info: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      warn: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      error: () => {},
    };
  }
});

afterAll(() => {
  // Restore original console
  global.console = originalConsole;
});

// Note: dotenv is not available in this project
// Environment variables should be set via .env file or process.env

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

// Global test utilities
export const testUtils = {
  /**
   * Create a mock configuration
   * @param {Partial<ProjectConfig>} overrides - Configuration overrides
   * @returns {ProjectConfig} Mock configuration
   */
  createMockConfig: (overrides = {}): Record<string, unknown> => ({
    name: 'test-project',
    version: '1.0.0',
    description: 'Test project',
    debug: false,
    ...overrides,
  }),

  /**
   * Wait for async operations
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise<void>} Promise that resolves after delay
   */
  wait: (ms = 0): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Create a mock error
   * @param {string} message - Error message
   * @returns {Error} Mock error
   */
  createError: (message = 'Test error'): Error => new Error(message),
};

// Make utils available globally for convenience
declare global {
  const testUtils: typeof testUtils;
}

// Export default setup
export default testUtils;
