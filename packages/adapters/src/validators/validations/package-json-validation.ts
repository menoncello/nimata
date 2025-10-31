/**
 * Package JSON validation utilities
 */

import { REQUIRED_FIELDS } from '../project-structures.js';
import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';
import { fileExists, readFile } from './file-utils.js';
import { getRequiredScripts, getQualityDependencies } from './project-structure-validation.js';

/**
 * Validate package.json content and structure
 * @param {unknown} options - Validator options containing project path and config
 * @param {unknown} result - Validation result to populate with findings
 */
export async function validatePackageJson(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const packagePath = `${options.projectPath}/package.json`;

  if (!(await fileExists(packagePath))) {
    result.errors.push('package.json is missing');
    return;
  }

  try {
    const content = await readFile(packagePath);
    const packageJson = JSON.parse(content);

    validateRequiredFields(packageJson, options, result);
    validateScripts(packageJson, options, result);
    validateQualityDependencies(packageJson, options, result);

    result.info.push(`✓ package.json validated successfully`);
  } catch (error) {
    result.errors.push(
      `Invalid package.json: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Interface for package.json structure
 */
interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Validate required fields in package.json
 * @param {unknown} packageJson - Parsed package.json content
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
function validateRequiredFields(
  packageJson: PackageJson,
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): void {
  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!packageJson[field]) {
      result.errors.push(`package.json missing required field: ${field}`);
    }
  }

  // Validate name matches project
  if (packageJson.name !== options.config.name) {
    result.warnings.push(
      `package.json name "${packageJson.name}" does not match project name "${options.config.name}"`
    );
  }
}

/**
 * Validate scripts in package.json
 * @param {unknown} packageJson - Parsed package.json content
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
function validateScripts(
  packageJson: PackageJson,
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): void {
  const requiredScripts = getRequiredScripts(options.config.projectType);
  for (const script of requiredScripts) {
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      result.warnings.push(`Missing recommended script: ${script}`);
    }
  }
}

/**
 * Validate quality dependencies
 * @param {unknown} packageJson - Parsed package.json content
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
function validateQualityDependencies(
  packageJson: PackageJson,
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): void {
  const qualityDeps = getQualityDependencies(options.config.qualityLevel);
  for (const dep of qualityDeps) {
    if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
      result.warnings.push(`Missing quality dependency: ${dep}`);
    }
  }
}
