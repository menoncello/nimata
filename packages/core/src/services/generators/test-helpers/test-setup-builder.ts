/**
 * Test Setup Builder
 *
 * Helper class for generating test setup file content
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Builds test setup file content
 */
export class TestSetupBuilder {
  /**
   * Generate test setup file header with documentation
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Test setup header string
   */
  getTestSetupHeader(config: ProjectConfig): string {
    return `/**
 * Test Setup Configuration for ${config.name}
 *
 * This file provides common setup for all test files
 * Configure global test environment, mocks, and utilities here
 */`;
  }

  /**
   * Generate test setup imports
   * @returns {string} Import statements string
   */
  getTestSetupImports(): string {
    return `import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { config } from 'dotenv';`;
  }

  /**
   * Generate console setup for tests
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Console setup code string
   */
  getConsoleSetup(_config: ProjectConfig): string {
    return `// Configure console output for tests
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
});`;
  }

  /**
   * Generate environment setup code
   * @returns {string} Environment setup string
   */
  getEnvironmentSetup(): string {
    return `// Load environment variables
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
});`;
  }

  /**
   * Generate test utilities object
   * @returns {string} Test utilities object definition
   */
  private generateTestUtilsObject(): string {
    return `export const testUtils = {
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
};`;
  }

  /**
   * Generate global type declarations
   * @returns {string} Global type declarations
   */
  private generateGlobalDeclarations(): string {
    return `// Make utils available globally for convenience
declare global {
  const testUtils: typeof testUtils;
}`;
  }

  /**
   * Generate default export
   * @returns {string} Default export statement
   */
  private generateDefaultExport(): string {
    return `// Export default setup
export default testUtils;`;
  }

  /**
   * Generate test utilities and helpers
   * @returns {string} Test utilities code string
   */
  getTestUtilities(): string {
    const utilsObject = this.generateTestUtilsObject();
    const globalDeclarations = this.generateGlobalDeclarations();
    const defaultExport = this.generateDefaultExport();

    return `// Global test utilities
${utilsObject}

${globalDeclarations}

${defaultExport}`;
  }
}
