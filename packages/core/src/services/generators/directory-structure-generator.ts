/**
 * Directory Structure Generator (Refactored)
 *
 * Generates directory structure for different project types using modular approach
 */
import type { ProjectConfig, ProjectType } from '../../types/project-config.js';
import { CliEntryPointGenerator } from './cli/cli-entry-point-generator.js';
import { ConfigFileGenerators } from './config/config-file-generators.js';
import { ContentGenerators } from './config/content-generators.js';
// Import new modular components
import { AIConfigGenerators } from './core/ai-config-generators.js';
import { ConfigurationGenerators, PackageMetadata } from './core/configuration-generators.js';
import { CoreFileOperations, type DirectoryItem } from './core/core-file-operations.js';
import { EntryPointsGenerator } from './core/entry-points-generator.js';
import { IndexGenerator } from './core/index-generator.js';
import { ProjectTypeGenerators } from './core/project-type-generators.js';
import { QualityConfigGenerators } from './core/quality-config-generators.js';
import { TemplateGenerator } from './template-generator.js';
import { TestFileGenerator } from './test-file-generator.js';
import { TestStructureGenerator } from './test-structure-generator.js';

// Re-export DirectoryItem from core-file-operations
export type { DirectoryItem } from './core/core-file-operations.js';

// Import PackageMetadata from configuration-generators

/**
 * Directory Structure Generator (Refactored)
 *
 * Uses modular components for different aspects of directory structure generation
 */
export class DirectoryStructureGenerator {
  private readonly testFileGenerator: TestFileGenerator;
  private readonly templateGenerator: TemplateGenerator;
  private readonly indexGenerator: IndexGenerator;
  private readonly cliEntryPointGenerator: CliEntryPointGenerator;
  private readonly configFileGenerators: ConfigFileGenerators;

  /**
   * Initialize directory structure generators with modular components
   */
  constructor() {
    this.testFileGenerator = new TestFileGenerator();
    this.templateGenerator = new TemplateGenerator();
    this.indexGenerator = new IndexGenerator();
    this.cliEntryPointGenerator = new CliEntryPointGenerator();
    this.configFileGenerators = new ConfigFileGenerators();
  }

  /**
   * Create directories with security validation (delegated to CoreFileOperations)
   * @param basePath - Base path for directory creation
   * @param directories - Array of directory paths to create
   * @throws Error if directory creation fails or path validation fails
   */
  async createDirectories(basePath: string, directories: string[]): Promise<void> {
    await CoreFileOperations.createDirectories(basePath, directories);
  }

  /**
   * Create nested directory structure recursively (delegated to CoreFileOperations)
   * @param basePath - Base path for directory creation
   * @param nestedStructure - Array of nested directory paths
   * @throws Error if directory creation fails or path validation fails
   */
  async createNestedDirectories(basePath: string, nestedStructure: string[]): Promise<void> {
    await CoreFileOperations.createNestedDirectories(basePath, nestedStructure);
  }

  /**
   * Create directories with .gitkeep files for empty directories (delegated to CoreFileOperations)
   * @param basePath - Base path for directory creation
   * @param directories - Array of directory paths to create with .gitkeep files
   * @throws Error if directory creation fails or path validation fails
   */
  async createDirectoriesWithGitkeep(basePath: string, directories: string[]): Promise<void> {
    await CoreFileOperations.createDirectoriesWithGitkeep(basePath, directories);
  }

  /**
   * Generate directory structure for a specific project type
   * @param projectType - Project type (cli, web, library, basic)
   * @returns Directory structure for the specified project type
   */
  async generateStructureForType(projectType: string): Promise<DirectoryItem[]> {
    const mockConfig: ProjectConfig = {
      name: 'test-project',
      description: 'Test project',
      author: 'Test Author',
      license: 'MIT',
      qualityLevel: 'medium',
      projectType: projectType as ProjectType,
      aiAssistants: [],
      template: 'basic',
    };

    return this.generate(mockConfig);
  }

  /**
   * Generate and create directory structure for a specific project type
   * @param basePath - Base path where to create the structure
   * @param projectType - Project type (cli, web, library, basic)
   * @throws Error if structure creation fails or path validation fails
   */
  async generateAndCreateStructureForType(basePath: string, projectType: string): Promise<void> {
    const structure = await this.generateStructureForType(projectType);

    await this.createStructureFromDirectoryItems(basePath, structure);
  }

  /**
   * Create directory structure from DirectoryItem array (delegated to CoreFileOperations)
   * @param basePath - Base path where to create the structure
   * @param structure - Array of DirectoryItem objects
   * @throws Error if structure creation fails or path validation fails
   */
  async createStructureFromDirectoryItems(
    basePath: string,
    structure: DirectoryItem[]
  ): Promise<void> {
    await CoreFileOperations.createStructureFromDirectoryItems(basePath, structure);
  }

  /**
   * Create directory with specific permissions (delegated to CoreFileOperations)
   * @param dirPath - Directory path to create
   * @param mode - Permission mode (e.g., 0o755)
   * @throws Error if directory creation fails or path validation fails
   */
  async createDirectoryWithPermissions(dirPath: string, mode: number): Promise<void> {
    await CoreFileOperations.createDirectoryWithPermissions(dirPath, mode);
  }

  /**
   * Create CLI executable file (delegated to CoreFileOperations)
   * @param filePath - Path to the executable file
   * @param content - Content of the executable file
   * @throws Error if file creation fails or path validation fails
   */
  async createCliExecutable(filePath: string, content: string): Promise<void> {
    await CoreFileOperations.createCliExecutable(filePath, content);
  }

  /**
   * Generate main entry point file (delegated to EntryPointsGenerator)
   * @param basePath - Base project path
   * @param projectName - Name of the project
   * @throws Error if file creation fails or path validation fails
   */
  async generateMainEntryPoint(basePath: string, projectName: string): Promise<void> {
    await EntryPointsGenerator.generateMainEntryPoint(basePath, projectName);
  }

  /**
   * Generate CLI entry point file (delegated to EntryPointsGenerator)
   * @param basePath - Base project path
   * @param cliName - Name of the CLI executable
   * @param config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  async generateCliEntryPoint(
    basePath: string,
    cliName: string,
    config: ProjectConfig
  ): Promise<void> {
    await EntryPointsGenerator.generateCliEntryPoint(basePath, cliName, config);
  }

  /**
   * Generate .gitignore file (delegated to ConfigurationGenerators)
   * @param basePath - Base project path
   * @param config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  async generateGitignore(basePath: string, config: ProjectConfig): Promise<void> {
    await ConfigurationGenerators.generateGitignore(basePath, config);
  }

  /**
   * Generate package.json file (delegated to ConfigurationGenerators)
   * @param basePath - Base project path
   * @param metadata - Package metadata
   * @throws Error if file creation fails or path validation fails
   */
  async generatePackageJson(basePath: string, metadata: PackageMetadata): Promise<void> {
    await ConfigurationGenerators.generatePackageJson(basePath, metadata);
  }

  /**
   * Generate TypeScript configuration file (delegated to ConfigurationGenerators)
   * @param basePath - Base project path
   * @param config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  async generateTsConfig(basePath: string, config: ProjectConfig): Promise<void> {
    await ConfigurationGenerators.generateTsConfig(basePath, config);
  }

  /**
   * Validates path to prevent directory traversal attacks and malicious path patterns
   * @param basePath - Base path to validate against
   * @param targetPath - Target path to validate
   * @throws Error if path validation fails
   */
  validatePath(basePath: string, targetPath: string): void {
    CoreFileOperations.validatePath(basePath, targetPath);
  }

  /**
   * Generate complete directory structure (refactored to use modular approach)
   * @param config - Project configuration
   * @returns Complete directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const structure: DirectoryItem[] = [
      // Base structure
      ...ProjectTypeGenerators.generateBaseStructure(),

      // Project type specific structure
      ...ProjectTypeGenerators.generateProjectTypeStructure(config.projectType),

      // Core files and entry points
      ...this.generateCoreFiles(config),
      ...EntryPointsGenerator.generateEntryPoints(config),

      // Test files
      ...this.generateTestFiles(config),

      // Documentation files
      ...this.generateDocumentationFiles(config),

      // Configuration files
      ...ConfigurationGenerators.generateConfigurationFiles(config),

      // Quality configurations
      ...QualityConfigGenerators.generateQualityConfigs(config),

      // AI assistant configurations
      ...AIConfigGenerators.generateAIAssistantConfigs(config),

      // Gitkeep files for empty directories
      ...ProjectTypeGenerators.generateGitkeepFiles(config),

      // Template-based files
      ...this.templateGenerator.generate(config),
    ];

    // Normalize DirectoryItems to ensure all directories and files have mode
    return CoreFileOperations.normalizeDirectoryItems(structure);
  }

  /**
   * Generate core files (delegated to index generator and project type generators)
   * @param config - Project configuration
   * @returns Core files
   */
  private generateCoreFiles(config: ProjectConfig): DirectoryItem[] {
    const coreFiles: DirectoryItem[] = [
      {
        path: 'src/index.ts',
        type: 'file' as const,
        content: this.indexGenerator.generateIndexFile(config),
      },
    ];

    // Add project-type specific files
    if (config.projectType === 'web') {
      coreFiles.push(...ProjectTypeGenerators.generateWebCoreFiles(config));
    }

    // Add library-specific files
    if (config.projectType === 'library') {
      coreFiles.push(...ProjectTypeGenerators.generateLibraryCoreFiles(config));
    }

    return coreFiles;
  }

  /**
   * Generate test files (using test file generator)
   * @param config - Project configuration
   * @returns Test files
   */
  private generateTestFiles(config: ProjectConfig): DirectoryItem[] {
    const testStructureGenerator = new TestStructureGenerator();
    const vitestConfig = testStructureGenerator
      .generate(config)
      .find((item) => item.path === 'vitest.config.ts');

    return [
      {
        path: 'tests/setup.ts',
        type: 'file',
        content: this.testFileGenerator.generateTestSetup(config),
      },
      {
        path: 'tests/index.test.ts',
        type: 'file',
        content: this.testFileGenerator.generate(config),
      },
      ...(vitestConfig ? [vitestConfig] : []),
    ];
  }

  /**
   * Generate documentation files (using content generators)
   * @param config - Project configuration
   * @returns Documentation files
   */
  private generateDocumentationFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'README.md',
        type: 'file',
        content: ContentGenerators.generateReadme(config),
      },
      {
        path: 'docs/api.md',
        type: 'file',
        content: ContentGenerators.generateAPIDocumentation(config),
      },
    ];
  }
}
