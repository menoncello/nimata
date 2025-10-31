/**
 * Setup File Builders
 *
 * Helper methods for building setup file content
 */

/**
 * Build setup file header
 * @returns {string} Setup file header
 */
export function buildSetupHeader(): string {
  return `/**
 * Vitest Setup File
 * Global test configuration and utilities
 */

// Import testing utilities
import { expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

`;
}

/**
 * Build custom matchers section
 * @returns {string} Custom matchers code
 */
export function buildCustomMatchers(): string {
  return `// Global test utilities
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          \`expected \${received} not to be within range \${floor} - \${ceiling}\`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          \`expected \${received} to be within range \${floor} - \${ceiling}\`,
        pass: false,
      };
    }
  },
});

`;
}

/**
 * Build global hooks section
 * @returns {string} Global hooks code
 */
export function buildGlobalHooks(): string {
  return `// Global setup for all tests
beforeAll(async () => {
  // Global test setup can go here
  console.log('Starting test suite...');
});

afterAll(async () => {
  // Global cleanup can go here
  console.log('Test suite completed.');
});

// Setup for individual tests
beforeEach(() => {
  // Reset any global state before each test
});

afterEach(() => {
  // Cleanup after each test
});`;
}

/**
 * Build web-specific setup content
 * @returns {string} Web setup content
 */
export function buildWebSetupContent(): string {
  return `
// Web-specific setup
import { JSDOM } from 'jsdom';

// Setup DOM environment for browser tests
if (typeof window === 'undefined') {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window as any;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
}
`;
}

/**
 * Build strict quality setup content
 * @returns {string} Strict quality setup content
 */
export function buildStrictSetupContent(): string {
  return `
// Strict quality setup - comprehensive mocking
import { vi } from 'vitest';

// Mock console methods in tests to keep output clean
const originalConsole = { ...console };

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(vi.fn());
  vi.spyOn(console, 'warn').mockImplementation(vi.fn());
  vi.spyOn(console, 'error').mockImplementation(vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});
`;
}
