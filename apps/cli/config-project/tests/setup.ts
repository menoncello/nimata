/**
 * Test Setup Configuration for config-project
 *
 * This file provides common setup for all test files
 * Configure global test environment, mocks, and utilities here
 */

import { config } from 'dotenv';
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Configure console output for tests
const originalConsole = global.console;

beforeAll(() => {
  // Disable console logs in tests unless debug mode is enabled
  if (!process.env.DEBUG) {
    global.console = {
      ...originalConsole,
      log: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  }
});

afterAll(() => {
  // Restore original console
  global.console = originalConsole;
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Load environment variables
beforeAll(() => {
  config({ path: '.env.test' });
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

// Global setup for all tests
beforeAll(() => {
  // Global test setup can go here
  console.log('global setup');
});

// Global test utilities
export const testUtils = {
  /**
   * Create a mock configuration
   * @param {Partial<ProjectConfig>} overrides - Configuration overrides
   * @returns {ProjectConfig} Mock configuration
   */
  createMockConfig: (overrides = {}) => ({
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
  wait: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a mock error
   * @param {string} message - Error message
   * @returns {Error} Mock error
   */
  createError: (message = 'Test error') => new Error(message),
};

// Make utils available globally for convenience
declare global {
  const testUtils: typeof testUtils;
}

// Export default setup
export default testUtils;
