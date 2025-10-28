/**
 * Template Search Utilities
 *
 * Handles search functionality for templates
 */
import type { TemplateMetadata, ProjectType } from '@nimata/core';
import { TemplateFilterUtils } from './template-filter-utils';
import { TemplateScoringUtils } from './template-scoring-utils';

/**
 * Template index for fast search
 */
interface TemplateIndex {
  templatesById: Map<string, TemplateMetadata>;
  templatesByPath: Map<string, TemplateMetadata>;
  templatesByCategory: Map<string, TemplateMetadata[]>;
  templatesByProjectType: Map<ProjectType, TemplateMetadata[]>;
  tagIndex: Map<string, TemplateMetadata[]>;
  authorIndex: Map<string, TemplateMetadata[]>;
  fullTextIndex: Map<string, Set<string>>; // word -> template IDs
}

/**
 * Constants for indexing
 */
const SEARCH_CONSTANTS = {
  MIN_WORD_LENGTH: 2,
} as const;

/**
 * Template search utilities class
 */
export class TemplateSearchUtils {
  /**
   * Search templates by text
   * @param index Template index
   * @param query Search query
   * @param results Map to store results
   */
  static searchByText(
    index: TemplateIndex,
    query: string,
    results: Map<string, { template: TemplateMetadata; score: number }>
  ): void {
    const terms = this.parseSearchTerms(query);

    for (const term of terms) {
      this.processSearchTerm(index, term, results);
    }
  }

  /**
   * Parse search query into terms
   * @param query Search query
   * @returns Array of search terms
   */
  static parseSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > SEARCH_CONSTANTS.MIN_WORD_LENGTH);
  }

  /**
   * Process a single search term
   * @param index Template index
   * @param term Search term
   * @param results Map to store results
   */
  static processSearchTerm(
    index: TemplateIndex,
    term: string,
    results: Map<string, { template: TemplateMetadata; score: number }>
  ): void {
    const templateIds = index.fullTextIndex.get(term);
    if (!templateIds) return;

    for (const templateId of templateIds) {
      this.updateTemplateScore(index, templateId, term, results);
    }
  }

  /**
   * Update template score in results
   * @param index Template index
   * @param templateId Template ID
   * @param term Search term
   * @param results Map to store results
   */
  static updateTemplateScore(
    index: TemplateIndex,
    templateId: string,
    term: string,
    results: Map<string, { template: TemplateMetadata; score: number }>
  ): void {
    const template = index.templatesById.get(templateId);
    if (!template) return;

    const existing = results.get(templateId);
    const score = TemplateScoringUtils.calculateTextScore(template, term);

    if (existing) {
      existing.score += score;
    } else {
      results.set(templateId, { template, score });
    }
  }

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
    TemplateFilterUtils.applyFilters(results, filters);
  }
}
