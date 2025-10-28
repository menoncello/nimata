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
   * @param results Search results
   * @param filters Filters to apply
   * @param filters.category Filter by category
   * @param filters.projectType Filter by project type
   * @param filters.tags Filter by tags
   * @param filters.author Filter by author
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
   * @param template Template metadata
   * @param filters Filters to check
   * @param filters.category Filter by category
   * @param filters.projectType Filter by project type
   * @param filters.tags Filter by tags
   * @param filters.author Filter by author
   * @returns True if template matches all filters
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
   * @param template Template metadata
   * @param category Category filter
   * @returns True if matches
   */
  static matchesCategoryFilter(template: TemplateMetadata, category?: string): boolean {
    return !category || template.category === category;
  }

  /**
   * Check if template matches project type filter
   * @param template Template metadata
   * @param projectType Project type filter
   * @returns True if matches
   */
  static matchesProjectTypeFilter(template: TemplateMetadata, projectType?: ProjectType): boolean {
    return !projectType || template.supportedProjectTypes.includes(projectType);
  }

  /**
   * Check if template matches tags filter
   * @param template Template metadata
   * @param tags Tags filter
   * @returns True if matches
   */
  static matchesTagsFilter(template: TemplateMetadata, tags?: string[]): boolean {
    return !tags || tags.every((tag) => template.tags.includes(tag));
  }

  /**
   * Check if template matches author filter
   * @param template Template metadata
   * @param author Author filter
   * @returns True if matches
   */
  static matchesAuthorFilter(template: TemplateMetadata, author?: string): boolean {
    return !author || template.author === author;
  }
}
