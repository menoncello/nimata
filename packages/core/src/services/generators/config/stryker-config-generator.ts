/**
 * Stryker Configuration Generator
 */

import { JSON_INDENTATION } from './constants.js';

/**
 * Stryker configuration generator
 */
export class StrykerConfigGenerator {
  /**
   * Build Stryker options
   * @returns {Record<string, unknown>} Stryker configuration object
   */
  private static buildStrykerOptions(): Record<string, unknown> {
    return {
      _comment: 'This config was generated using stryker config init',
      $schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
      testRunner: 'vitest',
      coverageAnalysis: 'perTest',
      reporters: ['progress', 'clear-text', 'html'],
      thresholds: {
        high: 80,
        low: 60,
      },
    };
  }

  /**
   * Generate Stryker configuration
   * @returns {string} Stryker config JSON
   */
  static generateStrykerConfig(): string {
    const config = this.buildStrykerOptions();
    return JSON.stringify(config, null, JSON_INDENTATION);
  }

  /**
   * Generate Stryker configuration (instance method for backward compatibility)
   * @returns {string} Stryker config JSON
   */
  generate(): string {
    return StrykerConfigGenerator.generateStrykerConfig();
  }
}
