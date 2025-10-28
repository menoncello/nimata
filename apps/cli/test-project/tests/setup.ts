/**
 * Test Setup File
 *
 * Global test configuration and setup for test-project
 */

import { vi } from 'vitest';

// Global test setup
global.console = {
  ...console,
  // Mock console.log in tests unless debug mode is enabled
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Set up test environment
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Global test utilities
export const createMockConfig = (overrides = {}) => ({
  debug: false,
  options: {},
  ...overrides,
});

export const expectNoConsoleCalls = () => {
  expect(console.log).not.toHaveBeenCalled();
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
};
