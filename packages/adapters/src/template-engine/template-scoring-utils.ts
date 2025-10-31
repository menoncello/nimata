/**
 * Template Scoring Utilities
 *
 * Handles scoring and relevance calculation for templates
 */
import type { TemplateMetadata } from '@nimata/core';

/**
 * Constants for scoring
 */
const SCORING_CONSTANTS = {
  CATEGORY_BOOST: 10,
  TAG_BOOST: 5,
  NAME_BOOST: 7,
  DESCRIPTION_BOOST: 3,
} as const;

/**
 * Template scoring utilities class
 */
export class TemplateScoringUtils {
  /**
   * Calculate text relevance score for template
   * @param {TemplateMetadata} template Template metadata
   * @param {string} term Search term
   * @returns { number} Relevance score
   */
  static calculateTextScore(template: TemplateMetadata, term: string): number {
    let score = 0;

    score += this.getNameMatchScore(template, term);
    score += this.getDescriptionMatchScore(template, term);
    score += this.getTagMatchScore(template, term);
    score += this.getCategoryMatchScore(template, term);

    return score;
  }

  /**
   * Calculate name match score
   * @param {TemplateMetadata} template Template metadata
   * @param {string} term Search term
   * @returns { number} Name match score
   */
  static getNameMatchScore(template: TemplateMetadata, term: string): number {
    return template.name.toLowerCase().includes(term) ? SCORING_CONSTANTS.NAME_BOOST : 0;
  }

  /**
   * Calculate description match score
   * @param {TemplateMetadata} template Template metadata
   * @param {string} term Search term
   * @returns { number} Description match score
   */
  static getDescriptionMatchScore(template: TemplateMetadata, term: string): number {
    return template.description.toLowerCase().includes(term)
      ? SCORING_CONSTANTS.DESCRIPTION_BOOST
      : 0;
  }

  /**
   * Calculate tag match score
   * @param {TemplateMetadata} template Template metadata
   * @param {string} term Search term
   * @returns { number} Tag match score
   */
  static getTagMatchScore(template: TemplateMetadata, term: string): number {
    return template.tags.some((tag) => tag.toLowerCase().includes(term))
      ? SCORING_CONSTANTS.TAG_BOOST
      : 0;
  }

  /**
   * Calculate category match score
   * @param {TemplateMetadata} template Template metadata
   * @param {string} term Search term
   * @returns { number} Category match score
   */
  static getCategoryMatchScore(template: TemplateMetadata, term: string): number {
    return template.category.toLowerCase().includes(term) ? SCORING_CONSTANTS.CATEGORY_BOOST : 0;
  }
}
