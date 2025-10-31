/**
 * CSS Styles Generator for Vue projects
 */

import { CSSLayoutGenerator } from './css-layout-generator.js';
import { CSSUtilitiesGenerator } from './css-utilities-generator.js';

/**
 * Generates CSS styles for Vue projects
 */
export class CSSStylesGenerator {
  /**
   * Get base styles
   * @returns {string} Base CSS styles
   */
  static getBaseStyles(): string {
    return CSSLayoutGenerator.getBaseStyles();
  }

  /**
   * Get component styles
   * @returns {string} Component CSS
   */
  static getComponentStyles(): string {
    return CSSLayoutGenerator.getComponentStyles();
  }

  /**
   * Get utility classes
   * @returns {string} Utility CSS classes
   */
  static getUtilityClasses(): string {
    return CSSUtilitiesGenerator.getUtilityClasses();
  }
}
