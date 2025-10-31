/**
 * Web Entry and Utility Generators
 *
 * Generates main entry files and utility modules for web projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { generateAppTypes } from './modules/app-types-generator.js';
import { generateDOMUtils } from './modules/dom-utils-generator.js';
import { generateMainEntry } from './modules/main-entry-generator.js';

/**
 * Web Entry and Utility Generators
 *
 * Generates main entry files and utility modules for web projects
 */
export class WebEntryGenerators {
  /**
   * Generate main React entry file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main entry file code
   */
  generateMainEntry(config: ProjectConfig): string {
    return generateMainEntry(config);
  }

  /**
   * Generate application types
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Application types code
   */
  generateAppTypes(config: ProjectConfig): string {
    return generateAppTypes(config);
  }

  /**
   * Generate DOM utilities
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} DOM utilities code
   */
  generateDOMUtils(config: ProjectConfig): string {
    return generateDOMUtils(config);
  }
}
