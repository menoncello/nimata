/**
 * Template Index Management Utilities
 *
 * Handles adding and removing templates from various indexes
 */
import type { TemplateMetadata, ProjectType } from '@nimata/core';

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
  MAX_SNIPPET_LENGTH: 200,
  MAX_SEARCH_RESULTS: 50,
  SCORE_THRESHOLD: 5,
  THRESHOLD_70_PERCENT: 0.7,
  THRESHOLD_30_PERCENT: 0.3,
  MIN_WORD_LENGTH: 2,
  MIN_TAG_LENGTH: 2,
  CATEGORY_BOOST: 10,
  TAG_BOOST: 5,
  NAME_BOOST: 7,
  DESCRIPTION_BOOST: 3,
} as const;

/**
 * Template index utilities class
 */
export class TemplateIndexUtils {
  /**
   * Create empty template index
   * @returns {TemplateIndex} Empty template index
   */
  static createEmptyIndex(): TemplateIndex {
    return {
      templatesById: new Map(),
      templatesByPath: new Map(),
      templatesByCategory: new Map(),
      templatesByProjectType: new Map(),
      tagIndex: new Map(),
      authorIndex: new Map(),
      fullTextIndex: new Map(),
    };
  }

  /**
   * Add template to category index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static addToCategoryIndex(index: TemplateIndex, template: TemplateMetadata): void {
    const category = template.category || 'other';
    const categoryArray = index.templatesByCategory.get(category);
    if (categoryArray) {
      categoryArray.push(template);
    } else {
      index.templatesByCategory.set(category, [template]);
    }
  }

  /**
   * Add template to project type index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static addToProjectTypeIndex(index: TemplateIndex, template: TemplateMetadata): void {
    for (const projectType of template.supportedProjectTypes) {
      const projectTypeArray = index.templatesByProjectType.get(projectType);
      if (projectTypeArray) {
        projectTypeArray.push(template);
      } else {
        index.templatesByProjectType.set(projectType, [template]);
      }
    }
  }

  /**
   * Add template to tag index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static addToTagIndex(index: TemplateIndex, template: TemplateMetadata): void {
    for (const tag of template.tags) {
      const tagArray = index.tagIndex.get(tag);
      if (tagArray) {
        tagArray.push(template);
      } else {
        index.tagIndex.set(tag, [template]);
      }
    }
  }

  /**
   * Add template to author index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static addToAuthorIndex(index: TemplateIndex, template: TemplateMetadata): void {
    if (template.author) {
      const authorArray = index.authorIndex.get(template.author);
      if (authorArray) {
        authorArray.push(template);
      } else {
        index.authorIndex.set(template.author, [template]);
      }
    }
  }

  /**
   * Add template to full-text index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static addToFullTextIndex(index: TemplateIndex, template: TemplateMetadata): void {
    const text = [
      template.name,
      template.description,
      template.tags.join(' '),
      template.category,
      template.author || '',
    ]
      .join(' ')
      .toLowerCase();

    const words = text.split(/\s+/).filter((word) => word.length > INDEX_CONSTANTS.MIN_WORD_LENGTH);

    for (const word of words) {
      const wordSet = index.fullTextIndex.get(word);
      if (wordSet) {
        wordSet.add(template.id);
      } else {
        index.fullTextIndex.set(word, new Set([template.id]));
      }
    }
  }

  /**
   * Remove template from category index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static removeFromCategoryIndex(index: TemplateIndex, template: TemplateMetadata): void {
    const category = template.category || 'other';
    const templates = index.templatesByCategory.get(category);
    if (templates) {
      const templateIndex = templates.findIndex((t) => t.id === template.id);
      if (templateIndex !== -1) {
        templates.splice(templateIndex, 1);
      }
    }
  }

  /**
   * Remove template from project type index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static removeFromProjectTypeIndex(index: TemplateIndex, template: TemplateMetadata): void {
    for (const projectType of template.supportedProjectTypes) {
      const templates = index.templatesByProjectType.get(projectType);
      if (templates) {
        const templateIndex = templates.findIndex((t) => t.id === template.id);
        if (templateIndex !== -1) {
          templates.splice(templateIndex, 1);
        }
      }
    }
  }

  /**
   * Remove template from tag index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static removeFromTagIndex(index: TemplateIndex, template: TemplateMetadata): void {
    for (const tag of template.tags) {
      const templates = index.tagIndex.get(tag);
      if (templates) {
        const templateIndex = templates.findIndex((t) => t.id === template.id);
        if (templateIndex !== -1) {
          templates.splice(templateIndex, 1);
        }
      }
    }
  }

  /**
   * Remove template from author index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static removeFromAuthorIndex(index: TemplateIndex, template: TemplateMetadata): void {
    if (template.author) {
      const templates = index.authorIndex.get(template.author);
      if (templates) {
        const templateIndex = templates.findIndex((t) => t.id === template.id);
        if (templateIndex !== -1) {
          templates.splice(templateIndex, 1);
        }
      }
    }
  }

  /**
   * Remove template from full-text index
   * @param {TemplateIndex} index Template index
   * @param {TemplateMetadata} template Template metadata
   */
  static removeFromFullTextIndex(index: TemplateIndex, template: TemplateMetadata): void {
    for (const [word, templateIds] of index.fullTextIndex.entries()) {
      templateIds.delete(template.id);
      if (templateIds.size === 0) {
        index.fullTextIndex.delete(word);
      }
    }
  }
}
