/**
 * Testing Configuration Generators
 *
 * Generates Vitest configuration and sample test files
 */

import { JSON_SERIALIZATION } from '../../utils/constants.js';
import { COVERAGE_THRESHOLDS } from '../config-constants.js';
import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * Testing Configuration Generators Class
 */
export class TestingConfigGenerators {
  /**
   * Generate Vitest configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Vitest configuration content
   */
  generateVitestConfig(config: ProjectConfig): string {
    const coverageThreshold = this.getCoverageThreshold(config.qualityLevel);
    const testConfig = this.getVitestTestConfig(coverageThreshold);
    const resolveConfig = this.getVitestResolveConfig();

    return this.buildVitestConfigString(testConfig, resolveConfig);
  }

  /**
   * Generate sample test file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Sample test file content
   */
  generateSampleTest(config: ProjectConfig): string {
    return `
import { describe, it, expect } from 'vitest';

describe('${config.name}', () => {
  it('should pass sample test', () => {
    expect(true).toBe(true);
  });
});
`.trim();
  }

  /**
   * Get coverage threshold based on quality level
   * @param {string} qualityLevel - Project quality level
   * @returns {number} Coverage threshold value
   */
  private getCoverageThreshold(qualityLevel: string): number {
    if (qualityLevel === 'light') {
      return COVERAGE_THRESHOLDS.LIGHT;
    }
    if (qualityLevel === 'medium') {
      return COVERAGE_THRESHOLDS.MEDIUM;
    }
    return COVERAGE_THRESHOLDS.STRICT;
  }

  /**
   * Get Vitest test configuration
   * @param {number} coverageThreshold - Coverage threshold value
   * @returns {Record<string, unknown>} Vitest test configuration object
   */
  private getVitestTestConfig(coverageThreshold: number): Record<string, unknown> {
    return {
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*'],
        thresholds: {
          global: {
            branches: coverageThreshold,
            functions: coverageThreshold,
            lines: coverageThreshold,
            statements: coverageThreshold,
          },
        },
      },
    };
  }

  /**
   * Get Vitest resolve configuration
   * @returns {Record<string, unknown>} Vitest resolve configuration object
   */
  private getVitestResolveConfig(): Record<string, unknown> {
    return {
      alias: {
        '@': "path.resolve(__dirname, './src')",
      },
    };
  }

  /**
   * Build Vitest configuration string
   * @param {Record<string} testConfig - Test configuration object
   * @param {Record<string} resolveConfig - Resolve configuration object
   * @returns {string} Vitest configuration string
   */
  private buildVitestConfigString(
    testConfig: Record<string, unknown>,
    resolveConfig: Record<string, unknown>
  ): string {
    return `
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: ${JSON.stringify(testConfig, null, JSON_SERIALIZATION.PRETTY_INDENT)},
  resolve: ${JSON.stringify(resolveConfig, null, JSON_SERIALIZATION.PRETTY_INDENT)},
});
`.trim();
  }
}
