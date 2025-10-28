/**
 * Template Search Engine Utility
 *
 * Handles search functionality for templates with advanced filtering and scoring
 */
import { performance } from 'node:perf_hooks';
import type { TemplateMetadata, TemplateSearchFilter, TemplateSearchResult } from '@nimata/core';

/**
 * Constants for search scoring
 */
const SEARCH_CONSTANTS = {
  NAME_WEIGHT: 0.7,
  DESCRIPTION_WEIGHT: 0.3,
  TAG_WEIGHT: 0.7,
  CATEGORY_WEIGHT: 0.3,
  EXACT_MATCH_BOOST: 1.5,
  PARTIAL_MATCH_BOOST: 1.0,
  MAX_RESULTS: 50,
  DEFAULT_TIMEOUT: 1000,
  MIN_QUERY_LENGTH: 2,
  MIN_RELEVANCE_SCORE: 0.1,
  SUGGESTION_MULTIPLIER: 2,
} as const;

/**
 * Template search engine utility class
 */
export class TemplateSearchEngine {
  /**
   * Search templates using filter criteria
   * @param templates - Array of templates to search
   * @param filter - Search filter criteria
   * @returns Search results with matching templates
   */
  static search(templates: TemplateMetadata[], filter: TemplateSearchFilter): TemplateSearchResult {
    const startTime = performance.now();

    const filteredTemplates = this.applyFilters(templates, filter);
    const sortedTemplates = this.sortAndLimitResults(filteredTemplates, filter);

    const duration = performance.now() - startTime;
    const resultLimit = filter.limit || SEARCH_CONSTANTS.MAX_RESULTS;

    return {
      templates: sortedTemplates,
      total: filteredTemplates.length,
      totalCount: templates.length,
      executionTime: duration,
      hasMore: filteredTemplates.length > resultLimit,
      filters: filter,
      facets: this.createEmptyFacets(),
    };
  }

  /**
   * Apply filters to templates
   * @param templates - Array of templates to filter
   * @param filter - Search filter criteria
   * @returns Filtered templates
   */
  private static applyFilters(
    templates: TemplateMetadata[],
    filter: TemplateSearchFilter
  ): TemplateMetadata[] {
    return templates.filter((template) => this.matchesFilter(template, filter));
  }

  /**
   * Sort and limit results
   * @param filteredTemplates - Filtered templates
   * @param filter - Search filter criteria
   * @returns Sorted and limited templates
   */
  private static sortAndLimitResults(
    filteredTemplates: TemplateMetadata[],
    filter: TemplateSearchFilter
  ): TemplateMetadata[] {
    const scoredTemplates = filteredTemplates.map((template) => ({
      template,
      score: filter.query ? this.calculateRelevanceScore(template, filter.query) : 1.0,
    }));

    const resultLimit = filter.limit || SEARCH_CONSTANTS.MAX_RESULTS;

    return scoredTemplates
      .sort((a, b) => b.score - a.score)
      .slice(0, resultLimit)
      .map((item) => item.template);
  }

  /**
   * Create empty facets object for search result
   * @returns Empty facets object
   */
  private static createEmptyFacets(): {
    tags: [];
    projectTypes: [];
    qualityLevels: [];
    categories: [];
    features: [];
    authors: [];
  } {
    return {
      tags: [],
      projectTypes: [],
      qualityLevels: [],
      categories: [],
      features: [],
      authors: [],
    };
  }

  /**
   * Check if template matches search filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches filter
   */
  private static matchesFilter(template: TemplateMetadata, filter: TemplateSearchFilter): boolean {
    if (!this.matchesQueryFilter(template, filter)) {
      return false;
    }

    if (!this.matchesTagsFilter(template, filter)) {
      return false;
    }

    if (!this.matchesProjectTypesFilter(template, filter)) {
      return false;
    }

    if (!this.matchesQualityLevelsFilter(template, filter)) {
      return false;
    }

    if (!this.matchesCategoryFilter(template, filter)) {
      return false;
    }

    if (!this.matchesAuthorFilter(template, filter)) {
      return false;
    }

    if (!this.matchesDateRangeFilter(template, filter)) {
      return false;
    }

    return true;
  }

  /**
   * Check if template matches query filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches query
   */
  private static matchesQueryFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.query) {
      return true;
    }

    const query = filter.query.toLowerCase();
    return this.matchesTextSearch(template, query);
  }

  /**
   * Check if template matches text search query
   * @param template - Template metadata
   * @param query - Search query
   * @returns True if template matches query
   */
  private static matchesTextSearch(template: TemplateMetadata, query: string): boolean {
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      template.category.toLowerCase().includes(query)
    );
  }

  /**
   * Check if template matches tags filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches tags
   */
  private static matchesTagsFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.tags || filter.tags.length === 0) {
      return true;
    }

    return filter.tags.every((tag) => template.tags.includes(tag));
  }

  /**
   * Check if template matches project types filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches project types
   */
  private static matchesProjectTypesFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.projectTypes || filter.projectTypes.length === 0) {
      return true;
    }

    return filter.projectTypes.some((type) => template.supportedProjectTypes.includes(type));
  }

  /**
   * Check if template matches quality levels filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches quality levels
   */
  private static matchesQualityLevelsFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.qualityLevels || filter.qualityLevels.length === 0) {
      return true;
    }

    return filter.qualityLevels.some((level) => template.recommendedQualityLevels.includes(level));
  }

  /**
   * Check if template matches category filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches category
   */
  private static matchesCategoryFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.category) {
      return true;
    }

    return template.category === filter.category;
  }

  /**
   * Check if template matches author filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches author
   */
  private static matchesAuthorFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.author) {
      return true;
    }

    return template.author === filter.author;
  }

  /**
   * Check if template matches date range filter
   * @param template - Template metadata
   * @param filter - Search filter
   * @returns True if template matches date range
   */
  private static matchesDateRangeFilter(
    template: TemplateMetadata,
    filter: TemplateSearchFilter
  ): boolean {
    if (!filter.dateRange) {
      return true;
    }

    const { from, to } = filter.dateRange;
    const lastModified = template.lastModified;

    if (from && lastModified < from) {
      return false;
    }

    if (to && lastModified > to) {
      return false;
    }

    return true;
  }

  /**
   * Calculate relevance score for template
   * @param template - Template metadata
   * @param query - Search query
   * @returns Relevance score (higher is more relevant)
   */
  private static calculateRelevanceScore(template: TemplateMetadata, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Name matching
    if (template.name.toLowerCase() === queryLower) {
      score += SEARCH_CONSTANTS.EXACT_MATCH_BOOST * SEARCH_CONSTANTS.NAME_WEIGHT;
    } else if (template.name.toLowerCase().includes(queryLower)) {
      score += SEARCH_CONSTANTS.PARTIAL_MATCH_BOOST * SEARCH_CONSTANTS.NAME_WEIGHT;
    }

    // Description matching
    if (template.description.toLowerCase().includes(queryLower)) {
      score += SEARCH_CONSTANTS.DESCRIPTION_WEIGHT;
    }

    // Tag matching
    const matchingTags = template.tags.filter((tag) => tag.toLowerCase().includes(queryLower));
    if (matchingTags.length > 0) {
      score += (matchingTags.length / template.tags.length) * SEARCH_CONSTANTS.TAG_WEIGHT;
    }

    // Category matching
    if (template.category.toLowerCase().includes(queryLower)) {
      score += SEARCH_CONSTANTS.CATEGORY_WEIGHT;
    }

    return Math.max(score, SEARCH_CONSTANTS.MIN_RELEVANCE_SCORE); // Minimum score to avoid zero results
  }

  /**
   * Get suggestions for autocomplete based on query
   * @param templates - Array of templates
   * @param query - Partial query
   * @param limit - Maximum number of suggestions
   * @returns Array of suggestions
   */
  static getSuggestions(templates: TemplateMetadata[], query: string, limit = 10): string[] {
    if (!query || query.length < SEARCH_CONSTANTS.MIN_QUERY_LENGTH) {
      return [];
    }

    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    for (const template of templates) {
      this.collectSuggestionsFromTemplate(template, queryLower, suggestions);

      if (suggestions.size >= limit * SEARCH_CONSTANTS.SUGGESTION_MULTIPLIER) {
        break; // Stop early if we have enough candidates
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Collect suggestions from a single template
   * @param template - Template to extract suggestions from
   * @param queryLower - Lowercase query string
   * @param suggestions - Set to collect suggestions
   */
  private static collectSuggestionsFromTemplate(
    template: TemplateMetadata,
    queryLower: string,
    suggestions: Set<string>
  ): void {
    this.addSuggestionIfExists(
      template.name.toLowerCase().includes(queryLower),
      template.name,
      suggestions
    );

    for (const tag of template.tags) {
      this.addSuggestionIfExists(tag.toLowerCase().includes(queryLower), tag, suggestions);
    }

    this.addSuggestionIfExists(
      template.category.toLowerCase().includes(queryLower),
      template.category,
      suggestions
    );

    if (template.author) {
      this.addSuggestionIfExists(
        template.author.toLowerCase().includes(queryLower),
        template.author,
        suggestions
      );
    }
  }

  /**
   * Add suggestion to set if condition is met
   * @param condition - Whether to add the suggestion
   * @param suggestion - Suggestion to add
   * @param suggestions - Set to add suggestion to
   */
  private static addSuggestionIfExists(
    condition: boolean,
    suggestion: string,
    suggestions: Set<string>
  ): void {
    if (condition) {
      suggestions.add(suggestion);
    }
  }
}
