/**
 * Template Registry Implementation
 *
 * Core template registry for managing template metadata, discovery, and catalog operations
 */
import type {
  TemplateMetadata,
  TemplateRegistry as ITemplateRegistry,
  TemplateSearchFilter,
  TemplateSearchResult,
  TemplateUsageStats,
  ProjectType,
  ProjectQualityLevel,
  TemplateValidationResult,
  TemplateCatalogConfig,
  TemplateCache as ITemplateCache,
} from '@nimata/core';
import { TemplateFacetCalculator } from './template-facet-calculator';
import { TemplateMetadataValidator } from './template-metadata-validator';
import { TemplateSearchEngine } from './template-search-engine';

/**
 * Template registry implementation
 */
export class TemplateRegistry implements ITemplateRegistry {
  private templates = new Map<string, TemplateMetadata>();
  private cache: ITemplateCache;
  private config: TemplateCatalogConfig;

  /**
   * Creates a new template registry instance
   * @param {TemplateCatalogConfig} config - Template catalog configuration
   * @param {ITemplateCache} cache - Template cache instance
   */
  constructor(config: TemplateCatalogConfig, cache: ITemplateCache) {
    this.config = config;
    this.cache = cache;
  }

  /**
   * Register a new template
   * @param {TemplateMetadata} template The template to register
   */
  async register(template: TemplateMetadata): Promise<void> {
    // Validate template before registration
    const validation = await TemplateMetadataValidator.validateTemplate(template);
    if (!validation.valid) {
      throw new Error(
        `Template validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
      );
    }

    // Store template
    this.templates.set(template.id, template);

    // Cache template
    if (this.config.cache.enabled) {
      await this.cache.set(template.id, template, this.config.cache.ttl);
    }
  }

  /**
   * Get template by ID
   * @param {string} templateId The template ID to retrieve
   * @returns {void} The template metadata or null if not found
   */
  async unregister(templateId: string): Promise<void> {
    this.templates.delete(templateId);
    await this.cache.delete(templateId);
  }

  /**
   * Get template by ID
   * @param {string} templateId - The template ID to retrieve
   * @returns {void} Template metadata or null if not found
   */
  async get(templateId: string): Promise<TemplateMetadata | null> {
    // Try cache first
    if (this.config.cache.enabled) {
      const cached = await this.cache.get(templateId);
      if (cached) {
        return cached;
      }
    }

    // Fall back to registry
    return this.templates.get(templateId) || null;
  }

  /**
   * Get all registered templates
   * @returns {void} Array of all template metadata
   */
  async getAll(): Promise<TemplateMetadata[]> {
    return Array.from(this.templates.values());
  }

  /**
   * Search templates using filter criteria
   * @param {TemplateSearchFilter} filter - Search filter criteria
   * @returns {void} Search results with matching templates
   */
  async search(filter: TemplateSearchFilter): Promise<TemplateSearchResult> {
    const allTemplates = Array.from(this.templates.values());

    // Use the search engine for filtering and scoring
    let searchResult = TemplateSearchEngine.search(allTemplates, filter);

    // Apply additional registry-specific filtering
    searchResult = this.applyRegistryFilters(searchResult, filter);

    // Calculate facets
    const facets = TemplateFacetCalculator.calculateFacets(searchResult.templates);

    return {
      ...searchResult,
      filters: filter,
      facets,
    };
  }

  /**
   * Apply registry-specific filters to search results
   * @param {unknown} searchResult - Initial search result from search engine
   * @param {unknown} filter - Original search filter
   * @returns {TemplateSearchResult} Filtered search result
   */
  private applyRegistryFilters(
    searchResult: TemplateSearchResult,
    filter: TemplateSearchFilter
  ): TemplateSearchResult {
    let filteredTemplates = searchResult.templates;

    // Apply categories filter (not handled by search engine)
    if (filter.categories && filter.categories.length > 0) {
      filteredTemplates = filteredTemplates.filter((template) =>
        filter.categories.includes(template.category)
      );
    }

    // Apply features filter
    if (filter.features && filter.features.length > 0) {
      filteredTemplates = filteredTemplates.filter((template) =>
        filter.features.every((feature) => template.features.some((f) => f.id === feature))
      );
    }

    // Apply authors filter
    if (filter.authors && filter.authors.length > 0) {
      filteredTemplates = filteredTemplates.filter((template) =>
        filter.authors.some((author) =>
          template.author?.toLowerCase().includes(author.toLowerCase())
        )
      );
    }

    return {
      ...searchResult,
      templates: filteredTemplates,
      totalCount: filteredTemplates.length,
    };
  }

  /**
   * Get templates by project type
   * @param {ProjectType} projectType - The project type to filter by
   * @returns {void} Array of templates supporting the project type
   */
  async getByProjectType(projectType: ProjectType): Promise<TemplateMetadata[]> {
    return Array.from(this.templates.values()).filter((template) =>
      template.supportedProjectTypes.includes(projectType)
    );
  }

  /**
   * Get templates by category
   * @param {string} category - The category to filter by
   * @returns {void} Array of templates in the category
   */
  async getByCategory(category: string): Promise<TemplateMetadata[]> {
    return Array.from(this.templates.values()).filter((template) => template.category === category);
  }

  /**
   * Get popular templates by usage count
   * @param {unknown} limit - Maximum number of templates to return
   * @returns {void} Array of popular templates sorted by usage
   */
  async getPopular(limit = 10): Promise<TemplateMetadata[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => b.usageStats.usageCount - a.usageStats.usageCount)
      .slice(0, limit);
  }

  /**
   * Get recently updated templates
   * @param {unknown} limit - Maximum number of templates to return
   * @returns {void} Array of recently updated templates sorted by modification date
   */
  async getRecentlyUpdated(limit = 10): Promise<TemplateMetadata[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .slice(0, limit);
  }

  /**
   * Validate a template by ID
   * @param {string} templateId - The template ID to validate
   * @returns {void} Validation result with any errors found
   */
  async validate(templateId: string): Promise<TemplateValidationResult> {
    const template = await this.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return TemplateMetadataValidator.validateTemplate(template);
  }

  /**
   * Update template metadata
   * @param {string} templateId - The template ID to update
   * @param {Partial<TemplateMetadata>} metadata - Partial metadata to merge with existing
   */
  async updateMetadata(templateId: string, metadata: Partial<TemplateMetadata>): Promise<void> {
    const existingTemplate = await this.get(templateId);
    if (!existingTemplate) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const updatedTemplate = { ...existingTemplate, ...metadata };
    this.templates.set(templateId, updatedTemplate);

    // Update cache
    if (this.config.cache.enabled) {
      await this.cache.set(templateId, updatedTemplate, this.config.cache.ttl);
    }
  }

  /**
   * Record template usage statistics
   * @param {{ templateId: string; projectType: ProjectType; qualityLevel: ProjectQualityLevel; renderTime: number; success: boolean }} usageData - Usage data to record
   * @param {string} usageData.templateId - The template ID that was used
   * @param {ProjectType} usageData.projectType - The project type the template was used for
   * @param {ProjectQualityLevel} usageData.qualityLevel - The quality level of the template usage
   * @param {number} usageData.renderTime - Time taken to render the template
   * @param {boolean} usageData.success - Whether the template rendering was successful
   */
  async recordUsage(usageData: {
    templateId: string;
    projectType: ProjectType;
    qualityLevel: ProjectQualityLevel;
    renderTime: number;
    success: boolean;
  }): Promise<void> {
    const { templateId, projectType, qualityLevel, renderTime, success } = usageData;
    const template = await this.get(templateId);
    if (!template) return;

    const updatedStats = this.calculateUpdatedUsageStats(template, renderTime, success);
    this.updatePopularProjectTypes(updatedStats, projectType);
    this.updatePopularQualityLevels(updatedStats, qualityLevel);

    const updatedTemplate = { ...template, usageStats: updatedStats };
    this.templates.set(templateId, updatedTemplate);

    await this.updateCacheIfNeeded(templateId, updatedTemplate);
  }

  /**
   * Calculate updated usage statistics
   * @param {unknown} template - Template with current stats
   * @param {unknown} renderTime - New render time to include
   * @param {unknown} success - Whether the usage was successful
   * @returns {TemplateUsageStats} Updated usage statistics
   */
  private calculateUpdatedUsageStats(
    template: TemplateMetadata,
    renderTime: number,
    success: boolean
  ): TemplateUsageStats {
    const currentCount = template.usageStats.usageCount;
    const newCount = currentCount + 1;

    return {
      ...template.usageStats,
      usageCount: newCount,
      lastUsed: new Date(),
      successRate: success
        ? (template.usageStats.successRate * currentCount + 1) / newCount
        : (template.usageStats.successRate * currentCount) / newCount,
      averageRenderTime:
        (template.usageStats.averageRenderTime * currentCount + renderTime) / newCount,
    };
  }

  /**
   * Update popular project types in usage stats
   * @param {TemplateUsageStats} stats - Usage statistics to update
   * @param {ProjectType} projectType - Project type to increment
   * @returns { void} Updated usage statistics
   */
  private updatePopularProjectTypes(stats: TemplateUsageStats, projectType: ProjectType): void {
    const existingTypeIndex = stats.popularProjectTypes.findIndex(
      (item) => item.type === projectType
    );

    if (existingTypeIndex >= 0) {
      stats.popularProjectTypes[existingTypeIndex].count++;
    } else {
      stats.popularProjectTypes.push({ type: projectType, count: 1 });
    }
  }

  /**
   * Update popular quality levels in usage stats
   * @param {unknown} stats - Usage statistics to update
   * @param {unknown} qualityLevel - Quality level to increment
   */
  private updatePopularQualityLevels(
    stats: TemplateUsageStats,
    qualityLevel: ProjectQualityLevel
  ): void {
    const existingLevelIndex = stats.popularQualityLevels.findIndex(
      (item) => item.level === qualityLevel
    );

    if (existingLevelIndex >= 0) {
      stats.popularQualityLevels[existingLevelIndex].count++;
    } else {
      stats.popularQualityLevels.push({ level: qualityLevel, count: 1 });
    }
  }

  /**
   * Update cache if enabled
   * @param {unknown} templateId - Template ID to update in cache
   * @param {unknown} updatedTemplate - Updated template to cache
   */
  private async updateCacheIfNeeded(
    templateId: string,
    updatedTemplate: TemplateMetadata
  ): Promise<void> {
    if (this.config.cache.enabled) {
      await this.cache.set(templateId, updatedTemplate, this.config.cache.ttl);
    }
  }
}
