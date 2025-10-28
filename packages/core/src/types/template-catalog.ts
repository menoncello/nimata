/**
 * Template Catalog Types
 *
 * Type definitions for template catalog management, discovery, and registry
 */

import type { ProjectType, ProjectQualityLevel } from './project-config.js';

/**
 * Template metadata for catalog management
 */
export interface TemplateMetadata {
  /**
   * Unique template identifier
   */
  id: string;

  /**
   * Template display name
   */
  name: string;

  /**
   * Template description
   */
  description: string;

  /**
   * Template version
   */
  version: string;

  /**
   * Author/creator of the template
   */
  author?: string;

  /**
   * Tags for categorization and search
   */
  tags: string[];

  /**
   * Supported project types
   */
  supportedProjectTypes: ProjectType[];

  /**
   * Recommended quality levels
   */
  recommendedQualityLevels: ProjectQualityLevel[];

  /**
   * Template category (e.g., "web", "cli", "library")
   */
  category: string;

  /**
   * File path relative to templates directory
   */
  filePath: string;

  /**
   * Template file size in bytes
   */
  size: number;

  /**
   * Last modification timestamp
   */
  lastModified: Date;

  /**
   * Template dependencies (other templates or resources)
   */
  dependencies: string[];

  /**
   * Template features
   */
  features: TemplateFeature[];

  /**
   * Validation status
   */
  validation: TemplateValidationResult;

  /**
   * Usage statistics
   */
  usageStats: TemplateUsageStats;

  /**
   * Custom metadata
   */
  metadata: Record<string, unknown>;
}

/**
 * Template feature descriptions
 */
export interface TemplateFeature {
  /**
   * Feature identifier
   */
  id: string;

  /**
   * Feature name
   */
  name: string;

  /**
   * Feature description
   */
  description: string;

  /**
   * Whether the feature is enabled by default
   */
  enabled: boolean;

  /**
   * Feature category
   */
  category: 'core' | 'optional' | 'experimental';
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  /**
   * Whether the template is valid
   */
  valid: boolean;

  /**
   * Validation errors
   */
  errors: TemplateValidationError[];

  /**
   * Validation warnings
   */
  warnings: TemplateValidationWarning[];

  /**
   * Validation timestamp
   */
  timestamp: Date;

  /**
   * Validator used
   */
  validator: string;
}

/**
 * Template validation error
 */
export interface TemplateValidationError {
  /**
   * Error code
   */
  code: string;

  /**
   * Error message
   */
  message: string;

  /**
   * File path where error occurred
   */
  filePath?: string;

  /**
   * Line number where error occurred
   */
  line?: number;

  /**
   * Column number where error occurred
   */
  column?: number;

  /**
   * Error severity
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Context information
   */
  context?: Record<string, unknown>;
}

/**
 * Template validation warning
 */
export interface TemplateValidationWarning {
  /**
   * Warning code
   */
  code: string;

  /**
   * Warning message
   */
  message: string;

  /**
   * Warning category
   */
  category: 'performance' | 'compatibility' | 'best-practice' | 'deprecation';

  /**
   * Suggestion for fixing the warning
   */
  suggestion?: string;
}

/**
 * Template usage statistics
 */
export interface TemplateUsageStats {
  /**
   * Number of times template has been used
   */
  usageCount: number;

  /**
   * Last usage timestamp
   */
  lastUsed?: Date;

  /**
   * Average usage success rate
   */
  successRate: number;

  /**
   * Average rendering time in milliseconds
   */
  averageRenderTime: number;

  /**
   * Popular project types using this template
   */
  popularProjectTypes: Array<{
    type: ProjectType;
    count: number;
  }>;

  /**
   * Popular quality levels using this template
   */
  popularQualityLevels: Array<{
    level: ProjectQualityLevel;
    count: number;
  }>;
}

/**
 * Template catalog configuration
 */
export interface TemplateCatalogConfig {
  /**
   * Base directory for templates
   */
  templatesDirectory: string;

  /**
   * Template sources configuration
   */
  sources?: Array<{
    name: string;
    path: string;
    enabled: boolean;
    priority?: number;
  }>;

  /**
   * Whether to auto-discover templates
   */
  autoDiscovery: boolean;

  /**
   * Template discovery patterns
   */
  discoveryPatterns: string[];

  /**
   * Validation rules to apply
   */
  validationRules: TemplateValidationRule[];

  /**
   * Cache configuration
   */
  cache: {
    enabled: boolean;
    ttl: number; // Time to live in seconds
    maxSize: number; // Maximum number of cached templates
  };

  /**
   * Extensibility configuration for new tech stacks
   */
  extensibility: {
    enabled: boolean;
    autoRegisterNewTypes: boolean;
    customValidators: string[];
  };
}

/**
 * Template validation rule
 */
export interface TemplateValidationRule {
  /**
   * Rule identifier
   */
  id: string;

  /**
   * Rule name
   */
  name: string;

  /**
   * Rule description
   */
  description: string;

  /**
   * Rule function to validate template
   */
  validator: (template: TemplateMetadata, content: string) => TemplateValidationResult;

  /**
   * Rule severity
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Rule category
   */
  category: 'structure' | 'content' | 'performance' | 'security';

  /**
   * Whether the rule is enabled
   */
  enabled: boolean;
}

/**
 * Template search filter
 */
export interface TemplateSearchFilter {
  /**
   * Search query
   */
  query?: string;

  /**
   * Tags to filter by
   */
  tags?: string[];

  /**
   * Project types to filter by
   */
  projectTypes?: ProjectType[];

  /**
   * Quality levels to filter by
   */
  qualityLevels?: ProjectQualityLevel[];

  /**
   * Category to filter by (single category for backward compatibility)
   */
  category?: string;

  /**
   * Categories to filter by
   */
  categories?: string[];

  /**
   * Features to filter by
   */
  features?: string[];

  /**
   * Author to filter by (single author for backward compatibility)
   */
  author?: string;

  /**
   * Authors to filter by
   */
  authors?: string[];

  /**
   * Date range to filter by
   */
  dateRange?: {
    from?: Date;
    to?: Date;
  };

  /**
   * Sort by field
   */
  sortBy?: 'name' | 'version' | 'lastModified' | 'usageCount' | 'popularity';

  /**
   * Sort order
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Maximum number of results
   */
  limit?: number;

  /**
   * Offset for pagination
   */
  offset?: number;
}

/**
 * Template search result
 */
export interface TemplateSearchResult {
  /**
   * Array of matching templates
   */
  templates: TemplateMetadata[];

  /**
   * Total number of matching templates
   */
  total: number;

  /**
   * Total count of all templates (including filtered out)
   */
  totalCount: number;

  /**
   * Whether there are more results available
   */
  hasMore: boolean;

  /**
   * Search filters applied
   */
  filters: TemplateSearchFilter;

  /**
   * Search execution time in milliseconds
   */
  executionTime: number;

  /**
   * Search facets (available filter options)
   */
  facets: {
    tags: Array<{ tag: string; count: number }>;
    projectTypes: Array<{ type: ProjectType; count: number }>;
    qualityLevels: Array<{ level: ProjectQualityLevel; count: number }>;
    categories: Array<{ category: string; count: number }>;
    features: Array<{ feature: string; count: number }>;
    authors: Array<{ author: string; count: number }>;
  };
}

/**
 * Template registry interface
 */
export interface TemplateRegistry {
  /**
   * Register a template in the catalog
   */
  register: (template: TemplateMetadata) => Promise<void>;

  /**
   * Unregister a template from the catalog
   */
  unregister: (templateId: string) => Promise<void>;

  /**
   * Get template by ID
   */
  get: (templateId: string) => Promise<TemplateMetadata | null>;

  /**
   * Get all templates
   */
  getAll: () => Promise<TemplateMetadata[]>;

  /**
   * Search templates
   */
  search: (filter: TemplateSearchFilter) => Promise<TemplateSearchResult>;

  /**
   * Get templates by project type
   */
  getByProjectType: (projectType: ProjectType) => Promise<TemplateMetadata[]>;

  /**
   * Get templates by category
   */
  getByCategory: (category: string) => Promise<TemplateMetadata[]>;

  /**
   * Get popular templates
   */
  getPopular: (limit?: number) => Promise<TemplateMetadata[]>;

  /**
   * Get recently updated templates
   */
  getRecentlyUpdated: (limit?: number) => Promise<TemplateMetadata[]>;

  /**
   * Validate template
   */
  validate: (templateId: string) => Promise<TemplateValidationResult>;

  /**
   * Update template metadata
   */
  updateMetadata: (templateId: string, metadata: Partial<TemplateMetadata>) => Promise<void>;

  /**
   * Record template usage
   */
  recordUsage: (usageData: {
    templateId: string;
    projectType: ProjectType;
    qualityLevel: ProjectQualityLevel;
    renderTime: number;
    success: boolean;
  }) => Promise<void>;
}

/**
 * Template discovery interface
 */
export interface TemplateDiscovery {
  /**
   * Discover templates from file system
   */
  discover: (directory: string) => Promise<TemplateMetadata[]>;

  /**
   * Scan for new or modified templates
   */
  scan: (directory: string) => Promise<{
    newTemplates: TemplateMetadata[];
    modifiedTemplates: TemplateMetadata[];
    deletedTemplates: string[];
  }>;

  /**
   * Watch for template changes
   */
  watch: (
    directory: string,
    callback: (event: 'added' | 'modified' | 'deleted', template: TemplateMetadata) => void
  ) => () => void;

  /**
   * Index templates for fast search
   */
  index: (templates: TemplateMetadata[]) => Promise<void>;
}

/**
 * Template cache interface
 */
export interface TemplateCache {
  /**
   * Get template from cache
   */
  get: (key: string) => Promise<TemplateMetadata | null>;

  /**
   * Set template in cache
   */
  set: (key: string, template: TemplateMetadata, ttl?: number) => Promise<void>;

  /**
   * Delete template from cache
   */
  delete: (key: string) => Promise<void>;

  /**
   * Clear cache
   */
  clear: () => Promise<void>;

  /**
   * Get cache statistics
   */
  getStats: () => Promise<{
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
  }>;
}

/**
 * Template catalog manager
 */
export interface TemplateCatalogManager {
  /**
   * Initialize the catalog
   */
  initialize: (config: TemplateCatalogConfig) => Promise<void>;

  /**
   * Get template registry
   */
  getRegistry: () => TemplateRegistry;

  /**
   * Get template discovery
   */
  getDiscovery: () => TemplateDiscovery;

  /**
   * Get template cache
   */
  getCache: () => TemplateCache;

  /**
   * Get catalog configuration
   */
  getConfig: () => TemplateCatalogConfig;

  /**
   * Reload catalog
   */
  reload: () => Promise<void>;

  /**
   * Shutdown catalog
   */
  shutdown: () => Promise<void>;
}

/**
 * Extensible architecture for new tech stacks
 */
export interface TechStackRegistry {
  /**
   * Register a new tech stack
   */
  registerTechStack: (techStack: TechStackDefinition) => Promise<void>;

  /**
   * Get registered tech stacks
   */
  getTechStacks: () => Promise<TechStackDefinition[]>;

  /**
   * Get tech stack by ID
   */
  getTechStack: (techStackId: string) => Promise<TechStackDefinition | null>;

  /**
   * Get templates for tech stack
   */
  getTemplatesForTechStack: (techStackId: string) => Promise<TemplateMetadata[]>;

  /**
   * Validate tech stack configuration
   */
  validateTechStack: (techStack: TechStackDefinition) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
}

/**
 * Tech stack definition
 */
export interface TechStackDefinition {
  /**
   * Tech stack ID
   */
  id: string;

  /**
   * Tech stack name
   */
  name: string;

  /**
   * Tech stack description
   */
  description: string;

  /**
   * Tech stack version
   */
  version: string;

  /**
   * Supported project types
   */
  supportedProjectTypes: ProjectType[];

  /**
   * Required dependencies
   */
  dependencies: TechStackDependency[];

  /**
   * Template patterns for this tech stack
   */
  templatePatterns: string[];

  /**
   * Validation rules specific to this tech stack
   */
  validationRules: TemplateValidationRule[];

  /**
   * Configuration schema
   */
  configurationSchema: Record<string, unknown>;

  /**
   * Default configuration values
   */
  defaultConfiguration: Record<string, unknown>;

  /**
   * Metadata
   */
  metadata: Record<string, unknown>;
}

/**
 * Tech stack dependency
 */
export interface TechStackDependency {
  /**
   * Dependency name
   */
  name: string;

  /**
   * Dependency version (semver)
   */
  version: string;

  /**
   * Whether dependency is required
   */
  required: boolean;

  /**
   * Dependency type
   */
  type: 'runtime' | 'devDependency' | 'peerDependency' | 'template';

  /**
   * Alternative dependencies
   */
  alternatives: string[];
}
