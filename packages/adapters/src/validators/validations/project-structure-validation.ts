/**
 * Project structure validation utilities
 */

import { access, constants } from 'node:fs/promises';
import { join } from 'node:path';
import type { ProjectValidationResult, ProjectValidatorOptions } from '../types.js';

// Common file constants
const MAIN_INDEX_FILE = 'index.js';

/**
 * Check if a file or directory exists
 * @param path - Path to check
 * @returns Promise that resolves to true if path exists
 */
async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate basic project structure
 * @param options - Validator options
 * @param result - Validation result
 */
export async function validateProjectStructure(
  options: ProjectValidatorOptions,
  result: ProjectValidationResult
): Promise<void> {
  const requiredDirs = getRequiredDirectories(options.config.projectType);
  const requiredFiles = getRequiredFiles(options.config.projectType);

  await validateDirectories(options.projectPath, requiredDirs, result);
  await validateFiles(options.projectPath, requiredFiles, result);

  result.info.push(`Project structure validation completed`);
}

/**
 * Validate required directories exist
 * @param projectPath - Path to the project root
 * @param requiredDirs - Array of required directory names
 * @param result - Validation result to populate with findings
 */
async function validateDirectories(
  projectPath: string,
  requiredDirs: string[],
  result: ProjectValidationResult
): Promise<void> {
  for (const dir of requiredDirs) {
    const dirPath = join(projectPath, dir);
    if (!(await pathExists(dirPath))) {
      result.errors.push(`Missing required directory: ${dir}`);
    }
  }
}

/**
 * Validate required files exist
 * @param projectPath - Path to the project root
 * @param requiredFiles - Array of required file names
 * @param result - Validation result to populate with findings
 */
async function validateFiles(
  projectPath: string,
  requiredFiles: string[],
  result: ProjectValidationResult
): Promise<void> {
  for (const file of requiredFiles) {
    const filePath = join(projectPath, file);
    if (!(await pathExists(filePath))) {
      result.errors.push(`Missing required file: ${file}`);
    }
  }
}

/**
 * Get required directories for project type
 * @param projectType - Project type
 * @returns Required directories
 */
export function getRequiredDirectories(projectType: string): string[] {
  const baseDirs = ['src'];

  switch (projectType) {
    case 'cli':
      return [...baseDirs, 'src/commands', 'src/utils'];
    case 'web':
      return [...baseDirs, 'src/routes', 'src/middleware', 'public'];
    case 'library':
      return [...baseDirs, 'types'];
    default:
      return baseDirs;
  }
}

/**
 * Get required files for project type
 * @param projectType - Project type
 * @returns Required files
 */
export function getRequiredFiles(projectType: string): string[] {
  const baseFiles = ['package.json', 'README.md', '.gitignore'];

  switch (projectType) {
    case 'cli':
      return [...baseFiles, MAIN_INDEX_FILE];
    case 'web':
      return [...baseFiles, 'src/app.ts', 'public/index.html'];
    case 'library':
      return [...baseFiles, MAIN_INDEX_FILE];
    default:
      return [...baseFiles, MAIN_INDEX_FILE];
  }
}

/**
 * Get required scripts for project type
 * @param projectType - Project type
 * @returns Required scripts
 */
export function getRequiredScripts(projectType: string): string[] {
  const baseScripts = ['test', 'lint', 'build'];

  switch (projectType) {
    case 'cli':
      return [...baseScripts, 'start', 'dev'];
    case 'web':
      return [...baseScripts, 'start', 'dev'];
    case 'library':
      return [...baseScripts, 'build'];
    default:
      return baseScripts;
  }
}

/**
 * Get quality-related dependencies
 * @param qualityLevel - Quality level
 * @returns Quality dependencies
 */
export function getQualityDependencies(qualityLevel: string): string[] {
  const baseDeps = ['eslint', 'prettier', '@types/node'];

  switch (qualityLevel) {
    case 'strict':
      return [...baseDeps, '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'];
    case 'medium':
      return baseDeps;
    case 'light':
      return ['@types/node'];
    default:
      return baseDeps;
  }
}

/**
 * Get project-specific dependencies
 * @param projectType - Project type
 * @returns Project dependencies
 */
export function getProjectDependencies(projectType: string): string[] {
  switch (projectType) {
    case 'cli':
      return ['commander', 'inquirer'];
    case 'web':
      return ['express', '@types/express'];
    case 'library':
      return ['rollup', 'typescript'];
    default:
      return [];
  }
}
