/**
 * Vue Configuration Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { CSSGenerator } from './css-generator.js';
import { HTMLGenerator } from './html-generator.js';
import { ViteConfigGenerator } from './vite-config-generator.js';

/**
 * Generates Vue configuration file content
 */
export class VueConfigGenerators {
  /**
   * Generate HTML template
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} HTML template content
   */
  static generateHtmlTemplate(config: ProjectConfig): string {
    return HTMLGenerator.generateHtmlTemplate(config);
  }

  /**
   * Generate Vite config for Vue
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Vite configuration TypeScript code
   */
  static generateViteConfig(config: ProjectConfig): string {
    return ViteConfigGenerator.generateViteConfig(config);
  }

  /**
   * Generate main CSS
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CSS content
   */
  static generateMainCSS(config: ProjectConfig): string {
    return CSSGenerator.generateMainCSS(config);
  }
}
