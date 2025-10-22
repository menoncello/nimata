/**
 * Test File Generator
 *
 * Generates test files based on project configuration
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { toPascalCase } from '../../utils/string-utils.js';
import { ExpressTestGenerator } from './tests/express-test-generator.js';
import { ReactTestGenerator } from './tests/react-test-generator.js';
import { VueTestGenerator } from './tests/vue-test-generator.js';

/**
 * Test File Generator
 */
export class TestFileGenerator {
  private readonly reactTestGenerator: ReactTestGenerator;
  private readonly vueTestGenerator: VueTestGenerator;
  private readonly expressTestGenerator: ExpressTestGenerator;

  /**
   * Initialize test generators
   */
  constructor() {
    this.reactTestGenerator = new ReactTestGenerator();
    this.vueTestGenerator = new VueTestGenerator();
    this.expressTestGenerator = new ExpressTestGenerator();
  }

  /**
   * Generate test file content
   * @param config - Project configuration
   * @returns Test file TypeScript code
   */
  generate(config: ProjectConfig): string {
    const className = `${toPascalCase(config.name)}Core`;
    const interfaceName = `${toPascalCase(config.name)}Config`;

    const header = this.getTestFileHeader(config, className);
    const setup = this.getTestSetup(className, interfaceName);
    const constructorTests = this.getConstructorTests(className);
    const initializeTests = this.getInitializeTests(className, config);
    const configTests = this.getConfigTests(className);
    const updateConfigTests = this.getUpdateConfigTests(className);
    const errorTests = this.getErrorHandlingTests(className);
    const typeSpecificTests = this.generateTypeSpecificTests(config);

    return `${header}

${setup}

${constructorTests}

${initializeTests}

${configTests}

${updateConfigTests}

${errorTests}${typeSpecificTests}
});`;
  }

  /**
   * Generate test file header with documentation
   * @param config - Project configuration
   * @param className - Class name for testing
   * @returns Test file header string
   */
  private getTestFileHeader(config: ProjectConfig, className: string): string {
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
   * @param className - Class name being tested
   * @param interfaceName - Interface name for mocking
   * @returns Test setup code string
   */
  private getTestSetup(className: string, interfaceName: string): string {
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
  });`;
  }

  /**
   * Generate constructor tests for the class
   * @param className - Class name being tested
   * @returns Constructor test code string
   */
  private getConstructorTests(className: string): string {
    return `

  describe('constructor', () => {
    it('should create instance with default configuration', () => {
      // Given: No configuration provided
      const config = {};

      // When: Creating instance
      const result = new ${className}(config);

      // Then: Instance should be created with defaults
      expect(result).toBeDefined();
      const resultConfig = result.getConfig();
      expect(resultConfig.debug).toBe(false);
      expect(resultConfig.options).toEqual({});
    });

    it('should create instance with custom configuration', () => {
      // Given: Custom configuration
      const customConfig = {
        debug: true,
        options: { custom: 'value' }
      };

      // When: Creating instance
      const result = new ${className}(customConfig);

      // Then: Instance should use custom configuration
      expect(result).toBeDefined();
      const resultConfig = result.getConfig();
      expect(resultConfig.debug).toBe(true);
      expect(resultConfig.options).toEqual({ custom: 'value' });
    });
  });`;
  }

  /**
   * Generate initialization tests for the class
   * @param className - Class name being tested
   * @param config - Project configuration
   * @returns Initialization test code string
   */
  private getInitializeTests(className: string, config: ProjectConfig): string {
    const noDebugTest = this.getNoDebugInitializeTest();
    const debugTest = this.getDebugInitializeTest(className, config);
    const errorTest = this.getErrorInitializeTest(className);

    return `

  describe('initialize', () => {
    ${noDebugTest}

    ${debugTest}

    ${errorTest}
  });`;
  }

  /**
   * Generate test for initialization without debug mode
   * @returns Test code string for non-debug initialization
   */
  private getNoDebugInitializeTest(): string {
    return `it('should initialize successfully without debug', async () => {
      // Given: Instance with debug disabled
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // When: Initializing
      await instance.initialize();

      // Then: Should complete without logging
      expect(consoleSpy).not.toHaveBeenCalled();

      // Cleanup
      consoleSpy.mockRestore();
    });`;
  }

  /**
   * Generate test for initialization with debug mode enabled
   * @param className - Class name being tested
   * @param config - Project configuration
   * @returns Test code string for debug initialization
   */
  private getDebugInitializeTest(className: string, config: ProjectConfig): string {
    return `it('should log initialization message when debug enabled', async () => {
      // Given: Instance with debug enabled
      instance = new ${className}({ debug: true });
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // When: Initializing
      await instance.initialize();

      // Then: Should log debug message
      expect(consoleSpy).toHaveBeenCalledWith(\`${config.name} initialized with debug mode\`);

      // Cleanup
      consoleSpy.mockRestore();
    });`;
  }

  /**
   * Generate test for error handling during initialization
   * @param className - Class name being tested
   * @returns Test code string for error initialization
   */
  private getErrorInitializeTest(className: string): string {
    return `it('should handle initialization errors gracefully', async () => {
      // Given: Instance that might throw during initialization
      const errorInstance = new ${className}({ debug: true });

      // When: Initializing
      const result = await errorInstance.initialize();

      // Then: Should complete without throwing
      expect(result).toBeUndefined();
    });`;
  }

  /**
   * Generate configuration retrieval tests
   * @param className - Class name being tested
   * @returns Configuration test code string
   */
  private getConfigTests(className: string): string {
    return `

  describe('getConfig', () => {
    it('should return current configuration', () => {
      // Given: Instance with known configuration
      const expectedConfig = {
        debug: false,
        options: { test: 'value' }
      };
      instance = new ${className}(expectedConfig);

      // When: Getting configuration
      const result = instance.getConfig();

      // Then: Should return expected configuration
      expect(result).toEqual(expectedConfig);
    });

    it('should return a copy of configuration (not reference)', () => {
      // Given: Instance with configuration
      instance = new ${className}({ debug: true });

      // When: Getting configuration and modifying result
      const config = instance.getConfig();
      config.debug = false;

      // Then: Original configuration should be unchanged
      expect(instance.getConfig().debug).toBe(true);
    });
  });`;
  }

  /**
   * Generate configuration update tests
   * @param className - Class name being tested
   * @returns Configuration update test code string
   */
  private getUpdateConfigTests(className: string): string {
    const partialUpdateTest = this.getPartialUpdateTest(className);
    const preserveConfigTest = this.getPreserveConfigTest(className);
    const emptyUpdateTest = this.getEmptyUpdateTest(className);

    return `

  describe('updateConfig', () => {
    ${partialUpdateTest}

    ${preserveConfigTest}

    ${emptyUpdateTest}
  });`;
  }

  /**
   * Generate test for partial configuration updates
   * @param className - Class name being tested
   * @returns Partial update test code string
   */
  private getPartialUpdateTest(className: string): string {
    return `it('should update partial configuration', () => {
      // Given: Instance with initial configuration
      instance = new ${className}({ debug: false });

      // When: Updating configuration
      instance.updateConfig({ debug: true, options: { new: 'value' } });

      // Then: Configuration should be updated
      const result = instance.getConfig();
      expect(result.debug).toBe(true);
      expect(result.options).toEqual({ new: 'value' });
    });`;
  }

  /**
   * Generate test for configuration preservation during updates
   * @param className - Class name being tested
   * @returns Configuration preservation test code string
   */
  private getPreserveConfigTest(className: string): string {
    return `it('should preserve existing configuration when updating', () => {
      // Given: Instance with initial configuration
      instance = new ${className}({
        debug: false,
        options: { existing: 'value' }
      });

      // When: Updating only debug
      instance.updateConfig({ debug: true });

      // Then: Should preserve existing options
      const result = instance.getConfig();
      expect(result.debug).toBe(true);
      expect(result.options).toEqual({ existing: 'value' });
    });`;
  }

  /**
   * Generate test for empty configuration updates
   * @param className - Class name being tested
   * @returns Empty update test code string
   */
  private getEmptyUpdateTest(className: string): string {
    return `it('should handle empty configuration update', () => {
      // Given: Instance with initial configuration
      const initialConfig = { debug: false };
      instance = new ${className}(initialConfig);

      // When: Updating with empty object
      instance.updateConfig({});

      // Then: Configuration should remain unchanged
      expect(instance.getConfig()).toEqual(initialConfig);
    });`;
  }

  /**
   * Generate error handling tests for invalid configurations
   * @param className - Class name being tested
   * @returns Error handling test code string
   */
  private getErrorHandlingTests(className: string): string {
    return `

  describe('error handling', () => {
    it('should handle invalid configuration gracefully', () => {
      // Given: Invalid configuration
      const invalidConfig = {
        debug: 'invalid' as any,
        options: null as any
      };

      // When: Creating instance
      // Then: Should not throw
      expect(() => new ${className}(invalidConfig)).not.toThrow();
    });

    it('should handle null/undefined configuration', () => {
      // When: Creating instance with null/undefined
      // Then: Should not throw
      expect(() => new ${className}(null as any)).not.toThrow();
      expect(() => new ${className}(undefined as any)).not.toThrow();
    });
  });`;
  }

  /**
   * Generate type-specific tests
   * @param config - Project configuration
   * @returns Type-specific test code
   */
  private generateTypeSpecificTests(config: ProjectConfig): string {
    switch (config.projectType) {
      case 'bun-react':
        return this.reactTestGenerator.generateReactTests(config);
      case 'bun-vue':
        return this.vueTestGenerator.generateVueTests(config);
      case 'bun-express':
        return this.expressTestGenerator.generateExpressTests(config);
      default:
        return '';
    }
  }
}
