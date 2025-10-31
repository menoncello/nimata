/**
 * Template Filter Utilities
 *
 * Handles filtering functionality for templates
 */
import type { TemplateMetadata, ProjectType } from '@nimata/core';

/**
 * Template filter utilities class
 */
export class TemplateFilterUtils {
  /**
   * Apply filters to search results
   * @param {Map<string} results Search results
   * @param {unknown} filters Filters to apply
   * @param {unknown} filters.category Filter by category
   * @param {unknown} filters.projectType Filter by project type
   * @param {unknown} filters.tags Filter by tags
   * @param {unknown} filters.author Filter by author
   */
  static applyFilters(
    results: Map<string, { template: TemplateMetadata; score: number }>,
    filters: {
      category?: string;
      projectType?: ProjectType;
      tags?: string[];
      author?: string;
    }
  ): void {
    for (const [templateId, { template }] of results.entries()) {
      if (!this.templateMatchesFilters(template, filters)) {
        results.delete(templateId);
      }
    }
  }

  /**
   * Check if template matches all filters
   * @param {TemplateMetadata} template Template metadata
   * @param {{ category?: string; projectType?: ProjectType; tags?: string[]; author?: string; }} filters - Search filters
   * @param {string | undefined} filters.category Filter by category
   * @param {ProjectType | undefined} filters.projectType Filter by project type
   * @param {string[] | undefined} filters.tags Filter by tags
   * @param {string | undefined} filters.author Filter by author
   * @returns {boolean} True if template matches all filters
   */
  static templateMatchesFilters(
    template: TemplateMetadata,
    filters: {
      category?: string;
      projectType?: ProjectType;
      tags?: string[];
      author?: string;
    }
  ): boolean {
    return (
      this.matchesCategoryFilter(template, filters.category) &&
      this.matchesProjectTypeFilter(template, filters.projectType) &&
      this.matchesTagsFilter(template, filters.tags) &&
      this.matchesAuthorFilter(template, filters.author)
    );
  }

  /**
   * Check if template matches category filter
   * @param {TemplateMetadata} template Template metadata
   * @param {unknown} category Category filter
   * @returns { boolean} True if matches
   */
  static matchesCategoryFilter(template: TemplateMetadata, category?: string): boolean {
    return !category || template.category === category;
  }

  /**
   * Check if template matches project type filter
   * @param {TemplateMetadata} template Template metadata
   * @param {unknown} projectType Project type filter
   * @returns { boolean} True if matches
   */
  static matchesProjectTypeFilter(template: TemplateMetadata, projectType?: ProjectType): boolean {
    return !projectType || template.supportedProjectTypes.includes(projectType);
  }

  /**
   * Check if template matches tags filter
   * @param {TemplateMetadata} template Template metadata
   * @param {unknown} tags Tags filter
   * @returns { boolean} True if matches
   */
  static matchesTagsFilter(template: TemplateMetadata, tags?: string[]): boolean {
    return !tags || tags.every((tag) => template.tags.includes(tag));
  }

  /**
   * Check if template matches author filter
   * @param {TemplateMetadata} template Template metadata
   * @param {unknown} author Author filter
   * @returns { boolean} True if matches
   */
  static matchesAuthorFilter(template: TemplateMetadata, author?: string): boolean {
    return !author || template.author === author;
  }
}
