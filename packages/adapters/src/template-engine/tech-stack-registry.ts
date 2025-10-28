/**
 * Tech Stack Registry Implementation
 *
 * Extensible architecture for managing and registering new tech stacks
 */
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  TechStackRegistry as ITechStackRegistry,
  TechStackDefinition,
  ProjectType,
  TemplateMetadata,
} from '@nimata/core';
import type {
  TechStackAdapters,
  TemplateEngineAdapter,
  BuildSystemAdapter,
  PackageManagerAdapter,
} from './tech-stack-interfaces.js';
import {
  applyTextSearch,
  applyFilters,
  sortResults,
  createSearchResults,
} from './tech-stack-search-utils.js';
import type {
  TechStackSearchResult,
  TechStackValidationResult,
  TechStackRegistryStats,
  TechStackConfig,
} from './tech-stack-types.js';
import {
  TECH_STACK_REGISTRY_CONSTANTS,
  validateTechStackConfig,
  normalizeTechStackDependency,
  createSafeTechStackId,
} from './tech-stack-utils.js';
import {
  validateBasicProperties,
  validateRecommendedProperties,
  validateConfiguration,
  createValidationResult,
} from './tech-stack-validation-utils.js';
import { BUILTIN_TECH_STACK_CREATORS } from './tech-stacks/builtin-stacks.js';

/**
 * Tech stack registry implementation
 */
export class TechStackRegistry implements ITechStackRegistry {
  private techStacks = new Map<string, TechStackDefinition>();
  private adapters = new Map<string, TechStackAdapters>();
  private configDirectory: string;
  private autoRegister: boolean;

  /**
   * Creates a new tech stack registry instance
   * @param configDirectory - Directory containing tech stack configurations
   * @param autoRegister - Whether to automatically register built-in tech stacks
   */
  constructor(configDirectory?: string, autoRegister = true) {
    this.configDirectory = configDirectory || './tech-stacks';
    this.autoRegister = autoRegister;

    if (this.autoRegister) {
      this.registerBuiltinTechStacks();
    }
  }

  /**
   * Register a new tech stack
   * @param techStack - Tech stack definition to register
   */
  async register(techStack: TechStackDefinition): Promise<void> {
    if (!techStack.id) {
      throw new Error('Tech stack must have an ID');
    }

    const normalizedTechStack = this.normalizeTechStackDefinition(techStack);

    if (!validateTechStackConfig(normalizedTechStack as TechStackDefinition)) {
      throw new Error(`Invalid tech stack configuration: ${techStack.id}`);
    }

    this.techStacks.set(techStack.id, normalizedTechStack);

    // Save to file system if directory exists
    if (this.configDirectory && fsSync.existsSync(this.configDirectory)) {
      await this.saveTechStackToFile(techStack);
    }
  }

  /**
   * Unregister a tech stack
   * @param techStackId - ID of tech stack to unregister
   */
  async unregister(techStackId: string): Promise<void> {
    if (!this.techStacks.has(techStackId)) {
      throw new Error(`Tech stack not found: ${techStackId}`);
    }

    this.techStacks.delete(techStackId);

    // Remove from file system
    const filePath = path.join(this.configDirectory, `${techStackId}.json`);
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  }

  /**
   * Get tech stack by ID
   * @param techStackId - ID of tech stack to retrieve
   * @returns Tech stack definition or null if not found
   */
  async get(techStackId: string): Promise<TechStackDefinition | null> {
    return this.techStacks.get(techStackId) || null;
  }

  /**
   * Get all registered tech stacks
   * @returns Array of all tech stack definitions
   */
  async getAll(): Promise<TechStackDefinition[]> {
    return Array.from(this.techStacks.values());
  }

  /**
   * Search tech stacks by criteria
   * @param query - Search query
   * @param filters - Optional filters to apply
   * @param filters.projectTypes - Filter by project types
   * @param filters.categories - Filter by categories
   * @param filters.tags - Filter by tags
   * @returns Search results
   */
  async search(
    query: string,
    filters?: {
      projectTypes?: ProjectType[];
      categories?: string[];
      tags?: string[];
    }
  ): Promise<TechStackSearchResult> {
    const startTime = Date.now();
    let results = Array.from(this.techStacks.values());

    results = applyTextSearch(results, query);
    results = applyFilters(results, filters);
    results = sortResults(results);

    const executionTime = Date.now() - startTime;

    return createSearchResults(results, query, filters || {}, executionTime);
  }

  /**
   * Get tech stacks by project type
   * @param projectType - Project type to filter by
   * @returns Array of tech stacks supporting the project type
   */
  async getByProjectType(projectType: ProjectType): Promise<TechStackDefinition[]> {
    return Array.from(this.techStacks.values()).filter((stack) =>
      stack.supportedProjectTypes.includes(projectType)
    );
  }

  /**
   * Validate tech stack configuration
   * @param techStack - Tech stack to validate
   * @returns Validation result
   */
  async validate(techStack: TechStackDefinition): Promise<TechStackValidationResult> {
    const errors = validateBasicProperties(techStack);
    const warnings = validateRecommendedProperties(techStack);
    const configErrors = validateConfiguration(techStack);

    const allErrors = [...errors, ...configErrors];

    return createValidationResult(allErrors, warnings);
  }

  /**
   * Validates basic required properties
   * @param techStack - Tech stack to validate
   * @returns Array of validation errors
   */
  private validateBasicProperties(techStack: TechStackDefinition): Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: Record<string, unknown>;
  }> {
    const errors = [];

    if (!techStack.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Tech stack must have an ID',
        severity: 'error',
      });
    }

    if (!techStack.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Tech stack must have a name',
        severity: 'error',
      });
    }

    if (!techStack.version) {
      errors.push({
        code: 'MISSING_VERSION',
        message: 'Tech stack must have a version',
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Validates recommended properties
   * @param techStack - Tech stack to validate
   * @returns Array of validation warnings
   */
  private validateRecommendedProperties(techStack: TechStackDefinition): Array<{
    code: string;
    message: string;
    category: 'compatibility' | 'best-practice' | 'deprecation';
    suggestion?: string;
  }> {
    const warnings = [];

    if (!techStack.supportedProjectTypes?.length) {
      warnings.push({
        code: 'NO_PROJECT_TYPES',
        message: 'Tech stack should specify supported project types',
        category: 'best-practice',
        suggestion: 'Add supported project types to improve discoverability',
      });
    }

    return warnings;
  }

  /**
   * Validates tech stack configuration
   * @param techStack - Tech stack to validate
   * @returns Array of validation errors
   */
  private validateConfiguration(techStack: TechStackDefinition): Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: Record<string, unknown>;
  }> {
    const errors = [];

    if (!validateTechStackConfig(techStack as TechStackDefinition)) {
      errors.push({
        code: 'INVALID_CONFIG',
        message: 'Tech stack configuration is invalid',
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Register built-in tech stacks
   */
  private registerBuiltinTechStacks(): void {
    for (const creator of BUILTIN_TECH_STACK_CREATORS) {
      try {
        const techStack = creator();
        this.techStacks.set(techStack.id, techStack as TechStackDefinition);
      } catch (error) {
        console.warn(`Failed to register built-in tech stack:`, error);
      }
    }
  }

  /**
   * Normalize tech stack definition
   * @param techStack - Tech stack to normalize
   * @returns Normalized tech stack definition
   */
  private normalizeTechStackDefinition(techStack: TechStackDefinition): TechStackDefinition {
    return {
      ...techStack,
      id: techStack.id || createSafeTechStackId(techStack.name),
      version: techStack.version || '1.0.0',
      supportedProjectTypes: techStack.supportedProjectTypes || [],
      dependencies:
        techStack.dependencies?.map((dep) => ({
          ...normalizeTechStackDependency(dep),
          alternatives: dep.alternatives || [],
        })) || [],
    };
  }

  /**
   * Save tech stack to file
   * @param techStack - Tech stack to save
   */
  private async saveTechStackToFile(techStack: TechStackDefinition): Promise<void> {
    const filePath = path.join(this.configDirectory, `${techStack.id}.json`);
    const content = JSON.stringify(techStack, null, TECH_STACK_REGISTRY_CONSTANTS.JSON_INDENTATION);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Register adapter for tech stack
   * @param techStackId - Tech stack ID
   * @param adapter - Adapter to register
   * @param adapter.templateEngine - Template engine adapter
   * @param adapter.buildSystem - Build system adapter
   * @param adapter.packageManager - Package manager adapter
   */
  registerAdapter(
    techStackId: string,
    adapter: {
      templateEngine?: TemplateEngineAdapter;
      buildSystem?: BuildSystemAdapter;
      packageManager?: PackageManagerAdapter;
    }
  ): void {
    this.adapters.set(techStackId, adapter);
  }

  /**
   * Get adapter for tech stack
   * @param techStackId - Tech stack ID
   * @returns Registered adapter or null
   */
  getAdapter(techStackId: string): {
    templateEngine?: TemplateEngineAdapter;
    buildSystem?: BuildSystemAdapter;
    packageManager?: PackageManagerAdapter;
  } | null {
    return this.adapters.get(techStackId) || null;
  }

  /**
   * Get registry statistics
   * @returns Registry statistics
   */
  async getStats(): Promise<TechStackRegistryStats> {
    const stacks = Array.from(this.techStacks.values());
    const categories = new Set(
      stacks.map((s) => (s as TechStackDefinition & { category?: string }).category).filter(Boolean)
    );
    const projectTypes = new Set(stacks.flatMap((s) => s.supportedProjectTypes));
    const tags = new Set(stacks.flatMap((s) => (s.metadata?.tags as string[]) || []));

    return {
      totalStacks: stacks.length,
      categories: categories.size,
      projectTypes: projectTypes.size,
      tags: tags.size,
      averageRating: 0,
      totalDownloads: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Register a new tech stack (alias for register)
   * @param techStack - Tech stack definition to register
   * @returns Promise that resolves when registration is complete
   */
  async registerTechStack(techStack: TechStackDefinition): Promise<void> {
    return this.register(techStack);
  }

  /**
   * Get registered tech stacks
   * @returns Array of tech stack definitions
   */
  async getTechStacks(): Promise<TechStackDefinition[]> {
    return Array.from(this.techStacks.values());
  }

  /**
   * Get tech stack by ID
   * @param techStackId - Tech stack ID
   * @returns Tech stack definition or null
   */
  async getTechStack(techStackId: string): Promise<TechStackDefinition | null> {
    return this.techStacks.get(techStackId) || null;
  }

  /**
   * Get templates for tech stack
   * @param _techStackId - Tech stack ID
   * @returns Array of template metadata
   */
  async getTemplatesForTechStack(_techStackId: string): Promise<TemplateMetadata[]> {
    // This would typically integrate with template catalog
    // For now, return empty array
    return [];
  }

  /**
   * Validate tech stack configuration
   * @param techStack - Tech stack definition to validate
   * @returns Validation result
   */
  async validateTechStack(techStack: TechStackDefinition): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      if (!validateTechStackConfig(techStack as TechStackConfig)) {
        return {
          valid: false,
          errors: ['Tech stack configuration is invalid'],
          warnings: [],
        };
      }

      return {
        valid: true,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Unknown validation error'],
        warnings: [],
      };
    }
  }
}
