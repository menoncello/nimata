/**
 * Test Structure Generator
 *
 * Generates test directory structure and files based on project configuration
 */
import type { ProjectConfig } from '../../types/project-config.js';
import type { DirectoryItem } from './directory-structure-generator.js';
import { TestFileGenerator } from './test-file-generator.js';

/**
 * Test Structure Generator
 */
export class TestStructureGenerator {
  private readonly testFileGenerator: TestFileGenerator;

  // Coverage threshold constants
  private readonly COVERAGE_THRESHOLDS = {
    STRICT: 90,
    STANDARD: 80,
    LIGHT: 70,
  } as const;

  /**
   * Initialize test structure generator
   */
  constructor() {
    this.testFileGenerator = new TestFileGenerator();
  }

  /**
   * Generate test directory structure and files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Array of directory items representing test structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const items: DirectoryItem[] = [];

    items.push(...this.generateBaseTestDirectories());
    items.push(...this.generateQualitySpecificDirectories(config.qualityLevel));
    items.push(...this.generateProjectSpecificDirectories(config.projectType));
    items.push(...this.generateTestFiles(config));
    items.push(...this.generateFixtureGitkeepFiles());
    items.push(this.generateVitestConfigFile(config));

    return items;
  }

  /**
   * Generate base test directories
   * @returns {DirectoryItem[]} Base test directory items
   */
  private generateBaseTestDirectories(): DirectoryItem[] {
    return [
      { type: 'directory', path: 'tests', mode: 0o755 },
      { type: 'directory', path: 'tests/unit', mode: 0o755 },
      { type: 'directory', path: 'tests/integration', mode: 0o755 },
      { type: 'directory', path: 'tests/e2e', mode: 0o755 },
      { type: 'directory', path: 'tests/fixtures', mode: 0o755 },
      { type: 'directory', path: 'tests/fixtures/data', mode: 0o755 },
      { type: 'directory', path: 'tests/fixtures/mock-responses', mode: 0o755 },
      { type: 'directory', path: 'tests/helpers', mode: 0o755 },
    ];
  }

  /**
   * Generate quality-specific test directories
   * @param {string} qualityLevel - Quality level of the project
   * @returns {DirectoryItem[]} Quality-specific directory items
   */
  private generateQualitySpecificDirectories(qualityLevel: string): DirectoryItem[] {
    const directories: DirectoryItem[] = [];

    // Add performance testing for high quality projects
    if (qualityLevel === 'high' || qualityLevel === 'strict') {
      directories.push({ type: 'directory', path: 'tests/performance', mode: 0o755 });
      directories.push({ type: 'directory', path: 'tests/mutation', mode: 0o755 });
    }

    // Add additional test structure for standard and above
    if (qualityLevel === 'standard' || qualityLevel === 'high' || qualityLevel === 'strict') {
      directories.push({ type: 'directory', path: 'tests/factories', mode: 0o755 });
    }

    return directories;
  }

  /**
   * Generate project-specific test directories
   * @param {string} projectType - Type of project
   * @returns {DirectoryItem[]} Project-specific directory items
   */
  private generateProjectSpecificDirectories(projectType: string): DirectoryItem[] {
    if (projectType === 'web') {
      return [
        { type: 'directory', path: 'tests/unit/components', mode: 0o755 },
        { type: 'directory', path: 'tests/unit/utils', mode: 0o755 },
        { type: 'directory', path: 'tests/unit/services', mode: 0o755 },
        { type: 'directory', path: 'tests/unit/types', mode: 0o755 },
        { type: 'directory', path: 'tests/integration/components', mode: 0o755 },
        { type: 'directory', path: 'tests/integration/api', mode: 0o755 },
      ];
    }
    return [];
  }

  /**
   * Generate test files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Test file items
   */
  private generateTestFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        type: 'file',
        path: 'tests/setup.ts',
        content: this.testFileGenerator.generateTestSetup(config),
      },
      {
        type: 'file',
        path: 'tests/unit/index.test.ts',
        content: this.generateBasicUnitTest(config),
      },
      {
        type: 'file',
        path: 'tests/integration/api.test.ts',
        content: this.generateBasicIntegrationTest(config),
      },
      {
        type: 'file',
        path: 'tests/e2e/basic-workflow.e2e.test.ts',
        content: this.generateBasicE2ETest(config),
      },
    ];
  }

  /**
   * Generate .gitkeep files for fixture directories
   * @returns {DirectoryItem[]} Gitkeep file items
   */
  private generateFixtureGitkeepFiles(): DirectoryItem[] {
    return [
      { type: 'file', path: 'tests/fixtures/.gitkeep', content: '' },
      { type: 'file', path: 'tests/fixtures/data/.gitkeep', content: '' },
      { type: 'file', path: 'tests/fixtures/mock-responses/.gitkeep', content: '' },
      { type: 'file', path: 'tests/performance/.gitkeep', content: '' },
      { type: 'file', path: 'tests/mutation/.gitkeep', content: '' },
      { type: 'file', path: 'tests/factories/.gitkeep', content: '' },
    ];
  }

  /**
   * Generate vitest configuration file
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Vitest config file item
   */
  private generateVitestConfigFile(config: ProjectConfig): DirectoryItem {
    return {
      type: 'file',
      path: 'vitest.config.ts',
      content: this.generateVitestConfig(config),
    };
  }

  /**
   * Generate a basic unit test file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Basic unit test content
   */
  private generateBasicUnitTest(config: ProjectConfig): string {
    return `/**
 * Unit Tests for ${config.name}
 *
 * Basic unit test example
 */
import { describe, it, expect } from 'bun:test';

describe('${config.name}', () => {
  describe('basic functionality', () => {
    it('should pass this example test', () => {
      // Given: A simple test case
      const input = 'test';

      // When: Processing the input
      const result = input.toUpperCase();

      // Then: Should produce expected output
      expect(result).toBe('TEST');
    });

    it('should handle edge cases', () => {
      // Given: Edge case input
      const input = '';

      // When: Processing empty input
      const result = input || 'default';

      // Then: Should handle gracefully
      expect(result).toBe('default');
    });
  });
});`;
  }

  /**
   * Generate a basic integration test file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Basic integration test content
   */
  private generateBasicIntegrationTest(config: ProjectConfig): string {
    return [this.getIntegrationTestHeader(config), this.getIntegrationTestSuite()].join('\n');
  }

  /**
   * Generate integration test header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Integration test header
   */
  private getIntegrationTestHeader(config: ProjectConfig): string {
    return `/**
 * Integration Tests for ${config.name}
 *
 * Integration test example
 */
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('${config.name} Integration', () => {`;
  }

  /**
   * Generate integration test suite
   * @returns {string} Integration test suite
   */
  private getIntegrationTestSuite(): string {
    return `  describe('API integration', () => {
    ${this.getApiSuccessTest()}
    ${this.getApiErrorTest()}
  });
});`;
  }

  /**
   * Generate API success test
   * @returns {string} API success test
   */
  private getApiSuccessTest(): string {
    return `it('should handle API requests correctly', async () => {
      // Given: API endpoint configuration
      const apiUrl = 'https://api.example.com/test';

      // When: Making API request
      // Note: This is a mock example - replace with actual API testing
      const mockResponse = { status: 200, data: { success: true } };

      // Then: Should receive expected response
      expect(mockResponse.status).toBe(200);
      expect(mockResponse.data.success).toBe(true);
    });`;
  }

  /**
   * Generate API error test
   * @returns {string} API error test
   */
  private getApiErrorTest(): string {
    return `it('should handle API errors gracefully', async () => {
      // Given: Error scenario
      const errorScenario = {
        status: 404,
        message: 'Not found'
      };

      // When: Handling API error
      const errorHandler = (error: typeof errorScenario) => {
        return \`Error \${error.status}: \${error.message}\`;
      };

      // Then: Should handle error appropriately
      expect(errorHandler(errorScenario)).toBe('Error 404: Not found');
    });`;
  }

  /**
   * Generate a basic E2E test file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Basic E2E test content
   */
  private generateBasicE2ETest(config: ProjectConfig): string {
    return `${this.generateE2ETestHeader(config)}${this.generateE2ETestWorkflows()}`;
  }

  /**
   * Generate E2E test header
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} E2E test header
   */
  private generateE2ETestHeader(config: ProjectConfig): string {
    return `/**
 * E2E Tests for ${config.name}
 *
 * End-to-end test example
 */
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('${config.name} E2E', () => {`;
  }

  /**
   * Generate E2E test workflows
   * @returns {string} E2E test workflows
   */
  private generateE2ETestWorkflows(): string {
    return `  describe('user workflows', () => {
    ${this.generateBasicWorkflowTest()}
    ${this.generateAuthenticationTest()}
  });
});`;
  }

  /**
   * Generate basic workflow test
   * @returns {string} Basic workflow test
   */
  private generateBasicWorkflowTest(): string {
    return `it('should complete basic user workflow', async () => {
      // Given: User starting point
      const user = {
        name: 'Test User',
        email: 'test@example.com'
      };

      // When: Simulating user workflow
      // Note: This is a mock example - replace with actual E2E testing
      const workflow = {
        step1: 'Navigate to application',
        step2: 'Perform action',
        step3: 'Verify result'
      };

      // Then: Workflow should complete successfully
      expect(user.name).toBe('Test User');
      expect(workflow.step1).toBeDefined();
      expect(workflow.step2).toBeDefined();
      expect(workflow.step3).toBeDefined();
    });`;
  }

  /**
   * Generate authentication test
   * @returns {string} Authentication test
   */
  private generateAuthenticationTest(): string {
    return `it('should handle user authentication flow', async () => {
      // Given: Authentication credentials
      const credentials = {
        username: 'testuser',
        password: 'testpass'
      };

      // When: Simulating authentication
      const authResult = {
        success: true,
        token: 'mock-jwt-token',
        user: { id: 1, name: 'Test User' }
      };

      // Then: Authentication should succeed
      expect(authResult.success).toBe(true);
      expect(authResult.token).toBeDefined();
      expect(authResult.user.name).toBe('Test User');
    });`;
  }

  /**
   * Generate Vitest configuration based on quality level
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Vitest configuration content
   */
  private generateVitestConfig(config: ProjectConfig): string {
    const coverageThreshold = this.getCoverageThreshold(config.qualityLevel);

    return `${this.getVitestConfigImports()}${this.getVitestConfigTestSection(coverageThreshold)}${this.getVitestConfigResolveSection()}`;
  }

  /**
   * Get Vitest config imports
   * @returns {string} Import statements
   */
  private getVitestConfigImports(): string {
    return `import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

`;
  }

  /**
   * Get Vitest config test section
   * @param {number} coverageThreshold - Coverage threshold value
   * @returns {string} Test configuration section
   */
  private getVitestConfigTestSection(coverageThreshold: number): string {
    return `export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: ${coverageThreshold},
          functions: ${coverageThreshold},
          lines: ${coverageThreshold},
          statements: ${coverageThreshold}
        }
      },
      include: ['src/**/*'],
      exclude: ${this.getVitestConfigExcludePatterns()}
    }
  },
`;
  }

  /**
   * Get Vitest config exclude patterns
   * @returns {string} Exclude patterns array
   */
  private getVitestConfigExcludePatterns(): string {
    return `[
        '**/node_modules/**',
        '**/tests/**',
        '**/*.d.ts',
        '**/*.config.*'
      ]`;
  }

  /**
   * Get Vitest config resolve section
   * @returns {string} Resolve configuration section
   */
  private getVitestConfigResolveSection(): string {
    return `  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});`;
  }

  /**
   * Get coverage threshold based on quality level
   * @param {string} qualityLevel - Project quality level
   * @returns {number} Coverage threshold percentage
   */
  private getCoverageThreshold(qualityLevel: string): number {
    switch (qualityLevel) {
      case 'strict':
        return this.COVERAGE_THRESHOLDS.STRICT;
      case 'standard':
        return this.COVERAGE_THRESHOLDS.STANDARD;
      case 'light':
        return this.COVERAGE_THRESHOLDS.LIGHT;
      default:
        return this.COVERAGE_THRESHOLDS.STANDARD;
    }
  }
}
