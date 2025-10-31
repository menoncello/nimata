/**
 * Template Catalog Manager Unit Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateMetadata, TemplateCatalogConfig } from '@nimata/core';
import { TemplateCatalogManager } from '../../src/template-engine/template-catalog-manager.js';

describe('TemplateCatalogManager', () => {
  let catalogManager: TemplateCatalogManager;
  let testConfig: TemplateCatalogConfig;

  // Get the directory path for absolute file paths
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const testTemplatesDir = join(__dirname, '..', '..', 'test-templates');

  beforeEach(() => {
    testConfig = {
      templatesDirectory: testTemplatesDir,
      autoDiscovery: false,
      discoveryPatterns: ['**/*.hbs', '**/*.json'],
      validationRules: [],
      cache: {
        enabled: true,
        ttl: 3600,
        maxSize: 100,
      },
      extensibility: {
        enabled: true,
        autoRegisterNewTypes: true,
        customValidators: [],
      },
    };

    catalogManager = new TemplateCatalogManager(testConfig);
  });

  afterEach(async () => {
    if (catalogManager) {
      await catalogManager.shutdown();
    }
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      const manager = new TemplateCatalogManager();
      expect(manager).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customConfig = {
        templatesDirectory: 'custom-templates',
        autoDiscovery: false,
        discoveryPatterns: ['**/*.hbs'],
        validationRules: [],
        cache: {
          enabled: true,
          ttl: 1800,
          maxSize: 50,
        },
        extensibility: {
          enabled: true,
          autoRegisterNewTypes: false,
          customValidators: [],
        },
      };

      const manager = new TemplateCatalogManager(customConfig);
      expect(manager).toBeDefined();
    });

    it('should initialize catalog successfully', async () => {
      await catalogManager.initialize();
      expect(catalogManager.getRegistry()).toBeDefined();
      expect(catalogManager.getDiscovery()).toBeDefined();
      expect(catalogManager.getCache()).toBeDefined();
    });

    it('should throw error when not initialized', () => {
      expect(() => catalogManager.getRegistry()).toThrow('Template catalog is not initialized');
      expect(() => catalogManager.getDiscovery()).toThrow('Template catalog is not initialized');
      expect(() => catalogManager.getCache()).toThrow('Template catalog is not initialized');
    });

    it('should not initialize twice', async () => {
      await catalogManager.initialize();
      await catalogManager.initialize(); // Should not throw
      expect(catalogManager).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should return current configuration', () => {
      const config = catalogManager.getConfig();
      expect(config).toEqual(testConfig);
    });

    it('should update configuration during initialization', async () => {
      const newConfig = {
        templatesDirectory: 'updated-templates',
        autoDiscovery: true,
      };

      await catalogManager.initialize(newConfig);
      const config = catalogManager.getConfig();
      expect(config.templatesDirectory).toBe(newConfig.templatesDirectory);
      expect(config.autoDiscovery).toBe(newConfig.autoDiscovery);
    });
  });

  describe('Template Management', () => {
    beforeEach(async () => {
      await catalogManager.initialize();
    });

    it('should add template to catalog', async () => {
      const template: TemplateMetadata = {
        id: 'test-template',
        name: 'Test Template',
        description: 'A test template',
        version: '1.0.0',
        author: 'Test Author',
        tags: ['test', 'example'],
        supportedProjectTypes: ['cli'],
        recommendedQualityLevels: ['prototype'],
        category: 'test',
        filePath: join(testTemplatesDir, 'test-template.hbs'),
        size: 100,
        lastModified: new Date(),
        dependencies: [],
        features: [],
        validation: {
          valid: true,
          errors: [],
          warnings: [],
          timestamp: new Date(),
          validator: 'test',
        },
        usageStats: {
          usageCount: 0,
          successRate: 1.0,
          averageRenderTime: 0,
          popularProjectTypes: [],
          popularQualityLevels: [],
        },
        metadata: {},
      };

      await catalogManager.addTemplate(template);

      const registry = catalogManager.getRegistry();
      const retrievedTemplate = await registry.get('test-template');
      expect(retrievedTemplate).toEqual(template);
    });

    it('should remove template from catalog', async () => {
      const template: TemplateMetadata = {
        id: 'test-template-remove',
        name: 'Test Template Remove',
        description: 'A test template to remove',
        version: '1.0.0',
        tags: [],
        supportedProjectTypes: ['cli'],
        recommendedQualityLevels: ['prototype'],
        category: 'test',
        filePath: join(testTemplatesDir, 'test-template-remove.hbs'),
        size: 100,
        lastModified: new Date(),
        dependencies: [],
        features: [],
        validation: {
          valid: true,
          errors: [],
          warnings: [],
          timestamp: new Date(),
          validator: 'test',
        },
        usageStats: {
          usageCount: 0,
          successRate: 1.0,
          averageRenderTime: 0,
          popularProjectTypes: [],
          popularQualityLevels: [],
        },
        metadata: {},
      };

      await catalogManager.addTemplate(template);

      const registry = catalogManager.getRegistry();
      let retrievedTemplate = await registry.get('test-template-remove');
      expect(retrievedTemplate).toBeDefined();

      await catalogManager.removeTemplate('test-template-remove');

      retrievedTemplate = await registry.get('test-template-remove');
      expect(retrievedTemplate).toBeNull();
    });
  });

  describe('Catalog Statistics', () => {
    beforeEach(async () => {
      await catalogManager.initialize();
    });

    it('should return catalog statistics', async () => {
      const stats = await catalogManager.getCatalogStats();

      expect(stats).toHaveProperty('totalTemplates');
      expect(stats).toHaveProperty('categories');
      expect(stats).toHaveProperty('projectTypes');
      expect(stats).toHaveProperty('tags');
      expect(stats).toHaveProperty('authors');
      expect(stats).toHaveProperty('cacheStats');
      expect(stats).toHaveProperty('indexStats');

      expect(typeof stats.totalTemplates).toBe('number');
      expect(typeof stats.categories).toBe('number');
      expect(typeof stats.projectTypes).toBe('number');
      expect(typeof stats.tags).toBe('number');
      expect(typeof stats.authors).toBe('number');

      expect(stats.cacheStats).toHaveProperty('size');
      expect(stats.cacheStats).toHaveProperty('hits');
      expect(stats.cacheStats).toHaveProperty('misses');
      expect(stats.cacheStats).toHaveProperty('hitRate');

      expect(stats.indexStats).toHaveProperty('totalTemplates');
      expect(stats.indexStats).toHaveProperty('categories');
      expect(stats.indexStats).toHaveProperty('projectTypes');
      expect(stats.indexStats).toHaveProperty('tags');
      expect(stats.indexStats).toHaveProperty('authors');
      expect(stats.indexStats).toHaveProperty('indexSize');
    });

    it('should track template count in statistics', async () => {
      const initialStats = await catalogManager.getCatalogStats();
      const initialCount = initialStats.totalTemplates;

      const template: TemplateMetadata = {
        id: 'stats-test-template',
        name: 'Stats Test Template',
        description: 'A template for testing stats',
        version: '1.0.0',
        tags: ['stats', 'test'],
        supportedProjectTypes: ['cli'],
        recommendedQualityLevels: ['prototype'],
        category: 'test',
        filePath: join(testTemplatesDir, 'stats-test-template.hbs'),
        size: 100,
        lastModified: new Date(),
        dependencies: [],
        features: [],
        validation: {
          valid: true,
          errors: [],
          warnings: [],
          timestamp: new Date(),
          validator: 'test',
        },
        usageStats: {
          usageCount: 0,
          successRate: 1.0,
          averageRenderTime: 0,
          popularProjectTypes: [],
          popularQualityLevels: [],
        },
        metadata: {},
      };

      await catalogManager.addTemplate(template);

      const updatedStats = await catalogManager.getCatalogStats();
      expect(updatedStats.totalTemplates).toBe(initialCount + 1);
    });
  });

  describe('Reload and Shutdown', () => {
    beforeEach(async () => {
      await catalogManager.initialize();
    });

    it('should reload catalog successfully', async () => {
      await expect(catalogManager.reload()).resolves.toBeUndefined();

      // Verify components are still accessible after reload
      expect(catalogManager.getRegistry()).toBeDefined();
      expect(catalogManager.getDiscovery()).toBeDefined();
      expect(catalogManager.getCache()).toBeDefined();
    });

    it('should shutdown catalog successfully', async () => {
      await expect(catalogManager.shutdown()).resolves.toBeUndefined();
    });

    it('should shutdown when not initialized', async () => {
      const manager = new TemplateCatalogManager();
      await expect(manager.shutdown()).resolves.toBeUndefined();
    });

    it('should clear cache on shutdown', async () => {
      const cache = catalogManager.getCache();

      // Add something to cache
      await cache.set('test-key', {} as TemplateMetadata);

      const statsBefore = await cache.getStats();
      expect(statsBefore.size).toBe(1);

      await catalogManager.shutdown();

      const statsAfter = await cache.getStats();
      expect(statsAfter.size).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Create invalid config that would cause initialization to fail
      const invalidConfig = {
        templatesDirectory: '', // Empty directory should cause issues
        autoDiscovery: true,
        discoveryPatterns: ['**/*.hbs'],
        validationRules: [],
        cache: {
          enabled: true,
          ttl: 3600,
          maxSize: 100,
        },
        extensibility: {
          enabled: true,
          autoRegisterNewTypes: true,
          customValidators: [],
        },
      };

      const manager = new TemplateCatalogManager(invalidConfig);

      // Should not throw, but handle gracefully
      await expect(manager.initialize()).resolves.toBeUndefined();
    });

    it('should handle reload when not initialized', async () => {
      const manager = new TemplateCatalogManager();
      await expect(manager.reload()).resolves.toBeUndefined();
    });

    it('should handle adding invalid template', async () => {
      await catalogManager.initialize();

      const invalidTemplate = {
        // Missing required fields
        id: '',
        name: '',
        description: '',
        version: '',
        tags: [],
        supportedProjectTypes: [],
        recommendedQualityLevels: [],
        category: '',
        filePath: '',
        size: 0,
        lastModified: new Date(),
        dependencies: [],
        features: [],
        validation: {
          valid: false,
          errors: [{ code: 'INVALID', message: 'Invalid template', severity: 'error' }],
          warnings: [],
          timestamp: new Date(),
          validator: 'test',
        },
        usageStats: {
          usageCount: 0,
          successRate: 1.0,
          averageRenderTime: 0,
          popularProjectTypes: [],
          popularQualityLevels: [],
        },
        metadata: {},
      } as TemplateMetadata;

      await expect(catalogManager.addTemplate(invalidTemplate)).rejects.toThrow();
    });

    it('should handle removing non-existent template', async () => {
      await catalogManager.initialize();

      // Should not throw when removing non-existent template
      await expect(catalogManager.removeTemplate('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('Component Access', () => {
    beforeEach(async () => {
      await catalogManager.initialize();
    });

    it('should provide access to registry', () => {
      const registry = catalogManager.getRegistry();
      expect(registry).toBeDefined();
      expect(typeof registry.get).toBe('function');
      expect(typeof registry.getAll).toBe('function');
      expect(typeof registry.register).toBe('function');
      expect(typeof registry.search).toBe('function');
    });

    it('should provide access to discovery', () => {
      const discovery = catalogManager.getDiscovery();
      expect(discovery).toBeDefined();
      expect(typeof discovery.discover).toBe('function');
      expect(typeof discovery.scan).toBe('function');
      expect(typeof discovery.watch).toBe('function');
      expect(typeof discovery.index).toBe('function');
    });

    it('should provide access to cache', () => {
      const cache = catalogManager.getCache();
      expect(cache).toBeDefined();
      expect(typeof cache.get).toBe('function');
      expect(typeof cache.set).toBe('function');
      expect(typeof cache.delete).toBe('function');
      expect(typeof cache.clear).toBe('function');
      expect(typeof cache.getStats).toBe('function');
    });
  });

  describe('Configuration Validation', () => {
    it('should handle missing configuration gracefully', () => {
      const manager = new TemplateCatalogManager();
      const config = manager.getConfig();

      expect(config).toHaveProperty('templatesDirectory');
      expect(config).toHaveProperty('autoDiscovery');
      expect(config).toHaveProperty('discoveryPatterns');
      expect(config).toHaveProperty('validationRules');
      expect(config).toHaveProperty('cache');
      expect(config).toHaveProperty('extensibility');
    });

    it('should merge configuration properly', () => {
      const partialConfig = {
        templatesDirectory: 'partial-test',
        cache: {
          enabled: false,
          ttl: 7200,
          maxSize: 200,
        },
      };

      const manager = new TemplateCatalogManager(partialConfig);
      const config = manager.getConfig();

      expect(config.templatesDirectory).toBe('partial-test');
      expect(config.cache.enabled).toBe(false);
      expect(config.cache.ttl).toBe(7200);
      expect(config.cache.maxSize).toBe(200);

      // Should retain defaults for other properties
      expect(config.autoDiscovery).toBe(true);
      expect(config.discoveryPatterns).toContain('**/*.hbs');
    });
  });
});
