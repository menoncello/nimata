/**
 * CSS Generator for Vue projects
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { CSSStylesGenerator } from './css-styles-generator.js';
import { CSSVariablesGenerator } from './css-variables-generator.js';

/**
 * Generates CSS content for Vue projects
 */
export class CSSGenerator {
  /**
   * Generate main CSS
   * @param {ProjectConfig} _config - Project configuration (unused)
   * @returns {string} CSS content
   */
  static generateMainCSS(_config: ProjectConfig): string {
    const cssVariables = CSSVariablesGenerator.getCSSVariables();
    const baseStyles = CSSStylesGenerator.getBaseStyles();
    const componentStyles = CSSStylesGenerator.getComponentStyles();
    const utilityClasses = CSSStylesGenerator.getUtilityClasses();

    return `${cssVariables}

${baseStyles}

${componentStyles}

${utilityClasses}`;
  }
}
