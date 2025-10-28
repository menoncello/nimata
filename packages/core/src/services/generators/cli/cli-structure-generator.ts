/**
 * CLI Structure Generator (Refactored)
 *
 * Generates CLI-specific project structure and files using modular approach
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { FILE_PERMISSIONS } from '../../validators/validation-constants.js';
import type { DirectoryItem } from '../core/core-file-operations.js';
import { CLICommandGenerators } from './cli-command-generators.js';
import { CLIIndexGenerators } from './cli-index-generators.js';
import { CLITypeConfigGenerators } from './cli-type-config-generators.js';
import { CLIUtilGenerators } from './cli-util-generators.js';

/**
 * Generator for CLI project structures (Refactored)
 */
export class CLIStructureGenerator {
  private readonly commandGenerators: CLICommandGenerators;
  private readonly utilGenerators: CLIUtilGenerators;
  private readonly typeConfigGenerators: CLITypeConfigGenerators;
  private readonly indexGenerators: CLIIndexGenerators;

  /**
   * Initialize CLI structure generator
   */
  constructor() {
    this.commandGenerators = new CLICommandGenerators();
    this.utilGenerators = new CLIUtilGenerators();
    this.typeConfigGenerators = new CLITypeConfigGenerators();
    this.indexGenerators = new CLIIndexGenerators();
  }

  /**
   * Generate CLI project structure
   * @param config - Project configuration
   * @returns CLI-specific directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const directories = this.getCLIDirectories();
    const files = this.getCLIFiles(config);

    return [...directories, ...files];
  }

  /**
   * Get CLI-specific directory structure
   * @returns Array of directory items
   */
  private getCLIDirectories(): DirectoryItem[] {
    return [
      { path: 'src/commands', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'src/utils', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'src/types', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'src/services', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'src/config', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'tests', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'tests/unit', type: 'directory', mode: FILE_PERMISSIONS },
      { path: 'tests/integration', type: 'directory', mode: FILE_PERMISSIONS },
    ];
  }

  /**
   * Get CLI-specific files
   * @param config - Project configuration
   * @returns Array of file items
   */
  private getCLIFiles(config: ProjectConfig): DirectoryItem[] {
    const coreFiles = this.getCoreCLIFiles(config);
    const commandFiles = this.getCommandFiles(config);
    const utilFiles = this.getUtilFiles(config);

    return [...coreFiles, ...commandFiles, ...utilFiles];
  }

  /**
   * Get core CLI files
   * @param config - Project configuration
   * @returns Array of core CLI file items
   */
  private getCoreCLIFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/index.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.indexGenerators.generateCLIIndex(config),
      },
      {
        path: 'src/types/index.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.typeConfigGenerators.generateCLITypes(config),
      },
      {
        path: 'src/config/app-config.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.typeConfigGenerators.generateCLIConfig(config),
      },
    ];
  }

  /**
   * Get command files
   * @param config - Project configuration
   * @returns Array of command file items
   */
  private getCommandFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/commands/index.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.commandGenerators.generateCommandsIndex(config),
      },
      {
        path: 'src/commands/hello-command.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.commandGenerators.generateHelloCommand(config),
      },
    ];
  }

  /**
   * Get utility files
   * @param config - Project configuration
   * @returns Array of utility file items
   */
  private getUtilFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: 'src/utils/logger.ts',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.utilGenerators.generateLoggerUtil(config),
      },
    ];
  }
}
