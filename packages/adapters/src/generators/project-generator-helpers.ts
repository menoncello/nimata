/**
 * Project Generator Helper Functions
 *
 * Extracted utility functions to reduce project-generator.ts file size
 */

import type { ProjectConfig, GenerationResult } from '../utils/project-generation-helpers.js';

type NormalizedQualityLevel = 'light' | 'medium' | 'strict';
type NormalizedProjectType = 'basic' | 'web' | 'cli' | 'library';

const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

/**
 * Create base result object
 * @returns Base generation result
 */
export function createBaseResult(): GenerationResult {
  return {
    success: false,
    files: [],
    errors: [],
    warnings: [],
    duration: 0,
  };
}

/**
 * Handle unexpected errors in project generation
 * @param error - Error that occurred
 * @param startTime - Start time for duration calculation
 * @returns Error result
 */
export function handleUnexpectedError(error: unknown, startTime: number): GenerationResult {
  const result = createBaseResult();
  result.errors.push(
    `Unexpected error: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE}`
  );
  result.duration = Date.now() - startTime;
  return result;
}

/**
 * Create error result
 * @param result - Result object to modify
 * @param errorMessage - Error message
 * @param errors - Array of errors
 * @param startTime - Start time for duration calculation
 * @returns Error result
 */
export function createErrorResult(
  result: GenerationResult,
  errorMessage: string,
  errors: string[],
  startTime: number
): GenerationResult {
  result.success = false;
  result.errors.push(errorMessage);
  if (errors.length > 0) {
    result.errors.push(...errors);
  }
  result.duration = Date.now() - startTime;
  return result;
}

/**
 * Create successful generation result
 * @param files - Generated files
 * @param projectDir - Project directory
 * @param startTime - Start time for duration calculation
 * @param addValidationWarnings - Function to add validation warnings
 * @returns Successful generation result
 */
export async function createSuccessResult(
  files: Array<{ path: string; content: string; permissions?: string }>,
  projectDir: string,
  startTime: number,
  addValidationWarnings: (result: GenerationResult, projectDir: string) => Promise<void>
): Promise<GenerationResult> {
  const result: GenerationResult = {
    success: true,
    files,
    errors: [],
    warnings: [],
    duration: Date.now() - startTime,
  };

  await addValidationWarnings(result, projectDir);
  return result;
}

/**
 * Map quality level (high -> strict)
 * @param level - Quality level from config
 * @returns Normalized quality level
 */
export function normalizeQualityLevel(level: string): NormalizedQualityLevel {
  return level === 'high' ? 'strict' : (level as NormalizedQualityLevel);
}

/**
 * Map project type to supported types
 * @param type - Project type from config
 * @returns Normalized project type
 */
export function normalizeProjectType(type: string): NormalizedProjectType {
  const projectTypeMap: Record<string, 'basic' | 'web' | 'cli' | 'library'> = {
    basic: 'basic',
    web: 'web',
    cli: 'cli',
    library: 'library',
    'bun-react': 'web',
    'bun-vue': 'web',
    'bun-express': 'web',
    'bun-typescript': 'basic',
  };
  return projectTypeMap[type] || 'basic';
}

/**
 * Normalize config for AI generators (convert types to match generator expectations)
 * @param config - Original project configuration
 * @returns Normalized configuration
 */
export function normalizeConfigForGenerators(config: ProjectConfig): {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
} {
  const qualityLevel = normalizeQualityLevel(config.qualityLevel);
  const projectType = normalizeProjectType(config.projectType);
  const aiAssistants = config.aiAssistants.filter(
    (assistant): assistant is 'claude-code' | 'copilot' =>
      assistant === 'claude-code' || assistant === 'copilot'
  );

  return {
    name: config.name,
    description: config.description,
    qualityLevel,
    projectType,
    aiAssistants,
  };
}
