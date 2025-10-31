/**
 * Test Configuration Builders
 *
 * Helper methods for building test configuration sections
 */

/**
 * Test configuration options interface
 */
export interface TestConfigOptions {
  testEnvironment: string;
  uiConfig: string;
  coverageConfig: string;
  testMatch: string;
  reporterConfig: string;
  timeoutConfig: string;
}

/**
 * Build include patterns for test configuration
 * @returns {string} Include patterns array as string
 */
function buildIncludePatterns(): string {
  return `[
    'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
  ]`;
}

/**
 * Build exclude patterns for test configuration
 * @returns {string} Exclude patterns array as string
 */
function buildExcludePatterns(): string {
  return `[
    'node_modules',
    'dist',
    'build',
    'coverage',
    '**/*.d.ts'
  ]`;
}

/**
 * Build coverage configuration section
 * @param {TestConfigOptions} options - Test configuration options
 * @returns {TestConfigOptions): string} Coverage configuration string
 */
function buildCoverageConfig(options: TestConfigOptions): string {
  return `${options.uiConfig}coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'tests/',
      '**/*.config.{js,mjs,ts}',
      '**/*.d.ts',
      'dist/',
      'build/',
      'coverage/'
    ],
    ${options.coverageConfig}
  }`;
}

/**
 * Build test configuration body
 * @param {TestConfigOptions} options - Test configuration options
 * @returns {TestConfigOptions): string} Test configuration body string
 */
export function buildTestConfigBody(options: TestConfigOptions): string {
  const includePatterns = buildIncludePatterns();
  const excludePatterns = buildExcludePatterns();
  const coverageConfig = buildCoverageConfig(options);

  return `{
    globals: true,
    environment: '${options.testEnvironment}',
    setupFiles: ['./tests/setup.ts'],
    include: ${includePatterns},
    exclude: ${excludePatterns},
    ${coverageConfig},
    ${options.testMatch}
    ${options.reporterConfig}
    ${options.timeoutConfig}
  }`;
}

/**
 * Build unit test configuration for workspace
 * @returns {string} Unit test configuration string
 */
export function buildUnitTestConfig(): string {
  return `{
    test: {
      name: 'unit',
      include: ['src/**/*.{test,spec}.ts'],
      environment: 'node',
      globals: true,
      setupFiles: ['./tests/setup.ts']
    }
  }`;
}

/**
 * Build integration test configuration for workspace
 * @param {string} testEnvironment - Test environment to use
 * @returns {string): string} Integration test configuration string
 */
export function buildIntegrationTestConfig(testEnvironment: string): string {
  return `{
    test: {
      name: 'integration',
      include: ['tests/integration/**/*.test.ts'],
      environment: '${testEnvironment}',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      timeout: 10000
    }
  }`;
}

/**
 * Build browser test configuration for workspace
 * @returns {boolean} not applicable
 */
export function buildBrowserTestConfig(): string {
  return `,
  // Browser tests
  {
    test: {
      name: 'browser',
      include: ['tests/browser/**/*.test.ts'],
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      timeout: 5000
    }
  }`;
}
