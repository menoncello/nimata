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
   * @param config - Project configuration
   * @returns HTML template content
   */
  static generateHtmlTemplate(config: ProjectConfig): string {
    return HTMLGenerator.generateHtmlTemplate(config);
  }

  /**
   * Generate Vite config for Vue
   * @param config - Project configuration
   * @returns Vite configuration TypeScript code
   */
  static generateViteConfig(config: ProjectConfig): string {
    return ViteConfigGenerator.generateViteConfig(config);
  }

  /**
   * Generate main CSS
   * @param config - Project configuration
   * @returns CSS content
   */
  static generateMainCSS(config: ProjectConfig): string {
    return CSSGenerator.generateMainCSS(config);
  }
}
