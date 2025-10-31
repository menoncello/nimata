/**
 * Project Generation Orchestrator
 *
 * Coordinates the project generation process with progress tracking
 */

import type { StepProgressIndicatorInterface } from '../types/config-types.js';
import { CLILogger } from '../utils/cli-helpers';
import { FORMATTING } from '../utils/constants.js';
import { PROJECT_GENERATION_STEPS } from '../utils/progress';
import { ConfigValidator } from './config-validator.js';
import type { EnhancedInitCommandOptions, ProjectConfig } from './enhanced-init-types.js';
import {
  installDependencies,
  initializeGitRepository,
  PROJECT_GENERATION_STEP_DEFINITIONS,
} from './project-generation-orchestrator-helpers.js';
import { ProjectSetup } from './project-setup.js';

/**
 * Project Generation Orchestrator Class
 */
export class ProjectGenerationOrchestrator {
  private logger: CLILogger;
  private configValidator: ConfigValidator;
  private projectSetup: ProjectSetup;

  /**
   * Initialize the project generation orchestrator
   * @param {CLILogger} logger - CLI logger instance for progress reporting
   */
  constructor(logger: CLILogger) {
    this.logger = logger;
    this.configValidator = new ConfigValidator(logger);
    this.projectSetup = new ProjectSetup(logger);
  }

  /**
   * Validate project name and exit if invalid
   * @param {string | undefined} projectName - Project name to validate
   */
  validateProjectNameOrExit(projectName: string | undefined): void {
    this.configValidator.validateProjectNameOrExit(projectName);
  }

  /**
   * Generate the entire project with progress tracking
   * @param {unknown} config - Project configuration
   * @param {unknown} options - Command options
   * @param {unknown} progress - Progress indicator
   */
  async generateProject(
    config: ProjectConfig,
    options: EnhancedInitCommandOptions,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    // Initialize progress
    progress.start(PROJECT_GENERATION_STEPS, 'Generating project...');

    try {
      // Execute core generation steps
      await this.executeCoreGenerationSteps(config, options, progress);

      // Execute optional steps
      await this.executeOptionalSteps(config, options, progress);

      progress.complete();
      this.logger.success('✅ Project generated successfully!');
    } catch (error) {
      progress.fail();
      throw error;
    }
  }

  /**
   * Get project configuration with validation
   * @param {unknown} projectName - Project name
   * @param {unknown} options - Command options
   * @returns {void} Project configuration or null if cancelled
   */
  async getProjectConfiguration(
    projectName: string,
    options: EnhancedInitCommandOptions
  ): Promise<ProjectConfig | null> {
    const spinner = this.logger.spinner('Validating configuration...');
    spinner.start();

    try {
      const config = this.configValidator.createConfigFromOptions(projectName, options);

      // Validate configuration
      await this.configValidator.validateConfiguration(config);

      spinner.start();
      return config;
    } catch (error) {
      spinner.stop('Configuration validation failed');
      throw error;
    }
  }

  /**
   * Execute core project generation steps
   * @param {unknown} config - Project configuration
   * @param {unknown} options - Command options
   * @param {unknown} progress - Progress indicator
   */
  private async executeCoreGenerationSteps(
    config: ProjectConfig,
    options: EnhancedInitCommandOptions,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    const steps = [
      () => this.createDirectoryStructure(config, options, progress),
      () => this.generatePackageJson(config, progress),
      () => this.setupTypeScript(config, progress),
      () => this.configureESLint(config, progress),
      () => this.addPrettier(config, progress),
      () => this.setupTests(config, progress),
      () => this.configureAIAssistants(config, progress),
      () => this.createSourceFiles(config, progress),
      () => this.validateGeneratedProjectStep(config, progress),
    ];

    for (const step of steps) {
      await step();
      progress.nextStep();
    }
  }

  /**
   * Create directory structure
   * @param {unknown} config - Project configuration
   * @param {unknown} options - Command options
   * @param {unknown} progress - Progress indicator
   */
  private async createDirectoryStructure(
    config: ProjectConfig,
    options: EnhancedInitCommandOptions,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.CREATE_DIRECTORIES.description);
    await this.projectSetup.createDirectoryStructure(config, options.directory);
  }

  /**
   * Generate package.json
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async generatePackageJson(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.GENERATE_PACKAGE_JSON.description);
    await this.projectSetup.generatePackageJson(config);
  }

  /**
   * Setup TypeScript
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async setupTypeScript(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(
      FORMATTING.JSON_INDENT_SIZE,
      PROJECT_GENERATION_STEP_DEFINITIONS.SETUP_TYPESCRIPT.description
    );
    await this.projectSetup.setupTypeScript(config);
  }

  /**
   * Configure ESLint
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async configureESLint(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.CONFIGURE_ESLINT.description);
    await this.projectSetup.setupESLint(config);
  }

  /**
   * Add Prettier
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async addPrettier(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.ADD_PRETTIER.description);
    await this.projectSetup.setupPrettier(config);
  }

  /**
   * Setup tests
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async setupTests(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.SETUP_TESTS.description);
    await this.projectSetup.setupTests(config);
  }

  /**
   * Configure AI assistants
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async configureAIAssistants(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(
      FORMATTING.JSON_INDENT_SIZE,
      PROJECT_GENERATION_STEP_DEFINITIONS.CONFIGURE_AI_ASSISTANTS.description
    );
    await this.projectSetup.setupAIAssistants(config);
  }

  /**
   * Create source files
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async createSourceFiles(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(
      FORMATTING.JSON_INDENT_SIZE,
      PROJECT_GENERATION_STEP_DEFINITIONS.CREATE_SOURCE_FILES.description
    );
    await this.projectSetup.setupSourceFiles(config);
  }

  /**
   * Validate generated project
   * @param {unknown} config - Project configuration
   * @param {unknown} progress - Progress indicator
   */
  private async validateGeneratedProjectStep(
    config: ProjectConfig,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    progress.update(1, PROJECT_GENERATION_STEP_DEFINITIONS.VALIDATE_PROJECT.description);
    await this.validateGeneratedProject(config);
  }

  /**
   * Execute optional project generation steps
   * @param {unknown} config - Project configuration
   * @param {unknown} options - Command options
   * @param {unknown} progress - Progress indicator
   */
  private async executeOptionalSteps(
    config: ProjectConfig,
    options: EnhancedInitCommandOptions,
    progress: StepProgressIndicatorInterface
  ): Promise<void> {
    // Optional: Install dependencies
    if (!options.skipInstall) {
      progress.nextStep();
      progress.update(1, 'Installing dependencies...');
      await this.installDependencies(config, options.directory);
    }

    // Optional: Initialize git repository
    if (!options.skipGit) {
      progress.nextStep();
      progress.update(1, 'Initializing git repository...');
      await this.initializeGitRepository(config, options.directory);
    }
  }

  /**
   * Validate the generated project
   * @param {ProjectConfig} config - Project configuration
   */
  private async validateGeneratedProject(config: ProjectConfig): Promise<void> {
    const { existsSync } = await import('node:fs');
    const path = await import('node:path');

    const projectDir = config.name;
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      '.eslintrc.json',
      '.prettierrc.json',
      'src/index.ts',
    ];

    const missingFiles: string[] = [];
    for (const file of requiredFiles) {
      const filePath = path.join(projectDir, file);
      if (!existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Project validation failed. Missing files: ${missingFiles.join(', ')}`);
    }
  }

  /**
   * Install npm dependencies
   * @param {ProjectConfig} config - Project configuration
   * @param {unknown} targetDir - Target directory
   */
  private async installDependencies(config: ProjectConfig, targetDir?: string): Promise<void> {
    const projectDir = targetDir || config.name;
    await installDependencies(projectDir, this.logger);
  }

  /**
   * Initialize git repository
   * @param {ProjectConfig} config - Project configuration
   * @param {unknown} targetDir - Target directory
   */
  private async initializeGitRepository(config: ProjectConfig, targetDir?: string): Promise<void> {
    const projectDir = targetDir || config.name;
    await initializeGitRepository(projectDir, this.logger);
  }

  /**
   * Show configuration summary to user
   * @param {ProjectConfig} config - Project configuration
   */
  showConfigurationSummary(config: ProjectConfig): void {
    this.logger.info('Project Configuration:');
    this.logger.info(`  Name: ${config.name}`);
    this.logger.info(`  Type: ${config.projectType}`);
    this.logger.info(`  Quality: ${config.qualityLevel}`);
    this.logger.info(`  AI Assistants: ${config.aiAssistants.join(', ')}`);
    this.logger.info(`  Description: ${config.description}`);
  }

  /**
   * Show completion message to user
   * @param {ProjectConfig} config - Project configuration
   * @param {EnhancedInitCommandOptions} options - Command options
   */
  showCompletionMessage(config: ProjectConfig, options: EnhancedInitCommandOptions): void {
    this.logger.success('\n🎉 Project created successfully!');
    this.logger.info(`\nNext steps:`);
    this.logger.info(`  1. cd ${config.name}`);

    if (options.skipInstall) {
      this.logger.info(`  ${FORMATTING.JSON_INDENT_SIZE}. npm install`);
      this.logger.info(`  3. npm run dev`);
    } else {
      this.logger.info(`  ${FORMATTING.JSON_INDENT_SIZE}. npm run dev`);
    }

    this.logger.info(`\nUseful commands:`);
    this.logger.info(`  • npm run build    - Build the project`);
    this.logger.info(`  • npm run test     - Run tests`);
    this.logger.info(`  • npm run lint     - Check code quality`);
    this.logger.info(`  • npm run format   - Format code`);
  }
}
