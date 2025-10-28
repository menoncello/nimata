/**
 * Template Catalog Manager Implementation
 *
 * Central management for template registry, discovery, and caching
 */
import { performance } from 'node:perf_hooks';
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
   * @param config - Partial configuration for the catalog manager
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
   * @param config - Optional configuration to override defaults
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(config?: TemplateCatalogConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    const startTime = performance.now();

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
        } catch (discoveryError) {
          // Log discovery error but continue initialization
          console.warn(
            `Template discovery failed during initialization: ${discoveryError instanceof Error ? discoveryError.message : 'Unknown error'}`
          );
        }
      }

      this.initialized = true;
      const duration = performance.now() - startTime;
      console.log(
        `Template catalog initialized in ${duration.toFixed(CATALOG_CONSTANTS.DECIMAL_PLACES)}ms`
      );
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.INIT_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Get template registry
   * @returns Template registry instance
   */
  getRegistry(): ITemplateRegistry {
    this.ensureInitialized();
    return this.registry;
  }

  /**
   * Get template discovery
   * @returns Template discovery instance
   */
  getDiscovery(): ITemplateDiscovery {
    this.ensureInitialized();
    return this.discovery;
  }

  /**
   * Get template cache
   * @returns Template cache instance
   */
  getCache(): ITemplateCache {
    this.ensureInitialized();
    return this.cache;
  }

  /**
   * Get catalog configuration
   * @returns Copy of catalog configuration
   */
  getConfig(): TemplateCatalogConfig {
    return { ...this.config };
  }

  /**
   * Reload catalog.
   * Clears the cache and re-discovers all templates. If the catalog is not initialized, it will be initialized first.
   * @returns Promise that resolves when the catalog is reloaded
   */
  async reload(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
      return;
    }

    const startTime = performance.now();

    try {
      // Clear cache
      await this.cache.clear();

      // Re-discover and index templates
      await this.discoverAndIndexTemplates();

      const duration = performance.now() - startTime;
      console.log(
        `Template catalog reloaded in ${duration.toFixed(CATALOG_CONSTANTS.DECIMAL_PLACES)}ms`
      );
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.RELOAD_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Shutdown catalog.
   * Clears the cache and marks the catalog as uninitialized. If the catalog is not initialized, this method does nothing.
   * @returns Promise that resolves when shutdown is complete
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      // Clear cache
      await this.cache.clear();

      this.initialized = false;
      console.log('Template catalog shut down successfully');
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.SHUTDOWN_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Add a new template to the catalog.
   * Registers the template metadata in the registry. The catalog must be initialized before adding templates.
   * @param template - The template metadata to add
   * @returns Promise that resolves when the template is added
   */
  async addTemplate(template: TemplateMetadata): Promise<void> {
    this.ensureInitialized();
    await this.registry.register(template);
  }

  /**
   * Remove a template from the catalog.
   * Unregisters the template from the registry. The catalog must be initialized before removing templates.
   * @param templateId - The ID of the template to remove
   * @returns Promise that resolves when the template is removed
   */
  async removeTemplate(templateId: string): Promise<void> {
    this.ensureInitialized();
    await this.registry.unregister(templateId);
  }

  /**
   * Get discovery statistics.
   * Retrieves statistics from the template discovery service including template counts, categories, and index information.
   * @returns Promise that resolves to discovery statistics object
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
   * @returns Raw discovery statistics or default values
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
   * @param rawStats - Raw discovery statistics
   * @param rawStats.totalTemplates - Total number of templates
   * @param rawStats.categories - Categories array or count
   * @param rawStats.projectTypes - Project types array or count
   * @param rawStats.tags - Tags array or count
   * @param rawStats.authors - Authors array or count
   * @param rawStats.indexSize - Index size
   * @returns Normalized discovery statistics with numeric counts
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
   * @param value - Array or number to convert
   * @returns Numeric count
   */
  private convertArrayToCount(value: string[] | number): number {
    return Array.isArray(value) ? value.length : Number(value);
  }

  /**
   * Get total templates count.
   * Retrieves the total number of templates currently registered in the template registry.
   * @returns Promise that resolves to the number of templates in registry
   */
  private async getTotalTemplates(): Promise<number> {
    return (await this.registry.getAll()).length;
  }

  /**
   * Get catalog statistics.
   * Retrieves comprehensive statistics about the catalog including template counts, cache performance, and discovery metrics.
   * @returns Promise that resolves to a catalog statistics object
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
   * @param cacheStats - Cache statistics
   * @param cacheStats.size - Number of items in cache
   * @param cacheStats.hits - Number of cache hits
   * @param cacheStats.misses - Number of cache misses
   * @param cacheStats.hitRate - Cache hit rate percentage
   * @param discoveryStats - Discovery statistics
   * @param discoveryStats.totalTemplates - Total number of templates discovered
   * @param discoveryStats.categories - Number of template categories
   * @param discoveryStats.projectTypes - Number of project types
   * @param discoveryStats.tags - Number of unique tags
   * @param discoveryStats.authors - Number of template authors
   * @param discoveryStats.indexSize - Size of the template index
   * @param totalTemplates - Total number of templates
   * @returns Complete catalog statistics
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
   * @returns Promise that resolves when discovery and indexing is complete
   */
  private async discoverAndIndexTemplates(): Promise<void> {
    const startTime = performance.now();

    try {
      // Discover templates from file system
      const templates = await this.discovery.discover(this.config.templatesDirectory);

      // Register discovered templates
      for (const template of templates) {
        try {
          await this.registry.register(template);
        } catch (error) {
          console.warn(`Failed to register template ${template.id}:`, error);
        }
      }

      // Index templates for fast search
      await this.discovery.index(templates);

      const duration = performance.now() - startTime;
      console.log(
        `Discovered and indexed ${templates.length} templates in ${duration.toFixed(CATALOG_CONSTANTS.DECIMAL_PLACES)}ms`
      );
    } catch (error) {
      throw new Error(
        `${CATALOG_CONSTANTS.DISCOVERY_ERROR_PREFIX}: ${error instanceof Error ? error.message : CATALOG_CONSTANTS.UNKNOWN_ERROR}`
      );
    }
  }

  /**
   * Ensure templates directory exists.
   * Checks if the templates directory exists and creates it if it doesn't.
   * @returns Promise that resolves when the directory is ensured to exist
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
      console.log(`Created templates directory: ${templatesDirectory}`);
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
