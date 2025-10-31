/**
 * Init Command Implementation
 *
 * Implements the `nimata init` command for project scaffolding
 */

import type { CommandDefinition, CommandOption } from '../types/config-types.js';
import { EXIT_CODES, FORMATTING } from '../utils/constants.js';

/**
 * Simple output writer to avoid console statements
 */
class OutputWriter {
  /**
   * Write message to stdout
   * @param {string} message - Message to write
   */
  static write(message: string): void {
    process.stdout.write(message);
  }

  /**
   * Write error message to stderr
   * @param {string} message - Error message to write
   */
  static writeError(message: string): void {
    process.stderr.write(message);
  }

  /**
   * Write message with newline
   * @param {string} message - Message to write
   */
  static writeln(message = ''): void {
    process.stdout.write(`${message}\n`);
  }

  /**
   * Write error message with newline
   * @param {string} message - Error message to write
   */
  static writelnError(message: string): void {
    process.stderr.write(`${message}\n`);
  }
}

// Default AI assistant
const DEFAULT_AI_ASSISTANT = 'claude-code' as const;

// Command option definitions
const COMMAND_OPTIONS: CommandOption[] = [
  {
    flags: '-i, --interactive',
    description: 'Run in interactive mode (default)',
    defaultValue: true,
  },
  { flags: '-t, --template <template>', description: 'Project template to use' },
  {
    flags: '-q, --quality <quality>',
    description: 'Code quality level (light, medium, strict)',
    defaultValue: 'medium',
  },
  {
    flags: '-a, --ai <assistants>',
    description: 'AI assistants to enable (claude-code,copilot)',
    defaultValue: DEFAULT_AI_ASSISTANT,
  },
  {
    flags: '-d, --directory <directory>',
    description: 'Target directory (defaults to project name)',
  },
  {
    flags: '--skip-install',
    description: 'Skip npm/bun install after creation',
    defaultValue: false,
  },
  { flags: '--skip-git', description: 'Skip git initialization', defaultValue: false },
  { flags: '-v, --verbose', description: 'Verbose output', defaultValue: false },
];

// Type aliases for better readability
type QualityLevel = 'light' | 'medium' | 'strict';
type ProjectType = 'basic' | 'web' | 'cli' | 'library';
type AIAssistant = 'claude-code' | 'copilot';

// Valid AI assistants
const VALID_AI_ASSISTANTS = ['claude-code', 'copilot'] as const;

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: QualityLevel;
  projectType: ProjectType;
  aiAssistants: AIAssistant[];
}

export interface InitCommandOptions {
  interactive?: boolean;
  template?: string;
  quality?: string;
  ai?: string;
  directory?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
  verbose?: boolean;
}

/**
 * Init Command Class
 */
export class InitCommand {
  /**
   * Create and configure the init command
   * @returns {CommandDefinition} Command definition for the init command
   */
  createCommand(): CommandDefinition {
    return {
      name: 'init',
      description: 'Initialize a new TypeScript project',
      arguments: ['[project-name]'],
      options: this.getCommandOptions(),
      action: async (projectName: string | undefined, options: unknown) => {
        await this.execute(projectName, options as InitCommandOptions);
      },
    };
  }

  /**
   * Get the command options configuration
   * @returns {CommandOption[]} Array of command option definitions
   */
  private getCommandOptions(): CommandOption[] {
    return [...COMMAND_OPTIONS];
  }

  /**
   * Execute the init command
   * @param {string | undefined} projectName - Name of the project to initialize
   * @param {InitCommandOptions} options - Command options
   * @returns {void}
   */
  async execute(projectName: string | undefined, options: InitCommandOptions): Promise<void> {
    try {
      this.printWelcomeMessage();
      const config = await this.getProjectConfiguration(projectName, options);

      if (!config) {
        OutputWriter.writeln('❌ Project initialization cancelled');
        return;
      }

      this.showConfigurationSummary(config);
      OutputWriter.writeln('✅ Project configuration validated');
      this.showNextSteps(config, options);
    } catch (error: unknown) {
      this.handleError(error, options);
    }
  }

  /**
   * Print welcome message
   */
  private printWelcomeMessage(): void {
    OutputWriter.writeln('🚀 Nìmata CLI - TypeScript Project Generator');
    OutputWriter.writeln();
  }

  /**
   * Handle execution errors
   * @param {unknown} error - Error that occurred
   * @param {InitCommandOptions} options - Command options
   */
  private handleError(error: unknown, options: InitCommandOptions): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    OutputWriter.writelnError(`❌ Error creating project: ${errorMessage}`);
    if (options.verbose) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      if (errorStack) {
        OutputWriter.writelnError(errorStack);
      }
    }
    process.exit(EXIT_CODES.ERROR);
  }

  /**
   * Get project configuration from user input or defaults
   * @param {unknown} projectName - Name of the project to configure
   * @param {unknown} options - Command options
   * @returns {void} Project configuration or null if cancelled
   */
  private async getProjectConfiguration(
    projectName: string | undefined,
    options: InitCommandOptions
  ): Promise<ProjectConfig | null> {
    if (!projectName) {
      OutputWriter.writeln('Error: Project name is required');
      return null;
    }

    // Create configuration from command-line options
    return this.createConfigFromOptions(projectName, options);
  }

  /**
   * Create configuration from command-line options
   * @param {string} projectName - Name of the project
   * @param {InitCommandOptions} options - Command options
   * @returns { ProjectConfig} Project configuration
   */
  private createConfigFromOptions(projectName: string, options: InitCommandOptions): ProjectConfig {
    const qualityLevel = this.parseQualityLevel(options.quality || 'medium');
    const aiAssistants = this.parseAIAssistants(options.ai || DEFAULT_AI_ASSISTANT);
    const projectType = this.parseProjectType(options.template || 'basic');

    return {
      name: projectName,
      description: `A ${projectType} TypeScript project`,
      qualityLevel,
      projectType,
      aiAssistants,
    };
  }

  /**
   * Parse quality level from string
   * @param {string} quality - Quality level string to parse
   * @returns {string): 'light' | 'medium' | 'strict'} Parsed quality level
   */
  private parseQualityLevel(quality: string): 'light' | 'medium' | 'strict' {
    const validLevels = ['light', 'medium', 'strict'];
    if (validLevels.includes(quality)) {
      return quality as 'light' | 'medium' | 'strict';
    }
    OutputWriter.writelnError(`Warning: Invalid quality level "${quality}". Using "medium".`);
    return 'medium';
  }

  /**
   * Parse AI assistants from string
   * @param {string} ai - AI assistants string to parse
   * @returns {string): AIAssistant[]} Array of parsed AI assistants
   */
  private parseAIAssistants(ai: string): AIAssistant[] {
    const validAssistants = [...VALID_AI_ASSISTANTS];
    const assistants = ai.split(',').map((a) => a.trim().toLowerCase());

    const validAIAssistants: AIAssistant[] = assistants.filter((a): a is AIAssistant =>
      validAssistants.includes(a as AIAssistant)
    );

    if (validAIAssistants.length === 0) {
      OutputWriter.writelnError(
        `Warning: No valid AI assistants specified. Using "${DEFAULT_AI_ASSISTANT}".`
      );
      return [DEFAULT_AI_ASSISTANT as AIAssistant];
    }

    const invalid = assistants.filter((a) => !validAssistants.includes(a as AIAssistant));
    if (invalid.length > 0) {
      OutputWriter.writelnError(`Warning: Invalid AI assistants ignored: ${invalid.join(', ')}`);
    }

    return validAIAssistants;
  }

  /**
   * Parse project type from template string
   * @param {string} template - Template string to parse
   * @returns {string): 'basic' | 'web' | 'cli' | 'library'} Parsed project type
   */
  private parseProjectType(template: string): 'basic' | 'web' | 'cli' | 'library' {
    const templateMap: Record<string, 'basic' | 'web' | 'cli' | 'library'> = {
      basic: 'basic',
      web: 'web',
      website: 'web',
      cli: 'cli',
      command: 'cli',
      library: 'library',
      lib: 'library',
      package: 'library',
    };

    const normalized = template.toLowerCase();
    const projectType = templateMap[normalized];

    if (!projectType) {
      OutputWriter.writelnError(`Warning: Unknown template "${template}". Using "basic".`);
      return 'basic';
    }

    return projectType;
  }

  /**
   * Show configuration summary
   * @param {ProjectConfig} config - Project configuration to display
   * @returns {void}
   */
  private showConfigurationSummary(config: ProjectConfig): void {
    OutputWriter.writeln('📋 Project Configuration:');
    OutputWriter.writeln(`   Name: ${config.name}`);
    OutputWriter.writeln(`   Type: ${this.getProjectTypeName(config.projectType)}`);
    OutputWriter.writeln(`   Quality: ${config.qualityLevel}`);
    OutputWriter.writeln(`   AI Assistants: ${config.aiAssistants.join(', ')}`);
    OutputWriter.writeln();
  }

  /**
   * Show next steps to the user
   * @param {ProjectConfig} config - Project configuration
   * @param {InitCommandOptions} options - Command options
   * @returns {void}
   */
  private showNextSteps(config: ProjectConfig, options: InitCommandOptions): void {
    const projectPath = options.directory || config.name;

    this.printProjectReadyMessage(projectPath, options);
    this.printUsefulCommands();
    this.printAIAssistantInfo(config);
    OutputWriter.writeln();
    OutputWriter.writeln('Happy coding! 🚀');
  }

  /**
   * Print project ready message with next steps
   * @param {string} projectPath - Path to the project
   * @param {InitCommandOptions} options - Command options
   */
  private printProjectReadyMessage(projectPath: string, options: InitCommandOptions): void {
    OutputWriter.writeln('🎉 Project Ready! Next Steps:');
    OutputWriter.writeln(`   1. cd ${projectPath}`);

    if (options.skipInstall) {
      OutputWriter.writeln(`   ${FORMATTING.JSON_INDENT_SIZE}. bun install or npm install`);
      OutputWriter.writeln(`   3. bun run dev or npm run dev`);
    } else {
      OutputWriter.writeln(`   ${FORMATTING.JSON_INDENT_SIZE}. bun run dev or npm run dev`);
    }

    OutputWriter.writeln(`   3. Open your favorite editor and start coding!`);
  }

  /**
   * Print useful commands
   */
  private printUsefulCommands(): void {
    OutputWriter.writeln();
    OutputWriter.writeln('📚 Useful Commands:');
    OutputWriter.writeln(`   bun test - Run tests`);
    OutputWriter.writeln(`   bun run lint - Check code quality`);
    OutputWriter.writeln(`   bun run build - Build for production`);
  }

  /**
   * Print AI assistant information
   * @param {ProjectConfig} config - Project configuration
   */
  private printAIAssistantInfo(config: ProjectConfig): void {
    if (config.aiAssistants.includes(DEFAULT_AI_ASSISTANT)) {
      OutputWriter.writeln();
      OutputWriter.writeln('🤖 AI Assistant Ready:');
      OutputWriter.writeln(`   Claude Code is configured and ready to help!`);
      OutputWriter.writeln(`   Check CLAUDE.md for project-specific instructions.`);
    }

    if (config.aiAssistants.includes('copilot')) {
      OutputWriter.writeln();
      OutputWriter.writeln('🤖 AI Assistant Ready:');
      OutputWriter.writeln(`   GitHub Copilot is configured and ready to help!`);
      OutputWriter.writeln(`   Check .github/copilot-instructions.md for guidance.`);
    }
  }

  /**
   * Get project type name for display
   * @param {string} projectType - Project type to get display name for
   * @returns {string): string} Display name of the project type
   */
  private getProjectTypeName(projectType: string): string {
    const names = {
      basic: 'Basic TypeScript Project',
      web: 'Web Application',
      cli: 'CLI Application',
      library: 'Library Package',
    };
    return names[projectType as keyof typeof names] || 'Unknown';
  }
}

/**
 * Create an init command instance
 * @returns {InitCommand} New init command instance
 */
export function createInitCommand(): InitCommand {
  return new InitCommand();
}
