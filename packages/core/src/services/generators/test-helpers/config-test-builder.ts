/**
 * Configuration Test Builder
 *
 * Helper class for generating configuration-related test content
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Builds configuration test content
 */
export class ConfigTestBuilder {
  /**
   * Generate no-debug initialize test
   * @returns {string} No-debug initialize test code
   */
  private generateNoDebugInitializeTest(): string {
    return `
    it('should initialize without debug mode', () => {
      // Given: Configuration without debug
      const noDebugConfig = {
        debug: false,
        options: {}
      };

      // When: Initializing
      const result = instance.initialize(noDebugConfig);

      // Then: Should initialize successfully
      expect(result).toBeDefined();
    });`;
  }

  /**
   * Generate debug initialize test
   * @returns {string} Debug initialize test code
   */
  private generateDebugInitializeTest(): string {
    return `
    it('should initialize with debug mode', () => {
      // Given: Configuration with debug
      const debugConfig = {
        debug: true,
        options: {}
      };

      // When: Initializing
      const result = instance.initialize(debugConfig);

      // Then: Should initialize successfully with debug enabled
      expect(result).toBeDefined();
    });`;
  }

  /**
   * Generate error initialize test
   * @returns {string} Error initialize test code
   */
  private generateErrorInitializeTest(): string {
    return `
    it('should handle initialization errors gracefully', () => {
      // Given: Invalid configuration
      const invalidConfig = null as any;

      // When: Initializing
      // Then: Should not throw
      expect(() => instance.initialize(invalidConfig)).not.toThrow();
    });`;
  }

  /**
   * Generate initialize method tests
   * @param {string} _className - Class name being tested
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Initialize test code string
   */
  getInitializeTests(_className: string, _config: ProjectConfig): string {
    const noDebugTest = this.generateNoDebugInitializeTest();
    const debugTest = this.generateDebugInitializeTest();
    const errorTest = this.generateErrorInitializeTest();

    return `
  describe('initialize', () => {
${noDebugTest}

${debugTest}

${errorTest}
  });`;
  }

  /**
   * Generate configuration tests
   * @param {string} _className - Class name being tested
   * @returns {string} Configuration test code string
   */
  getConfigTests(_className: string): string {
    return `
  describe('configuration', () => {
    it('should return current configuration', () => {
      // When: Getting configuration
      const currentConfig = instance.getConfig();

      // Then: Should return the test configuration
      expect(currentConfig).toBeDefined();
      expect(currentConfig.debug).toBe(false);
    });

    it('should validate configuration structure', () => {
      // Given: Test configuration
      const validConfig = {
        debug: true,
        options: { test: true }
      };

      // When: Setting configuration
      instance.setConfig(validConfig);

      // Then: Should have correct structure
      expect(instance.getConfig()).toEqual(validConfig);
    });
  });`;
  }

  /**
   * Generate update configuration tests
   * @param {string} _className - Class name being tested
   * @returns {string} Update configuration test code string
   */
  getUpdateConfigTests(_className: string): string {
    return `
  describe('updateConfig', () => {
    it('should update configuration partially', () => {
      // Given: Initial configuration and update
      const update = { debug: true };

      // When: Updating configuration
      instance.updateConfig(update);

      // Then: Should update only specified properties
      expect(instance.getConfig().debug).toBe(true);
    });

    it('should preserve existing configuration when updating', () => {
      // Given: Initial configuration
      const initialConfig = instance.getConfig();

      // When: Updating with empty object
      instance.updateConfig({});

      // Then: Should preserve existing configuration
      expect(instance.getConfig()).toEqual(initialConfig);
    });

    it('should handle empty update gracefully', () => {
      // Given: Initial configuration
      const beforeConfig = instance.getConfig();

      // When: Updating with null/undefined
      instance.updateConfig(null as any);
      instance.updateConfig(undefined as any);

      // Then: Should not change configuration
      expect(instance.getConfig()).toEqual(beforeConfig);
    });
  });`;
  }
}
