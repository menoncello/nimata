/**
 * Tech Stack Types and Interfaces
 *
 * Type definitions for tech stack registry system
 */
import type {
  TechStackRegistry as ITechStackRegistry,
  TechStackDefinition,
  TemplateMetadata,
  TemplateValidationRule,
  ProjectType,
} from '@nimata/core';

/**
 * Tech stack configuration schema
 */
export interface TechStackConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  supportedProjectTypes: ProjectType[];
  dependencies: TechStackDependency[];
  templatePatterns: string[];
  validationRules: TemplateValidationRule[];
  configurationSchema: Record<string, unknown>;
  defaultConfiguration: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

/**
 * Tech stack dependency definition
 */
export interface TechStackDependency {
  name: string;
  version: string;
  required: boolean;
  type: 'runtime' | 'devDependency' | 'peerDependency' | 'template';
  compatibility?: string[];
  description?: string;
  alternatives?: string[];
}

/**
 * Tech stack metadata
 */
export interface TechStackMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  downloadCount: number;
  rating: number;
  popularity: number;
}

/**
 * Tech stack search result
 */
export interface TechStackSearchResult {
  stacks: TechStackMetadata[];
  total: number;
  query: string;
  filters: {
    projectTypes?: ProjectType[];
    categories?: string[];
    tags?: string[];
  };
  executionTime: number;
}

/**
 * Tech stack validation result
 */
export interface TechStackValidationResult {
  valid: boolean;
  errors: Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: Record<string, unknown>;
  }>;
  warnings: Array<{
    code: string;
    message: string;
    category: 'compatibility' | 'best-practice' | 'deprecation';
    suggestion?: string;
  }>;
  timestamp: Date;
  validator: string;
}

/**
 * Tech stack registry statistics
 */
export interface TechStackRegistryStats {
  totalStacks: number;
  categories: number;
  projectTypes: number;
  tags: number;
  averageRating: number;
  totalDownloads: number;
  lastUpdated: Date;
}

// Re-export core types for convenience
export type {
  ITechStackRegistry,
  TechStackDefinition,
  TemplateMetadata,
  TemplateValidationRule,
  ProjectType,
};
