/**
 * Dependency validation utilities
 */

import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';
import { fileExists, readFile } from './file-utils.js';
import { getProjectDependencies } from './project-structure-validation.js';

/**
 * Validate dependencies and installations
 * @param options - Validator options containing project path and config
 * @param result - Validation result to populate with findings
 */
export async function validateDependencies(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const packagePath = `${options.projectPath}/package.json`;

  if (!(await fileExists(packagePath))) {
    return;
  }

  try {
    const content = await readFile(packagePath);
    const packageJson = JSON.parse(content);

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    } as Record<string, string>;

    await validateEssentialDependencies(allDeps, result);
    await validateProjectSpecificDependencies(allDeps, options, result);

    result.info.push(`✓ Dependency validation completed`);
  } catch (error) {
    result.errors.push(
      `Failed to validate dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validate essential dependencies
 * @param allDeps - All project dependencies from package.json
 * @param result - Validation result to populate with findings
 */
async function validateEssentialDependencies(
  allDeps: Record<string, string>,
  result: ProjectValidationResult
): Promise<void> {
  if (!allDeps['typescript']) {
    result.warnings.push('TypeScript not found in dependencies');
  }

  const essentialDeps = ['eslint', 'prettier'];
  for (const dep of essentialDeps) {
    if (!allDeps[dep]) {
      result.warnings.push(`${dep} not found in dependencies`);
    }
  }
}

/**
 * Validate project-specific dependencies
 * @param allDeps - All project dependencies from package.json
 * @param options - Validator options containing project configuration
 * @param result - Validation result to populate with findings
 */
async function validateProjectSpecificDependencies(
  allDeps: Record<string, string>,
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const projectDeps = getProjectDependencies(options.config.projectType);
  for (const dep of projectDeps) {
    if (!allDeps[dep]) {
      result.warnings.push(
        `${dep} not found (recommended for ${options.config.projectType} projects)`
      );
    }
  }
}
