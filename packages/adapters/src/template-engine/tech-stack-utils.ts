/**
 * Tech Stack Utilities and Constants
 *
 * Shared utilities and constants for tech stack registry
 */
import type { TechStackConfig, TechStackDependency } from './tech-stack-types.js';

/**
 * Constants for tech stack registry
 */
export const TECH_STACK_REGISTRY_CONSTANTS = {
  CONFIG_FILE_NAME: 'tech-stack.json',
  FILE_EXTENSION: '.json',
  UNKNOWN_ERROR: 'Unknown error',
  JSON_INDENTATION: 2,
  MAX_DEPENDENCIES: 50,
  MAX_TEMPLATE_PATTERNS: 20,
  MAX_VALIDATION_RULES: 30,
  DEFAULT_PRIORITY: 100,
  MAX_LINE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  SUPPORTED_DEPENDENCY_TYPES: ['runtime', 'development', 'peer', 'optional'] as const,
  DEFAULT_DEPENDENCY_TYPE: 'runtime' as const,
} as const;

/**
 * Tech stack categories
 */
export const TECH_STACK_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack',
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
  CLI: 'cli',
  LIBRARY: 'library',
  FRAMEWORK: 'framework',
  DATABASE: 'database',
  DEVOPS: 'devops',
  TESTING: 'testing',
  MONITORING: 'monitoring',
  SECURITY: 'security',
  DOCUMENTATION: 'documentation',
  UTILITY: 'utility',
} as const;

/**
 * Tech stack priority levels
 */
export const TECH_STACK_PRIORITY = {
  LOWEST: 1,
  LOW: 25,
  NORMAL: 50,
  HIGH: 75,
  HIGHEST: 100,
  CRITICAL: 150,
} as const;

/**
 * Validates tech stack configuration
 * @param config - The tech stack configuration to validate
 * @returns True if valid, false otherwise
 */
export function validateTechStackConfig(config: TechStackConfig): boolean {
  // Check required fields
  if (!config.id || !config.name || !config.version || !config.description) {
    return false;
  }

  // Check array limits
  if (config.dependencies.length > TECH_STACK_REGISTRY_CONSTANTS.MAX_DEPENDENCIES) {
    return false;
  }

  if (config.templatePatterns.length > TECH_STACK_REGISTRY_CONSTANTS.MAX_TEMPLATE_PATTERNS) {
    return false;
  }

  if (config.validationRules.length > TECH_STACK_REGISTRY_CONSTANTS.MAX_VALIDATION_RULES) {
    return false;
  }

  // Validate dependencies
  for (const dep of config.dependencies) {
    if (
      !TECH_STACK_REGISTRY_CONSTANTS.SUPPORTED_DEPENDENCY_TYPES.includes(
        dep.type as 'runtime' | 'development' | 'peer' | 'optional'
      )
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Normalizes tech stack dependency
 * @param dependency - The dependency to normalize
 * @returns Normalized dependency
 */
export function normalizeTechStackDependency(
  dependency: Partial<TechStackDependency>
): TechStackDependency {
  return {
    name: dependency.name || '',
    version: dependency.version || '*',
    required: dependency.required ?? true,
    type:
      (dependency.type as 'runtime' | 'devDependency' | 'peerDependency' | 'template') ||
      TECH_STACK_REGISTRY_CONSTANTS.DEFAULT_DEPENDENCY_TYPE,
    compatibility: dependency.compatibility || [],
    description: dependency.description || '',
  };
}

/**
 * Sorts tech stacks by priority
 * @param stacks - Array of tech stacks to sort
 * @returns Sorted array
 */
export function sortTechStacksByPriority<T extends { priority?: number }>(stacks: T[]): T[] {
  return stacks.sort(
    (a, b) =>
      (b.priority || TECH_STACK_REGISTRY_CONSTANTS.DEFAULT_PRIORITY) -
      (a.priority || TECH_STACK_REGISTRY_CONSTANTS.DEFAULT_PRIORITY)
  );
}

/**
 * Filters tech stacks by category
 * @param stacks - Array of tech stacks to filter
 * @param category - Category to filter by
 * @returns Filtered array
 */
export function filterTechStacksByCategory<T extends { category?: string }>(
  stacks: T[],
  category: string
): T[] {
  return stacks.filter((stack) => stack.category === category);
}

/**
 * Creates a safe tech stack ID
 * @param name - The tech stack name
 * @returns Safe ID string
 */
export function createSafeTechStackId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\da-z]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|$/g, '');
}
