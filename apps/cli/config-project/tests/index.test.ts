/**
 * Test suite for config-project
 *
 * This file was auto-generated and should be reviewed and customized
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigProjectCore } from '../src/index.js';

describe('config-project', () => {
  let instance: ConfigProjectCore;
  let testConfig: ConfigProjectConfig;

  beforeEach(() => {
    testConfig = {
      debug: false,
      options: {},
    };
    instance = new ConfigProjectCore(testConfig);
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('constructor', () => {
    it('should create instance with default configuration', () => {
      // Given: No configuration provided
      const config = {};

      // When: Creating instance
      const result = new ConfigProjectCore(config);

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
        options: { custom: 'value' },
      };

      // When: Creating instance
      const result = new ConfigProjectCore(customConfig);

      // Then: Instance should use custom configuration
      expect(result).toBeDefined();
      const resultConfig = result.getConfig();
      expect(resultConfig.debug).toBe(true);
      expect(resultConfig.options).toEqual({ custom: 'value' });
    });
  });

  describe('initialize', () => {
    it('should initialize successfully without debug', async () => {
      // Given: Instance with debug disabled
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // When: Initializing
      await instance.initialize();

      // Then: Should complete without logging
      expect(consoleSpy).not.toHaveBeenCalled();

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should log initialization message when debug enabled', async () => {
      // Given: Instance with debug enabled
      instance = new ConfigProjectCore({ debug: true });
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // When: Initializing
      await instance.initialize();

      // Then: Should log debug message
      expect(consoleSpy).toHaveBeenCalledWith(`config-project initialized with debug mode`);

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle initialization errors gracefully', async () => {
      // Given: Instance that might throw during initialization
      const errorInstance = new ConfigProjectCore({ debug: true });

      // When: Initializing
      const result = await errorInstance.initialize();

      // Then: Should complete without throwing
      expect(result).toBeUndefined();
    });
  });

  describe('getConfig', () => {
    it('should return current configuration', () => {
      // Given: Instance with known configuration
      const expectedConfig = {
        debug: false,
        options: { test: 'value' },
      };
      instance = new ConfigProjectCore(expectedConfig);

      // When: Getting configuration
      const result = instance.getConfig();

      // Then: Should return expected configuration
      expect(result).toEqual(expectedConfig);
    });

    it('should return a copy of configuration (not reference)', () => {
      // Given: Instance with configuration
      instance = new ConfigProjectCore({ debug: true });

      // When: Getting configuration and modifying result
      const config = instance.getConfig();
      config.debug = false;

      // Then: Original configuration should be unchanged
      expect(instance.getConfig().debug).toBe(true);
    });
  });

  describe('updateConfig', () => {
    it('should update partial configuration', () => {
      // Given: Instance with initial configuration
      instance = new ConfigProjectCore({ debug: false });

      // When: Updating configuration
      instance.updateConfig({ debug: true, options: { new: 'value' } });

      // Then: Configuration should be updated
      const result = instance.getConfig();
      expect(result.debug).toBe(true);
      expect(result.options).toEqual({ new: 'value' });
    });

    it('should preserve existing configuration when updating', () => {
      // Given: Instance with initial configuration
      instance = new ConfigProjectCore({
        debug: false,
        options: { existing: 'value' },
      });

      // When: Updating only debug
      instance.updateConfig({ debug: true });

      // Then: Should preserve existing options
      const result = instance.getConfig();
      expect(result.debug).toBe(true);
      expect(result.options).toEqual({ existing: 'value' });
    });

    it('should handle empty configuration update', () => {
      // Given: Instance with initial configuration
      const initialConfig = { debug: false };
      instance = new ConfigProjectCore(initialConfig);

      // When: Updating with empty object
      instance.updateConfig({});

      // Then: Configuration should remain unchanged
      expect(instance.getConfig()).toEqual(initialConfig);
    });
  });

  describe('error handling', () => {
    it('should handle invalid configuration gracefully', () => {
      // Given: Invalid configuration
      const invalidConfig = {
        debug: 'invalid' as any,
        options: null as any,
      };

      // When: Creating instance
      // Then: Should not throw
      expect(() => new ConfigProjectCore(invalidConfig)).not.toThrow();
    });

    it('should handle null/undefined configuration', () => {
      // When: Creating instance with null/undefined
      // Then: Should not throw
      expect(() => new ConfigProjectCore(null as any)).not.toThrow();
      expect(() => new ConfigProjectCore(undefined as any)).not.toThrow();
    });
  });
});
