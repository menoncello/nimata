/**
 * Configuration Files Generators
 *
 * Generates configuration files like package.json, tsconfig.json, etc.
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem, CoreFileOperations } from './core-file-operations.js';
import { EslintConfigGenerators } from './eslint-config-generators.js';
import { GitignoreGenerators } from './gitignore-generators.js';
import { PackageJsonGenerators, type PackageMetadata } from './package-json-generators.js';
import { TypescriptConfigGenerators } from './typescript-config-generators.js';

// File name constants
const GITIGNORE_FILE = '.gitignore';
const PACKAGE_JSON_FILE = 'package.json';
const TSCONFIG_JSON_FILE = 'tsconfig.json';

// File permission constants
const DEFAULT_FILE_PERMISSIONS = 0o644;
const JSON_INDENTATION = 2;

/**
 * Handles configuration file generation
 */
export class ConfigurationGenerators {
  /**
   * Generate package.json file
   * @param {string} basePath - Base project path
   * @param {PackageMetadata} metadata - Package metadata
   * @throws Error if file creation fails or path validation fails
   */
  static async generatePackageJson(basePath: string, metadata: PackageMetadata): Promise<void> {
    const filePath = join(basePath, PACKAGE_JSON_FILE);
    CoreFileOperations.validatePath(basePath, PACKAGE_JSON_FILE);

    const packageJson = PackageJsonGenerators.createPackageJsonContent(metadata);

    try {
      await fs.writeFile(filePath, JSON.stringify(packageJson, null, JSON_INDENTATION), {
        mode: DEFAULT_FILE_PERMISSIONS,
      });
    } catch (error) {
      throw ConfigurationGenerators.createFileError('package.json', error);
    }
  }

  /**
   * Generate .gitignore file
   * @param {string} basePath - Base project path
   * @param {ProjectConfig} config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  static async generateGitignore(basePath: string, config: ProjectConfig): Promise<void> {
    const filePath = join(basePath, GITIGNORE_FILE);
    CoreFileOperations.validatePath(basePath, GITIGNORE_FILE);

    const content = GitignoreGenerators.generateGitignoreContent(config);

    try {
      await fs.writeFile(filePath, content, { mode: DEFAULT_FILE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate .gitignore: ${error.message}`);
      }
      throw new Error(`Failed to generate .gitignore: Unknown error`);
    }
  }

  /**
   * Generate TypeScript configuration file
   * @param {string} basePath - Base project path
   * @param {ProjectConfig} config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  static async generateTsConfig(basePath: string, config: ProjectConfig): Promise<void> {
    const filePath = join(basePath, TSCONFIG_JSON_FILE);
    CoreFileOperations.validatePath(basePath, TSCONFIG_JSON_FILE);

    const content = TypescriptConfigGenerators.generateTsConfigContent(config);

    try {
      await fs.writeFile(filePath, content, { mode: DEFAULT_FILE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate tsconfig.json: ${error.message}`);
      }
      throw new Error(`Failed to generate tsconfig.json: Unknown error`);
    }
  }

  /**
   * Generate configuration files as DirectoryItems
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem} Directory items
   */
  static generateConfigurationFiles(config: ProjectConfig): DirectoryItem[] {
    const files: DirectoryItem[] = [];

    files.push(GitignoreGenerators.createGitignoreFile(config));
    files.push(
      PackageJsonGenerators.createPackageJsonFile({
        name: config.name,
        description: config.description,
        author: config.author,
        license: config.license,
        projectType: config.projectType,
      })
    );
    files.push(TypescriptConfigGenerators.createTsConfigFile(config));
    files.push(EslintConfigGenerators.createEslintFile(config));

    return files;
  }

  /**
   * Create a standardized file error
   * @param {string} fileName - Name of the file that failed
   * @param {string} originalError - Original error object
   * @returns {string} Formatted error
   */
  private static createFileError(fileName: string, originalError: unknown): Error {
    if (originalError instanceof Error) {
      return new Error(`Failed to generate ${fileName}: ${originalError.message}`);
    }
    return new Error(`Failed to generate ${fileName}: Unknown error`);
  }
}

// Re-export types for backward compatibility
export type { PackageMetadata } from './package-json-generators.js';
