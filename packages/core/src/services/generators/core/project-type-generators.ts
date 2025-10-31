/**
 * Project Type Generators
 *
 * Generates project type specific directory structures and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem } from './core-file-operations.js';
import { DirectoryStructureGenerators } from './modules/directory-structure-generators.js';
import { LibraryFileGenerators } from './modules/library/library-file-generators.js';
import { WebFileGenerators } from './modules/web/web-file-generators.js';
import { GitkeepGenerator } from './utils/gitkeep-generator.js';

/**
 * Handles project type specific structure generation
 */
export class ProjectTypeGenerators {
  /**
   * Generate base directory structure
   * @returns {DirectoryItem[]} Base directory structure
   */
  static generateBaseStructure(): DirectoryItem[] {
    return DirectoryStructureGenerators.generateBaseStructure();
  }

  /**
   * Generate project type specific structure
   * @param {string} projectType - Project type
   * @returns {DirectoryItem[]} Project-specific structure
   */
  static generateProjectTypeStructure(projectType: string): DirectoryItem[] {
    return DirectoryStructureGenerators.generateProjectTypeStructure(projectType);
  }

  /**
   * Generate web-specific core files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Web-specific core files
   */
  static generateWebCoreFiles(config: ProjectConfig): DirectoryItem[] {
    return WebFileGenerators.generateWebCoreFiles(config);
  }

  /**
   * Generate library-specific core files
   * @param {ProjectConfig} config - Project configuration
   * @returns {DirectoryItem[]} Library-specific core files
   */
  static generateLibraryCoreFiles(config: ProjectConfig): DirectoryItem[] {
    return LibraryFileGenerators.generateLibraryCoreFiles(config);
  }

  /**
   * Generate .gitkeep files for empty directories
   * @param {ProjectConfig} config - Project configuration to determine project-specific empty directories
   * @returns {DirectoryItem[]} Array of .gitkeep file directory items
   */
  static generateGitkeepFiles(config: ProjectConfig): DirectoryItem[] {
    return GitkeepGenerator.generateGitkeepFiles(config);
  }
}
