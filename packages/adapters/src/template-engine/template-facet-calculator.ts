/**
 * Template Facet Calculator
 *
 * Provides functionality for calculating search facets from template metadata
 */
import type { TemplateMetadata, ProjectType, ProjectQualityLevel } from '@nimata/core';

/**
 * Template facet calculation utilities
 */
export class TemplateFacetCalculator {
  /**
   * Calculate search facets for filtering
   * @param templates - Array of templates to analyze
   * @returns Faceted search results
   */
  static calculateFacets(templates: TemplateMetadata[]): {
    tags: Array<{ tag: string; count: number }>;
    projectTypes: Array<{ type: ProjectType; count: number }>;
    qualityLevels: Array<{ level: ProjectQualityLevel; count: number }>;
    categories: Array<{ category: string; count: number }>;
    features: Array<{ feature: string; count: number }>;
    authors: Array<{ author: string; count: number }>;
  } {
    const facets = this.initializeFacetCounters();
    this.populateFacetCounters(templates, facets);
    return this.convertFacetsToArrays(facets);
  }

  /**
   * Initialize facet counter maps
   * @returns Initialized facet counters
   */
  private static initializeFacetCounters(): {
    tags: Map<string, number>;
    projectTypes: Map<ProjectType, number>;
    qualityLevels: Map<ProjectQualityLevel, number>;
    categories: Map<string, number>;
    features: Map<string, number>;
    authors: Map<string, number>;
  } {
    return {
      tags: new Map<string, number>(),
      projectTypes: new Map<ProjectType, number>(),
      qualityLevels: new Map<ProjectQualityLevel, number>(),
      categories: new Map<string, number>(),
      features: new Map<string, number>(),
      authors: new Map<string, number>(),
    };
  }

  /**
   * Populate facet counters from templates
   * @param templates - Templates to analyze
   * @param facets - Facet counters to populate
   * @param facets.tags - Tags counter
   * @param facets.projectTypes - Project types counter
   * @param facets.qualityLevels - Quality levels counter
   * @param facets.categories - Categories counter
   * @param facets.features - Features counter
   * @param facets.authors - Authors counter
   */
  private static populateFacetCounters(
    templates: TemplateMetadata[],
    facets: {
      tags: Map<string, number>;
      projectTypes: Map<ProjectType, number>;
      qualityLevels: Map<ProjectQualityLevel, number>;
      categories: Map<string, number>;
      features: Map<string, number>;
      authors: Map<string, number>;
    }
  ): void {
    for (const template of templates) {
      this.incrementTemplateTags(template.tags, facets.tags);
      this.incrementTemplateProjectTypes(template.supportedProjectTypes, facets.projectTypes);
      this.incrementTemplateQualityLevels(template.recommendedQualityLevels, facets.qualityLevels);
      this.incrementCounter(template.category, facets.categories);
      this.incrementTemplateFeatures(template.features, facets.features);

      if (template.author) {
        this.incrementCounter(template.author, facets.authors);
      }
    }
  }

  /**
   * Increment template tags counter
   * @param tags - Template tags
   * @param tagCounter - Tags counter map
   */
  private static incrementTemplateTags(tags: string[], tagCounter: Map<string, number>): void {
    for (const tag of tags) {
      this.incrementCounter(tag, tagCounter);
    }
  }

  /**
   * Increment template project types counter
   * @param projectTypes - Template project types
   * @param typeCounter - Project types counter map
   */
  private static incrementTemplateProjectTypes(
    projectTypes: ProjectType[],
    typeCounter: Map<ProjectType, number>
  ): void {
    for (const type of projectTypes) {
      this.incrementCounter(type, typeCounter);
    }
  }

  /**
   * Increment template quality levels counter
   * @param qualityLevels - Template quality levels
   * @param levelCounter - Quality levels counter map
   */
  private static incrementTemplateQualityLevels(
    qualityLevels: ProjectQualityLevel[],
    levelCounter: Map<ProjectQualityLevel, number>
  ): void {
    for (const level of qualityLevels) {
      this.incrementCounter(level, levelCounter);
    }
  }

  /**
   * Increment template features counter
   * @param features - Template features
   * @param featureCounter - Features counter map
   */
  private static incrementTemplateFeatures(
    features: Array<{ id: string }>,
    featureCounter: Map<string, number>
  ): void {
    for (const feature of features) {
      this.incrementCounter(feature.id, featureCounter);
    }
  }

  /**
   * Increment a counter map
   * @param key - Key to increment
   * @param counter - Counter map
   */
  private static incrementCounter<K>(key: K, counter: Map<K, number>): void {
    counter.set(key, (counter.get(key) || 0) + 1);
  }

  /**
   * Convert facet maps to arrays
   * @param facets - Facet maps
   * @param facets.tags - Tags map
   * @param facets.projectTypes - Project types map
   * @param facets.qualityLevels - Quality levels map
   * @param facets.categories - Categories map
   * @param facets.features - Features map
   * @param facets.authors - Authors map
   * @returns Facet arrays
   */
  private static convertFacetsToArrays(facets: {
    tags: Map<string, number>;
    projectTypes: Map<ProjectType, number>;
    qualityLevels: Map<ProjectQualityLevel, number>;
    categories: Map<string, number>;
    features: Map<string, number>;
    authors: Map<string, number>;
  }): {
    tags: Array<{ tag: string; count: number }>;
    projectTypes: Array<{ type: ProjectType; count: number }>;
    qualityLevels: Array<{ level: ProjectQualityLevel; count: number }>;
    categories: Array<{ category: string; count: number }>;
    features: Array<{ feature: string; count: number }>;
    authors: Array<{ author: string; count: number }>;
  } {
    return {
      tags: this.convertMapToPairs(facets.tags, 'tag'),
      projectTypes: this.convertProjectTypeMapToPairs(facets.projectTypes),
      qualityLevels: this.convertQualityLevelMapToPairs(facets.qualityLevels),
      categories: this.convertMapToPairs(facets.categories, 'category'),
      features: this.convertMapToPairs(facets.features, 'feature'),
      authors: this.convertMapToPairs(facets.authors, 'author'),
    };
  }

  /**
   * Convert a map to key-value pairs array
   * @param map - Map to convert
   * @param keyName - Name of the key field
   * @returns Array of key-value pairs
   */
  private static convertMapToPairs<K extends string>(
    map: Map<K, number>,
    keyName: 'tag'
  ): Array<{ tag: K; count: number }>;
  /** Convert a map to category-count pairs array */
  private static convertMapToPairs<K extends string>(
    map: Map<K, number>,
    keyName: 'category'
  ): Array<{ category: K; count: number }>;
  /** Convert a map to feature-count pairs array */
  private static convertMapToPairs<K extends string>(
    map: Map<K, number>,
    keyName: 'feature'
  ): Array<{ feature: K; count: number }>;
  /** Convert a map to author-count pairs array */
  private static convertMapToPairs<K extends string>(
    map: Map<K, number>,
    keyName: 'author'
  ): Array<{ author: K; count: number }>;
  /**
   * Convert a map to key-value pairs array with fallback
   * @param map - Map to convert
   * @param keyName - Name of the key field
   * @returns Array of key-value pairs
   */
  private static convertMapToPairs<K extends string>(
    map: Map<K, number>,
    keyName: string
  ): Array<
    | { tag: K; count: number }
    | { category: K; count: number }
    | { feature: K; count: number }
    | { author: K; count: number }
  > {
    return Array.from(map.entries()).map(([key, count]) => {
      switch (keyName) {
        case 'tag':
          return { tag: key, count };
        case 'category':
          return { category: key, count };
        case 'feature':
          return { feature: key, count };
        case 'author':
          return { author: key, count };
        default:
          // Fallback for any other key name - return tag as default
          return { tag: key, count } as { tag: K; count: number };
      }
    });
  }

  /**
   * Convert project type map to pairs array
   * @param map - Project type map to convert
   * @returns Array of project type-count pairs
   */
  private static convertProjectTypeMapToPairs(
    map: Map<ProjectType, number>
  ): Array<{ type: ProjectType; count: number }> {
    return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
  }

  /**
   * Convert quality level map to pairs array
   * @param map - Quality level map to convert
   * @returns Array of quality level-count pairs
   */
  private static convertQualityLevelMapToPairs(
    map: Map<ProjectQualityLevel, number>
  ): Array<{ level: ProjectQualityLevel; count: number }> {
    return Array.from(map.entries()).map(([level, count]) => ({ level, count }));
  }
}
