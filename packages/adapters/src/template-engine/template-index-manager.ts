/**
 * Template Index Manager Utility
 *
 * Handles indexing and search functionality for templates
 */
import type { TemplateMetadata, ProjectType } from '@nimata/core';
import { TemplateIndexUtils } from './template-index-utils';
import { TemplateSearchUtils } from './template-search-utils';

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
const INDEX_CONSTANTS = {
  MAX_SEARCH_RESULTS: 50,
} as const;

/**
 * Template index manager utility class
 */
export class TemplateIndexManager {
  private index: TemplateIndex;

  /**
   * Initialize template index manager
   */
  constructor() {
    this.index = TemplateIndexUtils.createEmptyIndex();
  }

  /**
   * Add template to index
   * @param {TemplateMetadata} template Template metadata
   */
  addTemplate(template: TemplateMetadata): void {
    this.index.templatesById.set(template.id, template);
    this.index.templatesByPath.set(template.filePath, template);

    TemplateIndexUtils.addToCategoryIndex(this.index, template);
    TemplateIndexUtils.addToProjectTypeIndex(this.index, template);
    TemplateIndexUtils.addToTagIndex(this.index, template);
    TemplateIndexUtils.addToAuthorIndex(this.index, template);
    TemplateIndexUtils.addToFullTextIndex(this.index, template);
  }

  /**
   * Remove template from index
   * @param {string} templateId Template ID
   */
  removeTemplate(templateId: string): void {
    const template = this.index.templatesById.get(templateId);
    if (!template) return;

    this.index.templatesById.delete(templateId);
    this.index.templatesByPath.delete(template.filePath);

    TemplateIndexUtils.removeFromCategoryIndex(this.index, template);
    TemplateIndexUtils.removeFromProjectTypeIndex(this.index, template);
    TemplateIndexUtils.removeFromTagIndex(this.index, template);
    TemplateIndexUtils.removeFromAuthorIndex(this.index, template);
    TemplateIndexUtils.removeFromFullTextIndex(this.index, template);
  }

  /**
   * Search templates by query
   * @param {string} query Search query
   * @param {{ category?: string; projectType?: ProjectType; tags?: string[]; author?: string; }} filters - Search filters
   * @param {string | undefined} filters.category Filter by category
   * @param {ProjectType | undefined} filters.projectType Filter by project type
   * @param {string[] | undefined} filters.tags Filter by tags
   * @param {string | undefined} filters.author Filter by author
   * @returns {TemplateMetadata[]} Array of matching templates
   */
  search(
    query: string,
    filters: {
      category?: string;
      projectType?: ProjectType;
      tags?: string[];
      author?: string;
    } = {}
  ): TemplateMetadata[] {
    const results = new Map<string, { template: TemplateMetadata; score: number }>();

    // Search by text
    TemplateSearchUtils.searchByText(this.index, query, results);

    // Apply filters
    TemplateSearchUtils.applyFilters(results, filters);

    // Sort by score and return results
    return Array.from(results.entries())
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, INDEX_CONSTANTS.MAX_SEARCH_RESULTS)
      .map(([, { template }]) => template);
  }

  /**
   * Get template by ID
   * @param {string} templateId Template ID
   * @returns {string): TemplateMetadata | null} Template metadata or null
   */
  getTemplateById(templateId: string): TemplateMetadata | null {
    return this.index.templatesById.get(templateId) || null;
  }

  /**
   * Get template by file path
   * @param {string} filePath File path
   * @returns {string): TemplateMetadata | null} Template metadata or null
   */
  getTemplateByPath(filePath: string): TemplateMetadata | null {
    return this.index.templatesByPath.get(filePath) || null;
  }

  /**
   * Get templates by category
   * @param {string} category Category
   * @returns {string): TemplateMetadata[]} Array of templates
   */
  getTemplatesByCategory(category: string): TemplateMetadata[] {
    return this.index.templatesByCategory.get(category) || [];
  }

  /**
   * Get templates by project type
   * @param {ProjectType} projectType Project type
   * @returns {ProjectType): TemplateMetadata[]} Array of templates
   */
  getTemplatesByProjectType(projectType: ProjectType): TemplateMetadata[] {
    return this.index.templatesByProjectType.get(projectType) || [];
  }

  /**
   * Get all templates
   * @returns {TemplateMetadata[]} Array of all templates
   */
  getAllTemplates(): TemplateMetadata[] {
    return Array.from(this.index.templatesById.values());
  }

  /**
   * Get index size
   * @returns {number} Number of indexed templates
   */
  getIndexSize(): number {
    return this.index.templatesById.size;
  }

  /**
   * Index multiple templates
   * @param {TemplateMetadata[]} templates Array of templates to index
   */
  indexTemplates(templates: TemplateMetadata[]): void {
    for (const template of templates) {
      this.addTemplate(template);
    }
  }

  /**
   * Clear index
   */
  clearIndex(): void {
    this.index = TemplateIndexUtils.createEmptyIndex();
  }
}
