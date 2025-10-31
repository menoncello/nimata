/**
 * Project type specific validation utilities
 */

import { CLI_FILES, WEB_SERVER_FILES, LIBRARY_MAIN_FILES } from '../project-structures.js';
import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';
import { fileExists, readFile } from './file-utils.js';

/**
 * Validate project-specific requirements
 * @param {unknown} options - Validator options
 * @param {unknown} result - Validation result
 */
export async function validateProjectSpecificRequirements(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  switch (options.config.projectType) {
    case 'cli':
      await validateCLIRequirements(options, result);
      break;
    case 'web':
      await validateWebRequirements(options, result);
      break;
    case 'library':
      await validateLibraryRequirements(options, result);
      break;
    default:
      result.info.push('Basic project type - no specific validation required');
  }
}

/**
 * Validate CLI project requirements
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateCLIRequirements(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  await validateCLIMainFile(options, result);
  await validateCLIBinConfig(options, result);
}

/**
 * Validate CLI main file
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateCLIMainFile(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const cliFiles = CLI_FILES;
  let hasMainFile = false;
  for (const file of cliFiles) {
    const filePath = `${options.projectPath}/${file}`;
    if (await fileExists(filePath)) {
      hasMainFile = true;
      result.info.push(`✓ CLI main file found: ${file}`);
      break;
    }
  }

  if (!hasMainFile) {
    result.warnings.push('CLI project missing main entry file');
  }
}

/**
 * Validate CLI bin configuration
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateCLIBinConfig(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const packagePath = `${options.projectPath}/package.json`;
  if (await fileExists(packagePath)) {
    try {
      const content = await readFile(packagePath);
      const packageJson = JSON.parse(content);
      if (packageJson.bin) {
        result.info.push('✓ CLI bin configuration found');
      } else {
        result.warnings.push('CLI project missing bin configuration in package.json');
      }
    } catch {
      // Ignore package.json parsing errors here as they're caught elsewhere
    }
  }
}

/**
 * Validate web project requirements
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateWebRequirements(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  await validateWebServerFile(options, result);
  await validatePublicDirectory(options, result);
}

/**
 * Validate web server file
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateWebServerFile(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const serverFiles = WEB_SERVER_FILES;
  let hasServerFile = false;
  for (const file of serverFiles) {
    const filePath = `${options.projectPath}/${file}`;
    if (await fileExists(filePath)) {
      hasServerFile = true;
      result.info.push(`✓ Web server file found: ${file}`);
      break;
    }
  }

  if (!hasServerFile) {
    result.warnings.push('Web project missing server file');
  }
}

/**
 * Validate public directory
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validatePublicDirectory(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const publicPath = `${options.projectPath}/public`;
  if (await fileExists(publicPath)) {
    result.info.push('✓ Public directory found');
  } else {
    result.warnings.push('Web project missing public directory');
  }
}

/**
 * Validate library project requirements
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateLibraryRequirements(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  await validateLibraryMainFile(options, result);
  await validateLibraryTypesDirectory(options, result);
  await validateLibraryPackageJsonConfig(options, result);
}

/**
 * Validate library main file
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateLibraryMainFile(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const mainFiles = LIBRARY_MAIN_FILES;
  let hasMainFile = false;
  for (const file of mainFiles) {
    const filePath = `${options.projectPath}/${file}`;
    if (await fileExists(filePath)) {
      hasMainFile = true;
      result.info.push(`✓ Library main file found: ${file}`);
      break;
    }
  }

  if (!hasMainFile) {
    result.errors.push('Library project missing main entry file');
  }
}

/**
 * Validate library types directory
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateLibraryTypesDirectory(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const typesPath = `${options.projectPath}/types`;
  if (await fileExists(typesPath)) {
    result.info.push('✓ Types directory found');
  } else {
    result.warnings.push('Library project missing types directory (recommended)');
  }
}

/**
 * Validate library package.json configuration
 * @param {unknown} options - Validator options containing project configuration
 * @param {unknown} result - Validation result to populate with findings
 */
async function validateLibraryPackageJsonConfig(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const packagePath = `${options.projectPath}/package.json`;
  if (await fileExists(packagePath)) {
    try {
      const content = await readFile(packagePath);
      const packageJson = JSON.parse(content);

      if (packageJson.main || packageJson.exports) {
        result.info.push('✓ Library entry point configured');
      } else {
        result.warnings.push('Library package.json missing main or exports field');
      }

      if (packageJson.types || packageJson.typings) {
        result.info.push('✓ TypeScript types configured');
      } else {
        result.warnings.push('Library package.json missing types field');
      }
    } catch {
      // Ignore package.json parsing errors here as they're caught elsewhere
    }
  }
}
