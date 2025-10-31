/**
 * Project Setup Operations (Refactored)
 *
 * Handles the setup of various project components and tools
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { CLILogger } from '../utils/cli-helpers';
import { JSON_SERIALIZATION } from '../utils/constants.js';
import { ConfigGenerators } from './config-generators.js';
import type { ProjectConfig } from './enhanced-init-types.js';
import { ProjectTemplates } from './project-templates.js';

/**
 * Project Setup Class
 */
export class ProjectSetup {
  private logger: CLILogger;
  private templates: ProjectTemplates;
  private configGenerators: ConfigGenerators;

  /**
   * Initialize ProjectSetup with required dependencies
   * @param {CLILogger} logger - CLI logger instance for logging operations
   */
  constructor(logger: CLILogger) {
    this.logger = logger;
    this.templates = new ProjectTemplates();
    this.configGenerators = new ConfigGenerators();
  }

  /**
   * Get base directories for all project types
   * @returns {string[]} Array of base directory paths
   */
  private getBaseDirectories(): string[] {
    return [
      'src',
      'tests',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/fixtures',
      'tests/factories',
      'docs',
      'docs/api',
      'docs/examples',
      '.github',
      '.github/workflows',
      '.github/ISSUE_TEMPLATE',
      '.nimata',
      '.nimata/cache',
      '.nimata/config',
      '.claude',
    ];
  }

  /**
   * Project-specific directory configurations
   */
  private readonly PROJECT_DIRECTORIES = {
    basic: [] as string[], // Basic projects only need base directories
    web: [
      'public',
      'src/components',
      'src/styles',
      'src/assets',
      'src/utils',
      'src/types',
      'src/pages',
      'src/hooks',
      'src/styles/components',
      'tests/unit/components',
      'tests/integration/components',
    ] as string[],
    cli: [
      'bin',
      'src/cli', // Changed from src/commands to match test expectations
      'tests/unit/cli',
      'tests/e2e', // Ensure e2e directory exists for CLI projects
      'tests/integration', // Also create integration test directory
      'tests/fixtures', // Also create fixtures test directory
    ] as string[],
    library: ['src/types', 'dist', 'examples', 'tests/unit/library'] as string[],
  } as const;

  /**
   * Get project-specific directories based on test expectations
   * @param {ProjectConfig} config - Project configuration
   * @returns {string[]} Array of project-specific directory paths
   */
  private getProjectSpecificDirectories(config: ProjectConfig): string[] {
    return this.PROJECT_DIRECTORIES[config.projectType] || [];
  }

  /**
   * Create directories from array
   * @param {string} projectDir - Project directory path
   * @param {string[]} directories - Array of directory paths to create
   */
  private async createDirectories(projectDir: string, directories: string[]): Promise<void> {
    for (const dir of directories) {
      const dirPath = path.join(projectDir, dir);
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Create the basic directory structure for the project
   * @param {ProjectConfig} config - Project configuration
   * @param {unknown} targetDir - Target directory (optional)
   */
  async createDirectoryStructure(config: ProjectConfig, targetDir?: string): Promise<void> {
    const projectDir = targetDir || config.name;

    // Get all directories
    const baseDirectories = this.getBaseDirectories();
    const projectSpecificDirectories = this.getProjectSpecificDirectories(config);
    const allDirectories = [...baseDirectories, ...projectSpecificDirectories];

    // Create directories
    await this.createDirectories(projectDir, allDirectories);

    // Create initial files
    await this.createInitialFiles(config, projectDir);
  }

  /**
   * Generate package.json file
   * @param {ProjectConfig} config - Project configuration
   */
  async generatePackageJson(config: ProjectConfig): Promise<void> {
    const packageJson = this.configGenerators.generatePackageJson(config);
    const packageJsonPath = path.join(config.name, 'package.json');
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );
  }

  /**
   * Setup TypeScript configuration
   * @param {ProjectConfig} config - Project configuration
   */
  async setupTypeScript(config: ProjectConfig): Promise<void> {
    const tsConfig = this.configGenerators.generateTsConfig(config);
    const tsConfigPath = path.join(config.name, 'tsconfig.json');
    await fs.writeFile(
      tsConfigPath,
      JSON.stringify(tsConfig, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );
  }

  /**
   * Setup ESLint configuration
   * @param {ProjectConfig} config - Project configuration
   */
  async setupESLint(config: ProjectConfig): Promise<void> {
    const eslintConfig = this.configGenerators.generateEslintConfig(config);
    const eslintConfigPath = path.join(config.name, '.eslintrc.json');
    await fs.writeFile(
      eslintConfigPath,
      JSON.stringify(eslintConfig, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );

    // Create .eslintignore
    const eslintIgnore = ['dist/', 'node_modules/', '*.js', 'coverage/'];
    const eslintIgnorePath = path.join(config.name, '.eslintignore');
    await fs.writeFile(eslintIgnorePath, eslintIgnore.join('\n'), 'utf-8');
  }

  /**
   * Setup Prettier configuration
   * @param {ProjectConfig} config - Project configuration
   */
  async setupPrettier(config: ProjectConfig): Promise<void> {
    const prettierConfig = this.configGenerators.generatePrettierConfig();
    const prettierConfigPath = path.join(config.name, '.prettierrc.json');
    await fs.writeFile(
      prettierConfigPath,
      JSON.stringify(prettierConfig, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );

    // Create .prettierignore
    const prettierIgnore = ['dist/', 'node_modules/', 'coverage/', '*.min.js'];
    const prettierIgnorePath = path.join(config.name, '.prettierignore');
    await fs.writeFile(prettierIgnorePath, prettierIgnore.join('\n'), 'utf-8');
  }

  /**
   * Setup testing configuration
   * @param {ProjectConfig} config - Project configuration
   */
  async setupTests(config: ProjectConfig): Promise<void> {
    // Update package.json with test scripts
    const packageJsonPath = path.join(config.name, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      test: 'vitest',
      'test:watch': 'vitest --watch',
      'test:coverage': 'vitest --coverage',
    };

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );

    // Create vitest.config.ts
    const vitestConfig = this.configGenerators.generateVitestConfig(config);
    const vitestConfigPath = path.join(config.name, 'vitest.config.ts');
    await fs.writeFile(vitestConfigPath, vitestConfig, 'utf-8');

    // Create sample test file
    const sampleTest = this.configGenerators.generateSampleTest(config);
    const testDir = path.join(config.name, 'src/tests');
    const testFilePath = path.join(testDir, 'sample.test.ts');
    await fs.writeFile(testFilePath, sampleTest, 'utf-8');
  }

  /**
   * Setup AI assistant configurations
   * @param {ProjectConfig} config - Project configuration
   */
  async setupAIAssistants(config: ProjectConfig): Promise<void> {
    for (const assistant of config.aiAssistants) {
      switch (assistant) {
        case 'claude-code':
          await this.setupClaudeCode(config);
          break;
        case 'copilot':
          await this.setupCopilot(config);
          break;
      }
    }
  }

  /**
   * Setup basic source files
   * @param {ProjectConfig} config - Project configuration
   */
  async setupSourceFiles(config: ProjectConfig): Promise<void> {
    const mainContent = this.templates.getMainFileContent(config.projectType, config.name);
    const mainPath = path.join(
      config.name,
      'src',
      this.templates.getMainFileName(config.projectType)
    );
    await fs.writeFile(mainPath, mainContent, 'utf-8');

    // Create index file for libraries
    if (config.projectType === 'library') {
      const indexContent = this.templates.getIndexFileContent(config.name);
      const indexPath = path.join(config.name, 'src', 'index.ts');
      await fs.writeFile(indexPath, indexContent, 'utf-8');
    }

    // Create project-specific files
    await this.createProjectSpecificFiles(config);
  }

  /**
   * Create project-specific files like vite.config.ts, CLI executables, etc.
   * @param {ProjectConfig} config - Project configuration
   */
  private async createProjectSpecificFiles(config: ProjectConfig): Promise<void> {
    switch (config.projectType) {
      case 'web':
        await this.createWebSpecificFiles(config);
        break;
      case 'cli':
        await this.createCliSpecificFiles(config);
        break;
      case 'library':
        await this.createLibrarySpecificFiles(config);
        break;
      case 'basic':
        await this.createBasicSpecificFiles();
        break;
    }
  }

  /**
   * Create web-specific files
   * @param {ProjectConfig} config - Project configuration
   */
  private async createWebSpecificFiles(config: ProjectConfig): Promise<void> {
    // Create vite.config.ts
    const viteConfig = this.configGenerators.generateViteConfig(config);
    const viteConfigPath = path.join(config.name, 'vite.config.ts');
    await fs.writeFile(viteConfigPath, viteConfig, 'utf-8');

    // Create index.html
    const indexHtml = this.configGenerators.generateIndexHtml(config);
    const indexHtmlPath = path.join(config.name, 'index.html');
    await fs.writeFile(indexHtmlPath, indexHtml, 'utf-8');

    // Create App.tsx
    const appContent = this.configGenerators.generateAppTsx(config);
    const appPath = path.join(config.name, 'src', 'App.tsx');
    await fs.writeFile(appPath, appContent, 'utf-8');

    // Create main.css
    const mainCss = this.configGenerators.generateMainCss(config);
    const mainCssPath = path.join(config.name, 'src', 'styles', 'main.css');
    await fs.writeFile(mainCssPath, mainCss, 'utf-8');

    // Create public/styles.css
    const publicCss = this.configGenerators.generatePublicCss(config);
    const publicCssPath = path.join(config.name, 'public', 'styles.css');
    await fs.writeFile(publicCssPath, publicCss, 'utf-8');
  }

  /**
   * Create CLI-specific files
   * @param {ProjectConfig} config - Project configuration
   */
  private async createCliSpecificFiles(config: ProjectConfig): Promise<void> {
    // Ensure bin directory exists
    const binDir = path.join(config.name, 'bin');
    await fs.mkdir(binDir, { recursive: true, mode: 0o755 });

    // Create CLI executable in bin directory
    const cliExecutable = this.configGenerators.generateCliExecutable(config);
    const cliPath = path.join(config.name, 'bin', config.name);
    await fs.writeFile(cliPath, cliExecutable, { mode: 0o755 });

    // Create CLI entry point in src/cli
    const cliEntryContent = this.configGenerators.generateCliEntryContent(config);
    const cliEntryPath = path.join(config.name, 'src', 'cli', 'index.ts');
    await fs.writeFile(cliEntryPath, cliEntryContent, 'utf-8');
  }

  /**
   * Create library-specific files
   * @param {ProjectConfig} config - Project configuration
   */
  private async createLibrarySpecificFiles(config: ProjectConfig): Promise<void> {
    // Create API documentation
    const apiDoc = this.configGenerators.generateApiDocumentation(config);
    const apiDocPath = path.join(config.name, 'docs', 'api.md');
    await fs.writeFile(apiDocPath, apiDoc, 'utf-8');
  }

  /**
   * Create basic-specific files
   */
  private async createBasicSpecificFiles(): Promise<void> {
    // Basic projects might not need additional files beyond the main source file
    // This is a placeholder for future basic-specific file generation
  }

  /**
   * Create initial project files
   * @param {ProjectConfig} config - Project configuration
   * @param {string} projectDir - Project directory
   */
  private async createInitialFiles(config: ProjectConfig, projectDir: string): Promise<void> {
    // Create README.md
    const readmeContent = this.templates.generateReadmeContent(config);
    const readmePath = path.join(projectDir, 'README.md');
    await fs.writeFile(readmePath, readmeContent, 'utf-8');

    // Create .gitignore
    const gitignoreContent = this.templates.generateGitignoreContent();
    const gitignorePath = path.join(projectDir, '.gitignore');
    await fs.writeFile(gitignorePath, gitignoreContent, 'utf-8');

    // Create LICENSE
    const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
    const licensePath = path.join(projectDir, 'LICENSE');
    await fs.writeFile(licensePath, licenseContent, 'utf-8');
  }

  /**
   * Setup Claude Code configuration
   * @param {ProjectConfig} config - Project configuration
   */
  private async setupClaudeCode(config: ProjectConfig): Promise<void> {
    const claudeConfig = this.configGenerators.generateClaudeConfig(config);
    const claudeConfigPath = path.join(config.name, '.claude.json');
    await fs.writeFile(
      claudeConfigPath,
      JSON.stringify(claudeConfig, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );
  }

  /**
   * Setup GitHub Copilot configuration
   * @param {ProjectConfig} config - Project configuration
   */
  private async setupCopilot(config: ProjectConfig): Promise<void> {
    const copilotConfig = this.configGenerators.generateCopilotConfig(config);
    const copilotConfigPath = path.join(config.name, '.github/copilot.yml');
    await fs.writeFile(
      copilotConfigPath,
      JSON.stringify(copilotConfig, null, JSON_SERIALIZATION.PRETTY_INDENT),
      'utf-8'
    );
  }
}
