/**
 * Unit Test Builder
 *
 * Helper class for generating unit test file content
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Builds unit test file content
 */
export class UnitTestBuilder {
  /**
   * Generate test file header with documentation
   * @param {ProjectConfig} config - Project configuration
   * @param {string} className - Class name for testing
   * @returns {string} Test file header string
   */
  getTestFileHeader(config: ProjectConfig, className: string): string {
    return `/**
 * Test suite for ${config.name}
 *
 * This file was auto-generated and should be reviewed and customized
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ${className} } from '../src/index.js';

describe('${config.name}', () => {`;
  }

  /**
   * Generate test setup code with instance creation
   * @param {string} className - Class name being tested
   * @param {string} interfaceName - Interface name for mocking
   * @returns {string} Test setup code string
   */
  getTestSetup(className: string, interfaceName: string): string {
    return `  let instance: ${className};
  let testConfig: ${interfaceName};

  beforeEach(() => {
    testConfig = {
      debug: false,
      options: {}
    };
    instance = new ${className}(testConfig);
  });

  afterEach(() => {
    // Cleanup if needed
    instance = null as any;
    testConfig = null as any;
  });`;
  }

  /**
   * Generate constructor tests
   * @param {string} className - Class name being tested
   * @returns {string} Constructor test code string
   */
  getConstructorTests(className: string): string {
    return `
  describe('constructor', () => {
    it('should create instance with default configuration', () => {
      // Given: Default configuration
      const defaultConfig = {
        debug: false,
        options: {}
      };

      // When: Creating instance
      const testInstance = new ${className}(defaultConfig);

      // Then: Should create instance successfully
      expect(testInstance).toBeDefined();
      expect(testInstance).toBeInstanceOf(${className});
    });

    it('should create instance with debug enabled', () => {
      // Given: Debug configuration
      const debugConfig = {
        debug: true,
        options: {}
      };

      // When: Creating instance
      const testInstance = new ${className}(debugConfig);

      // Then: Should create instance successfully
      expect(testInstance).toBeDefined();
      expect(testInstance).toBeInstanceOf(${className});
    });
  });`;
  }
}
