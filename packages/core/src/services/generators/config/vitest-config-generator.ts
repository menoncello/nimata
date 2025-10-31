/**
 * Vitest Configuration Generator
 */

/**
 * Vitest configuration generator
 */
export class VitestConfigGenerator {
  /**
   * Generate Vitest configuration
   * @returns {string} Vitest config TypeScript code
   */
  static generateVitestConfig(): string {
    return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    }
  }
});`;
  }

  /**
   * Generate Vitest configuration (instance method for backward compatibility)
   * @returns {string} Vitest config TypeScript code
   */
  generate(): string {
    return VitestConfigGenerator.generateVitestConfig();
  }
}
