/**
 * TypeScript configuration validation utilities
 */

import { access, constants, readFile } from 'node:fs/promises';
import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';

/**
 * Check if a file exists
 * @param {string} path - File path to check
 * @returns {void} Promise that resolves to true if file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate TypeScript configuration and compiler options
 * @param {unknown} options - Validator options containing project path and config
 * @param {unknown} result - Validation result to populate with findings
 */
export async function validateTypeScriptConfig(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const tsconfigPath = `${options.projectPath}/tsconfig.json`;

  if (!(await fileExists(tsconfigPath))) {
    result.errors.push('tsconfig.json is missing');
    return;
  }

  try {
    const content = await readFile(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(content);

    validateStrictMode(tsconfig, options, result);
    validateIncludeArray(tsconfig, result);
    validateExcludeArray(tsconfig, result);

    result.info.push(`✓ TypeScript configuration validated`);
  } catch (error) {
    result.errors.push(
      `Invalid tsconfig.json: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Validate strict mode for strict quality level
 * @param {unknown} tsconfig - TypeScript configuration object
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
function validateStrictMode(
  tsconfig: Record<string, unknown>,
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): void {
  if (
    options.config.qualityLevel === 'strict' &&
    (tsconfig['compilerOptions'] as Record<string, unknown>)?.['strict'] !== true
  ) {
    result.warnings.push('Strict quality level recommends strict TypeScript mode');
  }
}

/**
 * Validate include array in tsconfig
 * @param {unknown} tsconfig - TypeScript configuration object
 * @param {unknown} result - Validation result to populate with findings
 */
function validateIncludeArray(
  tsconfig: Record<string, unknown>,
  result: ProjectValidationResult
): void {
  if (!tsconfig['include'] || !Array.isArray(tsconfig['include'])) {
    result.errors.push('tsconfig.json missing include array');
  }
}

/**
 * Validate exclude array in tsconfig
 * @param {unknown} tsconfig - TypeScript configuration object
 * @param {unknown} result - Validation result to populate with findings
 */
function validateExcludeArray(
  tsconfig: Record<string, unknown>,
  result: ProjectValidationResult
): void {
  if (!tsconfig['exclude'] || !Array.isArray(tsconfig['exclude'])) {
    result.warnings.push('tsconfig.json missing exclude array');
  }
}
