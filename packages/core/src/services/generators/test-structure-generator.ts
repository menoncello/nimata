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

  /**
   * Initialize test structure generator
   */
  constructor() {
    this.testFileGenerator = new TestFileGenerator();
  }

  /**
   * Generate test directory structure and files
   * @param config - Project configuration
   * @returns Array of directory items representing test structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const items: DirectoryItem[] = [];

    // Create base test directories
    items.push(
      { type: 'directory', path: 'tests' },
      { type: 'directory', path: 'tests/unit' },
      { type: 'directory', path: 'tests/integration' },
      { type: 'directory', path: 'tests/e2e' },
      { type: 'directory', path: 'tests/fixtures' },
      { type: 'directory', path: 'tests/fixtures/data' },
      { type: 'directory', path: 'tests/fixtures/mock-responses' },
      { type: 'directory', path: 'tests/helpers' }
    );

    // Add project-specific test directories for web projects
    if (config.projectType === 'web') {
      items.push(
        { type: 'directory', path: 'tests/unit/components' },
        { type: 'directory', path: 'tests/unit/utils' },
        { type: 'directory', path: 'tests/unit/services' },
        { type: 'directory', path: 'tests/unit/types' },
        { type: 'directory', path: 'tests/integration/components' },
        { type: 'directory', path: 'tests/integration/api' }
      );
    }

    // Create test files
    items.push(
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
      }
    );

    // Add .gitkeep files to fixture directories
    items.push(
      { type: 'file', path: 'tests/fixtures/.gitkeep', content: '' },
      { type: 'file', path: 'tests/fixtures/data/.gitkeep', content: '' },
      { type: 'file', path: 'tests/fixtures/mock-responses/.gitkeep', content: '' }
    );

    // Add vitest configuration
    items.push({
      type: 'file',
      path: 'vitest.config.ts',
      content: this.generateVitestConfig(config),
    });

    return items;
  }

  /**
   * Generate a basic unit test file
   * @param config - Project configuration
   * @returns Basic unit test content
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
   * @param config - Project configuration
   * @returns Basic integration test content
   */
  private generateBasicIntegrationTest(config: ProjectConfig): string {
    return `/**
 * Integration Tests for ${config.name}
 *
 * Integration test example
 */
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('${config.name} Integration', () => {
  describe('API integration', () => {
    it('should handle API requests correctly', async () => {
      // Given: API endpoint configuration
      const apiUrl = 'https://api.example.com/test';

      // When: Making API request
      // Note: This is a mock example - replace with actual API testing
      const mockResponse = { status: 200, data: { success: true } };

      // Then: Should receive expected response
      expect(mockResponse.status).toBe(200);
      expect(mockResponse.data.success).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
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
    });
  });
});`;
  }

  /**
   * Generate a basic E2E test file
   * @param config - Project configuration
   * @returns Basic E2E test content
   */
  private generateBasicE2ETest(config: ProjectConfig): string {
    return `/**
 * E2E Tests for ${config.name}
 *
 * End-to-end test example
 */
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('${config.name} E2E', () => {
  describe('user workflows', () => {
    it('should complete basic user workflow', async () => {
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
    });

    it('should handle user authentication flow', async () => {
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
    });
  });
});`;
  }

  /**
   * Generate Vitest configuration based on quality level
   * @param config - Project configuration
   * @returns Vitest configuration content
   */
  private generateVitestConfig(config: ProjectConfig): string {
    const coverageThreshold = this.getCoverageThreshold(config.qualityLevel);

    return `import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
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
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});`;
  }

  /**
   * Get coverage threshold based on quality level
   * @param qualityLevel - Project quality level
   * @returns Coverage threshold percentage
   */
  private getCoverageThreshold(qualityLevel: string): number {
    switch (qualityLevel) {
      case 'strict':
        return 90;
      case 'standard':
        return 80;
      case 'light':
        return 70;
      default:
        return 80;
    }
  }
}
