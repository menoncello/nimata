/**
 * Copilot Generator Types
 *
 * Type definitions for Copilot configuration generation
 */

export type QualityLevel = 'light' | 'medium' | 'strict';
export type ProjectType = 'basic' | 'web' | 'cli' | 'library';
export type AIAssistant = 'claude-code' | 'copilot';

export interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
}

export interface CopilotConfigOptions {
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  targetEnvironment: 'node' | 'browser' | 'both';
  projectName: string;
  projectDescription?: string;
  codeStyle: Record<string, unknown>;
  testing: boolean;
  frameworks: string[];
}

export interface GeneratedCopilotConfig {
  filename: string;
  content: string;
  description: string;
}
