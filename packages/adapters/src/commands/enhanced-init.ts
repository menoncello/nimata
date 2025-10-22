/**
 * Enhanced Init Command Implementation (Refactored)
 *
 * Improved `nimata init` command with better UX, progress indicators, and error handling
 * Refactored into smaller, focused modules for better maintainability
 */

import { CLI, CLILogger, CLIErrorHandler } from '../utils/cli-helpers';
import { EXIT_CODES } from '../utils/constants.js';
import { Help } from '../utils/help-system';
import { Performance, PerformanceMonitor } from '../utils/performance';
import { Progress, PROJECT_GENERATION_STEPS } from '../utils/progress';
import { type EnhancedInitCommandOptions, type ProjectConfig } from './enhanced-init-types.js';
import { ProjectGenerationOrchestrator } from './project-generation-orchestrator.js';

/**
 * Enhanced Init Command Class
 */
export class EnhancedInitCommand {
  private logger: CLILogger;
  private errorHandler: CLIErrorHandler;
  private orchestrator: ProjectGenerationOrchestrator;

  /**
   * Creates a new EnhancedInitCommand instance
   */
  constructor() {
    this.logger = CLI.logger({
      verbose: false,
      silent: false,
      color: true,
    });
    this.errorHandler = CLI.errorHandler(this.logger);
    this.orchestrator = new ProjectGenerationOrchestrator(this.logger);
  }

  /**
   * Get command options for help display
   * @returns Command options array
   */
  getCommandOptions(): Array<{
    flags: string;
    description: string;
  }> {
    return [
      ...this.getProjectConfigurationOptions(),
      ...this.getProcessControlOptions(),
      ...this.getUtilityOptions(),
    ];
  }

  /**
   * Get project configuration related options
   * @returns Project configuration options
   */
  private getProjectConfigurationOptions(): Array<{
    flags: string;
    description: string;
  }> {
    return [
      {
        flags: '-i, --interactive',
        description: 'Interactive mode with guided setup',
      },
      {
        flags: '-t, --template <template>',
        description: 'Template to use for project generation',
      },
      {
        flags: '-q, --quality <level>',
        description: 'Quality level (light, medium, strict)',
      },
      {
        flags: '-a, --ai <assistants>',
        description: 'AI assistants to configure (comma-separated)',
      },
      {
        flags: '-d, --directory <path>',
        description: 'Target directory for project creation',
      },
    ];
  }

  /**
   * Get process control related options
   * @returns Process control options
   */
  private getProcessControlOptions(): Array<{
    flags: string;
    description: string;
  }> {
    return [
      {
        flags: '--skip-install',
        description: 'Skip npm dependencies installation',
      },
      {
        flags: '--skip-git',
        description: 'Skip git repository initialization',
      },
    ];
  }

  /**
   * Get utility options
   * @returns Utility options
   */
  private getUtilityOptions(): Array<{
    flags: string;
    description: string;
  }> {
    return [
      {
        flags: '-v, --verbose',
        description: 'Enable verbose output',
      },
      {
        flags: '-h, --help',
        description: 'Show help information',
      },
    ];
  }

  /**
   * Execute the enhanced init command
   * @param projectName - Name of the project to create
   * @param options - Command options
   */
  async execute(
    projectName: string | undefined,
    options: EnhancedInitCommandOptions
  ): Promise<void> {
    const { monitor, operationId } = this.initializePerformanceMonitoring();

    try {
      this.setupLogger(options);

      if (options.help) {
        Help.command('init');
        return;
      }

      this.logger.header('🚀 Nìmata CLI - TypeScript Project Generator');

      const config = await this.getProjectConfiguration(projectName, options);
      if (!config) {
        this.logger.warn('Project initialization cancelled');
        return;
      }

      await this.executeProjectGeneration(config, options, monitor, operationId);
    } catch (error) {
      this.handleExecutionError(error, monitor, operationId);
    }
  }

  /**
   * Initialize performance monitoring
   * @returns Performance monitor and operation ID
   */
  private initializePerformanceMonitoring(): { monitor: PerformanceMonitor; operationId: string } {
    const monitor = Performance.monitor();
    const operationId = monitor.start('nimata-init');
    return { monitor, operationId };
  }

  /**
   * Get project configuration
   * @param projectName - Project name
   * @param options - Command options
   * @returns Project configuration or null if cancelled
   */
  private async getProjectConfiguration(
    projectName: string | undefined,
    options: EnhancedInitCommandOptions
  ): Promise<ProjectConfig | null> {
    this.orchestrator.validateProjectNameOrExit(projectName);

    return this.orchestrator.getProjectConfiguration(projectName || '', options);
  }

  /**
   * Execute the main project generation steps
   * @param config - Project configuration
   * @param options - Command options
   * @param monitor - Performance monitor
   * @param operationId - Operation ID
   */
  private async executeProjectGeneration(
    config: ProjectConfig,
    options: EnhancedInitCommandOptions,
    monitor: PerformanceMonitor,
    operationId: string
  ): Promise<void> {
    const progress = Progress.steps(PROJECT_GENERATION_STEPS, 'Initializing project');

    this.orchestrator.showConfigurationSummary(config);
    await this.orchestrator.generateProject(config, options, progress);
    this.orchestrator.showCompletionMessage(config, options);
    this.showPerformanceMetricsIfNeeded(options.verbose, monitor, operationId);
  }

  /**
   * Handle execution errors
   * @param error - The error that occurred
   * @param monitor - Performance monitor
   * @param operationId - Operation ID
   */
  private handleExecutionError(
    error: unknown,
    monitor: PerformanceMonitor,
    operationId: string
  ): void {
    monitor.stop(operationId);
    this.errorHandler.handleError(error as Error, 'project initialization');
    process.exit(EXIT_CODES.ERROR);
  }

  /**
   * Setup logger with provided options
   * @param options - Command options
   */
  private setupLogger(options: EnhancedInitCommandOptions): void {
    this.logger = CLI.logger({
      verbose: options.verbose,
      silent: false,
      color: true,
    });

    // Update orchestrator with new logger
    this.orchestrator = new ProjectGenerationOrchestrator(this.logger);
  }

  /**
   * Show performance metrics if verbose mode is enabled
   * @param verbose - Whether verbose mode is enabled
   * @param monitor - Performance monitor instance
   * @param operationId - Operation ID to stop
   */
  private showPerformanceMetricsIfNeeded(
    verbose: boolean | undefined,
    monitor: PerformanceMonitor,
    operationId: string
  ): void {
    if (verbose) {
      const metric = monitor.stop(operationId);
      if (metric) {
        this.logger.info(
          `Project generated in ${Performance.formatDuration(metric.duration || 0)}`
        );
      }
    }
  }
}
