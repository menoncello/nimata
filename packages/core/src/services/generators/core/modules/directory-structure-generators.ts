/**
 * Directory Structure Generators
 *
 * Generates project-specific directory structures
 */
import { DirectoryItem } from '../file-operations/types.js';

// File permission constants
const DEFAULT_DIR_PERMISSIONS = 0o755;

/**
 * Handles project-specific directory structure generation
 */
export class DirectoryStructureGenerators {
  /**
   * Generate base directory structure
   * @returns {DirectoryItem[]} Base directory structure
   */
  static generateBaseStructure(): DirectoryItem[] {
    return [
      ...DirectoryStructureGenerators.generateCoreDirectories(),
      ...DirectoryStructureGenerators.generateTestStructureDirectories(),
      ...DirectoryStructureGenerators.generateDocumentationStructureDirectories(),
    ];
  }

  /**
   * Generate project type specific structure
   * @param {string} projectType - Project type
   * @returns {DirectoryItem[]} Project-specific structure
   */
  static generateProjectTypeStructure(projectType: string): DirectoryItem[] {
    const structureGenerator = DirectoryStructureGenerators.getStructureGenerator(projectType);
    return structureGenerator();
  }

  /**
   * Get the appropriate structure generator function for a project type
   * @param {string} projectType - The project type
   * @returns {() => DirectoryItem[]} Structure generator function
   */
  private static getStructureGenerator(projectType: string): () => DirectoryItem[] {
    switch (projectType) {
      case 'cli':
        return DirectoryStructureGenerators.generateCliStructure;
      case 'web':
        return DirectoryStructureGenerators.generateWebStructure;
      case 'library':
        return DirectoryStructureGenerators.generateLibraryStructure;
      default:
        return () => [];
    }
  }

  /**
   * Generate core directories (AC1) - Following SOLID principles
   * @returns {DirectoryItem[]} Core directories
   */
  private static generateCoreDirectories(): DirectoryItem[] {
    return [
      { path: 'src', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/core', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/services', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/utils', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/types', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/interfaces', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'bin', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'docs', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata/cache', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.nimata/config', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.claude', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: '.github', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }

  /**
   * Generate test structure directories (AC5)
   * @returns {DirectoryItem[]} Test structure directories
   */
  private static generateTestStructureDirectories(): DirectoryItem[] {
    return [
      { path: 'tests/unit', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/integration', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/e2e', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/fixtures', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/factories', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }

  /**
   * Generate documentation structure directories (AC4)
   * @returns {DirectoryItem[]} Documentation structure directories
   */
  private static generateDocumentationStructureDirectories(): DirectoryItem[] {
    return [
      { path: 'docs/api', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'docs/examples', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }

  /**
   * Generate CLI-specific directory structure
   * @returns {DirectoryItem[]} CLI directory structure
   */
  private static generateCliStructure(): DirectoryItem[] {
    return [
      { path: 'src/cli', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/unit/cli', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }

  /**
   * Generate web-specific directory structure
   * @returns {DirectoryItem[]} Web directory structure
   */
  private static generateWebStructure(): DirectoryItem[] {
    return [
      { path: 'public', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/components', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/styles', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/unit/components', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      {
        path: 'tests/integration/components',
        type: 'directory',
        mode: DEFAULT_DIR_PERMISSIONS,
      },
    ];
  }

  /**
   * Generate library-specific directory structure
   * @returns {DirectoryItem[]} Library directory structure
   */
  private static generateLibraryStructure(): DirectoryItem[] {
    return [
      { path: 'dist', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/lib', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/lib/utils', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'src/lib/constants', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'examples', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'examples/basic', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'examples/advanced', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'benchmarks', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
      { path: 'tests/unit/library', type: 'directory', mode: DEFAULT_DIR_PERMISSIONS },
    ];
  }
}
