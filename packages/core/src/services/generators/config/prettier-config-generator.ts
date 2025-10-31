/**
 * Prettier Configuration Generator
 */

import { JSON_INDENTATION } from './constants.js';

/**
 * Prettier configuration generator
 */
export class PrettierConfigGenerator {
  /**
   * Build Prettier options
   * @returns {Record<string, unknown>} Prettier configuration object
   */
  private static buildPrettierOptions(): Record<string, unknown> {
    return {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 100,
      tabWidth: JSON_INDENTATION,
      useTabs: false,
    };
  }

  /**
   * Generate Prettier configuration
   * @returns {string} Prettier config JSON
   */
  static generatePrettierConfig(): string {
    const config = this.buildPrettierOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }

  /**
   * Generate Prettier configuration (instance method for backward compatibility)
   * @returns {string} Prettier config JSON
   */
  generate(): string {
    return PrettierConfigGenerator.generatePrettierConfig();
  }
}
