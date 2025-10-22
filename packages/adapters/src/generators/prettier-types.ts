/**
 * Prettier Generator Types
 *
 * Type definitions for Prettier configuration generation
 */

export interface PrettierConfigOptions {
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  targetEnvironment: 'node' | 'browser' | 'both';
  enableTypeScript: boolean;
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  printWidth: number;
}

export interface GeneratedPrettierConfig {
  filename: string;
  content: string;
  description: string;
}
