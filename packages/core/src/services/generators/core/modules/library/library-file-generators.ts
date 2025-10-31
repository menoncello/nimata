/**
 * Library Project File Generators
 *
 * Generates library-specific files and content
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { DirectoryItem } from '../../file-operations/types.js';

/**
 * Handles library-specific file generation
 */
export class LibraryFileGenerators {
  /**
   * Generate library-specific core files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Library-specific core files
   */
  static generateLibraryCoreFiles(config: ProjectConfig): DirectoryItem[] {
    const fileGenerators = LibraryFileGenerators.getLibraryFileGenerators(config);

    return fileGenerators.map((generator) => generator());
  }

  /**
   * Get main library file generators
   * @param {ProjectConfig} config - Project configuration
   * @returns {Array<() => DirectoryItem>} Main file generator functions
   */
  private static getMainLibraryFileGenerators(config: ProjectConfig): Array<() => DirectoryItem> {
    return [
      () => ({
        path: 'src/index.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryMainExport(config),
      }),
      () => ({
        path: 'src/lib/index.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryMainExport(config),
      }),
      () => ({
        path: 'src/lib/core.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryCoreModule(config),
      }),
    ];
  }

  /**
   * Get utility library file generators
   * @param {ProjectConfig} config - Project configuration
   * @returns {Array<() => DirectoryItem>} Utility file generator functions
   */
  private static getUtilityLibraryFileGenerators(
    config: ProjectConfig
  ): Array<() => DirectoryItem> {
    return [
      () => ({
        path: 'src/types/index.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryTypeExports(config),
      }),
      () => ({
        path: 'src/lib/utils/index.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryUtilsExports(config),
      }),
      () => ({
        path: 'src/lib/constants/index.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryConstantsExports(config),
      }),
    ];
  }

  /**
   * Get example library file generators
   * @param {ProjectConfig} config - Project configuration
   * @returns {Array<() => DirectoryItem>} Example file generator functions
   */
  private static getExampleLibraryFileGenerators(
    config: ProjectConfig
  ): Array<() => DirectoryItem> {
    return [
      () => ({
        path: 'examples/basic/usage.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryBasicExample(config),
      }),
      () => ({
        path: 'examples/advanced/usage.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryAdvancedExample(config),
      }),
      () => ({
        path: 'benchmarks/performance.test.ts',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryPerformanceBenchmark(config),
      }),
      () => ({
        path: 'docs/api.md',
        type: 'file' as const,
        content: LibraryFileGenerators.generateLibraryAPIDocumentation(config),
      }),
    ];
  }

  /**
   * Get library file generator functions
   * @param {ProjectConfig} config - Project configuration
   * @returns {Array<() => DirectoryItem>} File generator functions
   */
  private static getLibraryFileGenerators(config: ProjectConfig): Array<() => DirectoryItem> {
    return [
      ...LibraryFileGenerators.getMainLibraryFileGenerators(config),
      ...LibraryFileGenerators.getUtilityLibraryFileGenerators(config),
      ...LibraryFileGenerators.getExampleLibraryFileGenerators(config),
    ];
  }

  /**
   * Generate library main export file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main export content
   */
  private static generateLibraryMainExport(config: ProjectConfig): string {
    return `/**
 * ${config.name}
 * ${config.description || 'A modern TypeScript library'}
 */

// Export core functionality
export * from './lib/core.js';

// Export types
export type * from './types/index.js';

// Export utilities
export * from './lib/utils/index.js';

// Export constants
export * from './lib/constants/index.js';
`;
  }

  /**
   * Generate library core module
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Core module content
   */
  private static generateLibraryCoreModule(config: ProjectConfig): string {
    return `/**
 * Core functionality for ${config.name}
 */

// TODO: Implement core library functionality

export function main(): void {
  console.log('${config.name} - Core functionality placeholder');
}

export const VERSION = '1.0.0';
`;
  }

  /**
   * Generate library type exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Type exports content
   */
  private static generateLibraryTypeExports(config: ProjectConfig): string {
    return `/**
 * Type definitions for ${config.name}
 */

// Core types
export interface Config {
  debug?: boolean;
  version?: string;
}

// Function signatures
export interface MainFunction {
  (): void;
}

// Error types
export class LibraryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibraryError';
  }
}
`;
  }

  /**
   * Generate library utility exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Utility exports content
   */
  private static generateLibraryUtilsExports(config: ProjectConfig): string {
    return `/**
 * Utility functions for ${config.name}
 */

export function createLogger(prefix: string) {
  return (message: string, ...args: any[]) => {
    console.log(\`[\${prefix}] \${message}\`, ...args);
  };
}

export function validateInput(input: unknown): boolean {
  return input !== null && input !== undefined;
}
`;
  }

  /**
   * Generate library constants exports
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Constants exports content
   */
  private static generateLibraryConstantsExports(config: ProjectConfig): string {
    return `/**
 * Constants for ${config.name}
 */

export const LIBRARY_NAME = '${config.name}';
export const DEFAULT_CONFIG = {
  debug: false,
  version: '1.0.0',
};

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  MISSING_CONFIG: 'Configuration is required',
} as const;
`;
  }

  /**
   * Generate library basic example
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Basic example content
   */
  private static generateLibraryBasicExample(config: ProjectConfig): string {
    return `/**
 * Basic usage example for ${config.name}
 */

import { main } from '../../src/index.js';

// Basic usage
main();

console.log('Basic example completed successfully');
`;
  }

  /**
   * Generate library advanced example
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Advanced example content
   */
  private static generateLibraryAdvancedExample(config: ProjectConfig): string {
    return `/**
 * Advanced usage example for ${config.name}
 */

import { main, Config } from '../../src/index.js';

// Advanced usage with configuration
const config: Config = {
  debug: true,
};

console.log('Running advanced example with config:', config);
main();

console.log('Advanced example completed successfully');
`;
  }

  /**
   * Generate library performance benchmark
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Performance benchmark content
   */
  private static generateLibraryPerformanceBenchmark(config: ProjectConfig): string {
    return `/**
 * Performance benchmarks for ${config.name}
 */

import { test, describe, expect } from 'bun:test';
import { main } from '../src/index.js';

describe('Performance Benchmarks', () => {
  test('main function performance', () => {
    const startTime = performance.now();

    // Run main function multiple times
    for (let i = 0; i < 1000; i++) {
      main();
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (adjust as needed)
    expect(duration).toBeLessThan(1000);

    console.log(\`Main function completed 1000 iterations in \${duration.toFixed(2)}ms\`);
  });
});
`;
  }

  /**
   * Generate library API documentation
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} API documentation markdown
   */
  private static generateLibraryAPIDocumentation(config: ProjectConfig): string {
    return `# API Documentation

## Overview

${config.description || 'A modern TypeScript library'}

## Installation

\`\`\`bash
npm install ${config.name}
\`\`\`

## Usage

\`\`\`typescript
import { main } from '${config.name}';

// TODO: Add usage examples
\`\`\`

## API Reference

### Functions

\`\`\`typescript
// TODO: Add function documentation
\`\`\`

## Contributing

Please see the main README.md for contribution guidelines.

## License

${config.license || 'MIT'}
`;
  }
}
