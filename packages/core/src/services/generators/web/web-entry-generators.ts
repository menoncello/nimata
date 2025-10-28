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
   * @param config - Project configuration
   * @returns Main entry file code
   */
  generateMainEntry(config: ProjectConfig): string {
    return generateMainEntry(config);
  }

  /**
   * Generate application types
   * @param config - Project configuration
   * @returns Application types code
   */
  generateAppTypes(config: ProjectConfig): string {
    return generateAppTypes(config);
  }

  /**
   * Generate DOM utilities
   * @param config - Project configuration
   * @returns DOM utilities code
   */
  generateDOMUtils(config: ProjectConfig): string {
    return generateDOMUtils(config);
  }
}
