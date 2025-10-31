/**
 * CI Configuration Generator
 *
 * Generates CI configuration files
 */
import type { ProjectConfig } from '../../../../../src/types/project-config.js';

/**
 * Constants for configuration formatting
 */

/**
 * CI configuration generator class
 */
export class CIConfigGenerator {
  /**
   * Generate CI configuration
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CI configuration content
   */
  static generateCIConfig(config: ProjectConfig): string {
    return [
      CIConfigGenerator.generateCIHeader(config),
      CIConfigGenerator.generateCIJobs(),
      CIConfigGenerator.generateCIFooter(),
    ].join('\n\n');
  }

  /**
   * Generate CI configuration header
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} CI header configuration
   */
  private static generateCIHeader(_config: ProjectConfig): string {
    return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:`;
  }

  /**
   * Generate CI jobs configuration
   * @returns {string} CI jobs configuration
   */
  private static generateCIJobs(): string {
    return `  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}

    - name: Install Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest

    - name: Install dependencies
      run: bun install

    - name: Run tests
      run: bunx turbo test

    - name: Run linting
      run: bunx turbo lint

    - name: Build project
      run: bunx turbo build`;
  }

  /**
   * Generate CI configuration footer
   * @returns {string} CI footer configuration
   */
  private static generateCIFooter(): string {
    return `  code-quality:
    runs-on: ubuntu-latest
    needs: test

    steps:
    - uses: actions/checkout@v4

    - name: Install Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest

    - name: Install dependencies
      run: bun install

    - name: Run mutation testing
      run: bunx stryker run

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info`;
  }
}
