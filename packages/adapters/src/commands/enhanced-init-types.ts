/**
 * Enhanced Init Command Types
 *
 * Type definitions for the enhanced init command
 */

// Type aliases for union types
export type QualityLevel = 'light' | 'medium' | 'strict';
export type ProjectType = 'basic' | 'web' | 'cli' | 'library';
export type AIAssistant = 'claude-code' | 'copilot';

// Inline type to avoid import issues
export interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
}

export interface EnhancedInitCommandOptions {
  interactive?: boolean;
  template?: string;
  quality?: string;
  ai?: string;
  directory?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
  verbose?: boolean;
  help?: boolean;
  description?: string;
  projectType?: string;
}
