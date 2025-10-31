/**
 * Gitkeep File Generator Utility
 *
 * Generates .gitkeep files for empty directories
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { DirectoryItem } from '../file-operations/types.js';

/**
 * Handles .gitkeep file generation for empty directories
 */
export class GitkeepGenerator {
  // Default directories that need .gitkeep files
  private static readonly DEFAULT_DIRECTORIES = [
    'dist',
    'tests/unit',
    'tests/integration',
    'tests/e2e',
    'tests/fixtures',
    'tests/factories',
    'docs/api',
    'docs/examples',
    '.nimata/cache',
    '.nimata/config',
    'bin',
    'docs',
  ];

  /**
   * Project-type specific directories that might be empty
   */
  private static readonly PROJECT_TYPE_DIRECTORIES = {
    cli: ['src/cli'],
    web: ['public', 'src/components', 'src/styles'],
    library: [
      'src/lib',
      'src/lib/utils',
      'src/lib/constants',
      'examples',
      'examples/basic',
      'examples/advanced',
      'benchmarks',
    ],
  };

  /**
   * Generate .gitkeep files for empty directories
   * @param {ProjectConfig} config - Project configuration to determine project-specific empty directories
   * @returns {DirectoryItem[]} Array of .gitkeep file directory items
   */
  static generateGitkeepFiles(config: ProjectConfig): DirectoryItem[] {
    const directoriesToKeep = GitkeepGenerator.getAllDirectoriesToKeep(config);
    return GitkeepGenerator.createGitkeepFiles(directoriesToKeep);
  }

  /**
   * Get all directories that need .gitkeep files
   * @param {ProjectConfig} config - Project configuration
   * @returns {string[]} Array of directory paths
   */
  private static getAllDirectoriesToKeep(config: ProjectConfig): string[] {
    const directories = [...GitkeepGenerator.DEFAULT_DIRECTORIES];
    const projectSpecificDirs = GitkeepGenerator.getProjectTypeDirectories(config.projectType);

    return [...directories, ...projectSpecificDirs];
  }

  /**
   * Get project-type specific directories
   * @param {string} projectType - The project type
   * @returns {string[]} Array of project-type specific directories
   */
  private static getProjectTypeDirectories(projectType: string): string[] {
    return (
      GitkeepGenerator.PROJECT_TYPE_DIRECTORIES[
        projectType as keyof typeof GitkeepGenerator.PROJECT_TYPE_DIRECTORIES
      ] || []
    );
  }

  /**
   * Create .gitkeep file directory items
   * @param {string[]} directories - Array of directory paths
   * @returns {DirectoryItem[]} Array of .gitkeep file directory items
   */
  private static createGitkeepFiles(directories: string[]): DirectoryItem[] {
    return directories.map((dir) => GitkeepGenerator.createGitkeepFile(dir));
  }

  /**
   * Create a single .gitkeep file directory item
   * @param {string} directory - Directory path
   * @returns {DirectoryItem} .gitkeep file directory item
   */
  private static createGitkeepFile(directory: string): DirectoryItem {
    return {
      path: `${directory}/.gitkeep`,
      type: 'file' as const,
      content: '',
      mode: 0o644, // Regular file permissions
    };
  }
}
