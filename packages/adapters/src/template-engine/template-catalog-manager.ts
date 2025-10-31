/**
 * Template Catalog Manager Implementation
 *
 * Central management for template registry, discovery, and caching
 */
import type {
  TemplateCatalogManager as ITemplateCatalogManager,
  TemplateRegistry as ITemplateRegistry,
  TemplateDiscovery as ITemplateDiscovery,
  TemplateCache as ITemplateCache,
  TemplateCatalogConfig,
  TemplateMetadata,
} from '@nimata/core';
import { TemplateCache } from './template-cache.js';
import { TemplateDiscovery } from './template-discovery.js';
import { TemplateRegistry } from './template-registry.js';

/**
 * Catalog statistics interface
 */
interface CatalogStats {
  totalTemplates: number;
  categories: number;
  projectTypes: number;
  tags: number;
  authors: number;
  cacheStats: { size: number; hits: number; misses: number; hitRate: number };
  indexStats: {
    totalTemplates: number;
    categories: number;
    projectTypes: number;
    tags: number;
    authors: number;
    indexSize: number;
  };
}

/**
 * Constants for template catalog manager
 */
const CATALOG_CONSTANTS = {
  DECIMAL_PLACES: 2,
  UNKNOWN_ERROR: 'Unknown error',
  FAILED_PREFIX: 'Failed to',
  INIT_ERROR_PREFIX: 'Failed to initialize template catalog',
  RELOAD_ERROR_PREFIX: 'Failed to reload template catalog',
  SHUTDOWN_ERROR_PREFIX: 'Failed to shutdown template catalog',
  DISCOVERY_ERROR_PREFIX: 'Failed to discover and index templates',
} as const;

/**
 * Template catalog manager implementation
 */
export class TemplateCatalogManager implements ITemplateCatalogManager {
  private config: TemplateCatalogConfig;
  private registry: ITemplateRegistry;
  private discovery: ITemplateDiscovery;
  private cache: ITemplateCache;
  private initialized = false;

  /**
   * Creates a new template catalog manager instance.
   * Initializes the template registry, discovery service, and cache with the provided configuration.
   * @param {unknown} config - Partial configuration for the catalog manager
   */
  constructor(config?: Partial<TemplateCatalogConfig>) {
    this.config = {
      templatesDirectory: 'templates',
      autoDiscovery: true,
      discoveryPatterns: ['**/*.hbs', '**/*.handlebars', '**/*.json', '**/*.yaml', '**/*.yml'],
      validationRules: [],
      cache: {
        enabled: true,
        ttl: 3600,
        maxSize: 1000,
      },
      extensibility: {
        enabled: true,
        autoRegisterNewTypes: true,
        customValidators: [],
      },
      ...config,
    };

    this.cache = new TemplateCache();
    this.registry = new TemplateRegistry(this.config, this.cache);
    this.discovery = new TemplateDiscovery(this.config);
  }

  /**
   * Initialize the catalog.
   * Sets up the template registry, discovery service, and cache. Performs template discovery and indexing if auto-discovery is enabled.
   * @param {unknown} config - Optional configuration to override defaults
   * @returns {void} {void} Promise that resolves when initialization is complete
   */
  async initialize(config?: TemplateCatalogConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Update configuration if provided
      if (config) {
        this.config = { ...this.config, ...config };
      }

      // Ensure templates directory exists
      await this.ensureTemplatesDirectory();

      // Discover and index templates if auto-discovery is enabled
      if (this.config.autoDiscovery) {
        try {
          await this.discoverAndIndexTemplates();
        } catch {
          // Discovery error handled silently during initialization
        }
      }

      this.initialized = true;
      // Template catalog initialized successfully
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.INIT_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Get template registry
   * @returns {void} {ITemplateRegistry} Template registry instance
   */
  getRegistry(): ITemplateRegistry {
    this.ensureInitialized();
    return this.registry;
  }

  /**
   * Get template discovery
   * @returns {void} {ITemplateDiscovery} Template discovery instance
   */
  getDiscovery(): ITemplateDiscovery {
    this.ensureInitialized();
    return this.discovery;
  }

  /**
   * Get template cache
   * @returns {void} {ITemplateCache} Template cache instance
   */
  getCache(): ITemplateCache {
    this.ensureInitialized();
    return this.cache;
  }

  /**
   * Get catalog configuration
   * @returns {void} {TemplateCatalogConfig} Copy of catalog configuration
   */
  getConfig(): TemplateCatalogConfig {
    return { ...this.config };
  }

  /**
   * Reload catalog.
   * Clears the cache and re-discovers all templates. If the catalog is not initialized, it will be initialized first.
   * @returns {void} {void} Promise that resolves when the catalog is reloaded
   */
  async reload(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
      return;
    }

    try {
      // Clear cache
      await this.cache.clear();

      // Re-discover and index templates
      await this.discoverAndIndexTemplates();

      // Template catalog reloaded successfully
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.RELOAD_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Shutdown catalog.
   * Clears the cache and marks the catalog as uninitialized. If the catalog is not initialized, this method does nothing.
   * @returns {void} {void} Promise that resolves when shutdown is complete
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      // Clear cache
      await this.cache.clear();

      this.initialized = false;
      // Template catalog shut down successfully
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.SHUTDOWN_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Add a new template to the catalog.
   * Registers the template metadata in the registry. The catalog must be initialized before adding templates.
   * @param {TemplateMetadata} template - The template metadata to add
   * @returns {void} {void} Promise that resolves when the template is added
   */
  async addTemplate(template: TemplateMetadata): Promise<void> {
    this.ensureInitialized();
    await this.registry.register(template);
  }

  /**
   * Remove a template from the catalog.
   * Unregisters the template from the registry. The catalog must be initialized before removing templates.
   * @param {string} templateId - The ID of the template to remove
   * @returns {void} {void} Promise that resolves when the template is removed
   */
  async removeTemplate(templateId: string): Promise<void> {
    this.ensureInitialized();
    await this.registry.unregister(templateId);
  }

  /**
   * Get discovery statistics.
   * Retrieves statistics from the template discovery service including template counts, categories, and index information.
   * @returns {void} {Promise<} Promise that resolves to discovery statistics object
   */
  private async getDiscoveryStats(): Promise<{
    totalTemplates: number;
    categories: number;
    projectTypes: number;
    tags: number;
    authors: number;
    indexSize: number;
  }> {
    const rawStats = this.getDiscoveryIndexStats();
    return this.normalizeDiscoveryStats(rawStats);
  }

  /**
   * Get raw discovery index stats from the discovery service
   * @returns {void} {} Raw discovery statistics or default values
   */
  private getDiscoveryIndexStats(): {
    totalTemplates: number;
    categories: string[] | number;
    projectTypes: string[] | number;
    tags: string[] | number;
    authors: string[] | number;
    indexSize: number;
  } {
    return (
      (
        this.discovery as {
          getIndexStats?: () => {
            totalTemplates: number;
            categories: string[] | number;
            projectTypes: string[] | number;
            tags: string[] | number;
            authors: string[] | number;
            indexSize: number;
          };
        }
      ).getIndexStats?.() || {
        totalTemplates: 0,
        categories: [],
        projectTypes: [],
        tags: [],
        authors: [],
        indexSize: 0,
      }
    );
  }

  /**
   * Normalize discovery statistics by converting arrays to counts
   * @param {{ totalTemplates: number; categories: string[] | number; projectTypes: string[] | number; tags: string[] | number; authors: string[] | number; indexSize: number }} rawStats - Raw discovery statistics
   * @param {number} rawStats.totalTemplates - Total number of templates
   * @param {string[] | number} rawStats.categories - Categories array or count
   * @param {string[] | number} rawStats.projectTypes - Project types array or count
   * @param {string[] | number} rawStats.tags - Tags array or count
   * @param {string[] | number} rawStats.authors - Authors array or count
   * @param {number} rawStats.indexSize - Index size
   * @returns {{ totalTemplates: number; categories: number; projectTypes: number; tags: number; authors: number; indexSize: number }} Normalized discovery statistics with numeric counts
   */
  private normalizeDiscoveryStats(rawStats: {
    totalTemplates: number;
    categories: string[] | number;
    projectTypes: string[] | number;
    tags: string[] | number;
    authors: string[] | number;
    indexSize: number;
  }): {
    totalTemplates: number;
    categories: number;
    projectTypes: number;
    tags: number;
    authors: number;
    indexSize: number;
  } {
    return {
      totalTemplates: rawStats.totalTemplates,
      categories: this.convertArrayToCount(rawStats.categories),
      projectTypes: this.convertArrayToCount(rawStats.projectTypes),
      tags: this.convertArrayToCount(rawStats.tags),
      authors: this.convertArrayToCount(rawStats.authors),
      indexSize: rawStats.indexSize,
    };
  }

  /**
   * Convert array or number to count
   * @param {string[] | number} value - Array or number to convert
   * @returns {void} {string[] | number): number} Numeric count
   */
  private convertArrayToCount(value: string[] | number): number {
    return Array.isArray(value) ? value.length : Number(value);
  }

  /**
   * Get total templates count.
   * Retrieves the total number of templates currently registered in the template registry.
   * @returns {void} {void} Promise that resolves to the number of templates in registry
   */
  private async getTotalTemplates(): Promise<number> {
    return (await this.registry.getAll()).length;
  }

  /**
   * Get catalog statistics.
   * Retrieves comprehensive statistics about the catalog including template counts, cache performance, and discovery metrics.
   * @returns {void} {void} Promise that resolves to a catalog statistics object
   */
  async getCatalogStats(): Promise<CatalogStats> {
    this.ensureInitialized();

    const [cacheStats, discoveryStats, totalTemplates] = await Promise.all([
      this.cache.getStats(),
      this.getDiscoveryStats(),
      this.getTotalTemplates(),
    ]);

    return this.buildCatalogStats(cacheStats, discoveryStats, totalTemplates);
  }

  /**
   * Build catalog statistics object
   * @param {unknown} cacheStats - Cache statistics
   * @param {unknown} cacheStats.size - Number of items in cache
   * @param {unknown} cacheStats.hits - Number of cache hits
   * @param {unknown} cacheStats.misses - Number of cache misses
   * @param {unknown} cacheStats.hitRate - Cache hit rate percentage
   * @param {unknown} discoveryStats - Discovery statistics
   * @param {unknown} discoveryStats.totalTemplates - Total number of templates discovered
   * @param {unknown} discoveryStats.categories - Number of template categories
   * @param {unknown} discoveryStats.projectTypes - Number of project types
   * @param {unknown} discoveryStats.tags - Number of unique tags
   * @param {unknown} discoveryStats.authors - Number of template authors
   * @param {unknown} discoveryStats.indexSize - Size of the template index
   * @param {unknown} totalTemplates - Total number of templates
   * @returns {void} {void} Complete catalog statistics
   */
  private buildCatalogStats(
    cacheStats: { size: number; hits: number; misses: number; hitRate: number },
    discoveryStats: {
      totalTemplates: number;
      categories: number;
      projectTypes: number;
      tags: number;
      authors: number;
      indexSize: number;
    },
    totalTemplates: number
  ): CatalogStats {
    return {
      totalTemplates,
      categories: discoveryStats.categories,
      projectTypes: discoveryStats.projectTypes,
      tags: discoveryStats.tags,
      authors: discoveryStats.authors,
      cacheStats,
      indexStats: discoveryStats,
    };
  }

  /**
   * Discover and index templates.
   * Scans the file system for templates, registers them in the registry, and builds the search index.
   * @returns {void} {void} Promise that resolves when discovery and indexing is complete
   */
  private async discoverAndIndexTemplates(): Promise<void> {
    try {
      // Discover templates from file system
      const templates = await this.discovery.discover(this.config.templatesDirectory);

      // Register discovered templates
      for (const template of templates) {
        try {
          await this.registry.register(template);
        } catch {
          // Template registration failed, continuing with others
        }
      }

      // Index templates for fast search
      await this.discovery.index(templates);

      // Templates discovered and indexed successfully
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.DISCOVERY_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Ensure templates directory exists.
   * Checks if the templates directory exists and creates it if it doesn't.
   * @returns {void} {fs/promises');} Promise that resolves when the directory is ensured to exist
   */
  private async ensureTemplatesDirectory(): Promise<void> {
    const fs = await import('node:fs/promises');

    // Use default directory if empty, null, or not provided
    const templatesDirectory =
      this.config.templatesDirectory && this.config.templatesDirectory.trim() !== ''
        ? this.config.templatesDirectory
        : 'templates';

    try {
      await fs.access(templatesDirectory);
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(templatesDirectory, { recursive: true });
      // Templates directory created successfully
    }
  }

  /**
   * Ensure catalog is initialized.
   * Throws an error if the catalog has not been initialized.
   * @throws Error if the catalog is not initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Template catalog is not initialized. Call initialize() first.');
    }
  }
}
