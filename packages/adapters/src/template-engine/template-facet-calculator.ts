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
   * @param {TemplateMetadata[]} templates - Array of templates to analyze
   * @returns {TemplateMetadata[]):} Faceted search results
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
   * @returns {{ tags: Map<string, number>; projectTypes: Map<ProjectType, number>; qualityLevels: Map<ProjectQualityLevel, number>; categories: Map<string, number>; features: Map<string, number>; authors: Map<string, number>; }} Initialized facet counters
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
   * @param {TemplateMetadata[]} templates - Templates to analyze
   * @param {{ tags: Map<string, number>; projectTypes: Map<ProjectType, number>; qualityLevels: Map<ProjectQualityLevel, number>; categories: Map<string, number>; features: Map<string, number>; authors: Map<string, number>; }} facets - Facet counters to populate
   * @param {Map<string, number>} facets.tags - Tags counter
   * @param {Map<ProjectType, number>} facets.projectTypes - Project types counter
   * @param {Map<ProjectQualityLevel, number>} facets.qualityLevels - Quality levels counter
   * @param {Map<string, number>} facets.categories - Categories counter
   * @param {Map<string, number>} facets.features - Features counter
   * @param {Map<string, number>} facets.authors - Authors counter
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
   * @param {string[]} tags - Template tags
   * @param {Map<string} tagCounter - Tags counter map
   */
  private static incrementTemplateTags(tags: string[], tagCounter: Map<string, number>): void {
    for (const tag of tags) {
      this.incrementCounter(tag, tagCounter);
    }
  }

  /**
   * Increment template project types counter
   * @param {unknown} projectTypes - Template project types
   * @param {unknown} typeCounter - Project types counter map
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
   * @param {unknown} qualityLevels - Template quality levels
   * @param {unknown} levelCounter - Quality levels counter map
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
   * @param {Array<{ id: string }>} features - Template features
   * @param {Map<string, number>} featureCounter - Features counter map
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
   * @param {K} key - Key to increment
   * @param {Map<K, number>} counter - Counter map
   */
  private static incrementCounter<K>(key: K, counter: Map<K, number>): void {
    counter.set(key, (counter.get(key) || 0) + 1);
  }

  /**
   * Convert facet maps to arrays
   * @param {{ tags: Map<string, number>; projectTypes: Map<ProjectType, number>; qualityLevels: Map<ProjectQualityLevel, number>; categories: Map<string, number>; features: Map<string, number>; authors: Map<string, number>; }} facets - Facet maps to convert
   * @param {Map<string, number>} facets.tags - Tags map
   * @param {Map<ProjectType, number>} facets.projectTypes - Project types map
   * @param {Map<ProjectQualityLevel, number>} facets.qualityLevels - Quality levels map
   * @param {Map<string, number>} facets.categories - Categories map
   * @param {Map<string, number>} facets.features - Features map
   * @param {Map<string, number>} facets.authors - Authors map
   * @returns {{ tags: Array<{ name: string; count: number }>; projectTypes: Array<{ name: string; count: number }>; qualityLevels: Array<{ name: string; count: number }>; categories: Array<{ name: string; count: number }>; features: Array<{ name: string; count: number }>; authors: Array<{ name: string; count: number }>; }} Facet arrays
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
   * @param {unknown} map - Map to convert
   * @param {unknown} keyName - Name of the key field
   * @returns {Array<} Array of key-value pairs
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
   * @param {unknown} map - Map to convert
   * @param {unknown} keyName - Name of the key field
   * @returns {Array< |} Array of key-value pairs
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
   * @param {unknown} map - Project type map to convert
   * @returns {Array<} Array of project type-count pairs
   */
  private static convertProjectTypeMapToPairs(
    map: Map<ProjectType, number>
  ): Array<{ type: ProjectType; count: number }> {
    return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
  }

  /**
   * Convert quality level map to pairs array
   * @param {unknown} map - Quality level map to convert
   * @returns {Array<} Array of quality level-count pairs
   */
  private static convertQualityLevelMapToPairs(
    map: Map<ProjectQualityLevel, number>
  ): Array<{ level: ProjectQualityLevel; count: number }> {
    return Array.from(map.entries()).map(([level, count]) => ({ level, count }));
  }
}
