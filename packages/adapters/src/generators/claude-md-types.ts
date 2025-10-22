/**
 * CLAUDE.md Generator Types
 *
 * Type definitions for CLAUDE.md configuration generation
 */

export type QualityLevel = 'light' | 'medium' | 'strict';
export type ProjectType = 'basic' | 'web' | 'cli' | 'library';
export type AIAssistant = 'claude-code' | 'copilot';

export interface CodeStyleConfig {
  indentSize: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  printWidth: number;
  [key: string]: unknown;
}

export interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
}

export interface ClaudeMdConfigOptions {
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  enableTypeScript: boolean;
  enableTesting: boolean;
  codeStyle: CodeStyleConfig;
  customSections?: Record<string, string>;
}

export interface GeneratedClaudeMdConfig {
  filename: string;
  content: string;
  description: string;
}
