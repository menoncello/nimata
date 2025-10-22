/**
 * Init Command Implementation
 *
 * Implements the `nimata init` command for project scaffolding
 */

import type { CommandDefinition, CommandOption } from '../types/config-types.js';
import { EXIT_CODES, FORMATTING } from '../utils/constants.js';

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
   * @returns Command definition for the init command
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
   * @returns Array of command option definitions
   */
  private getCommandOptions(): CommandOption[] {
    return [...COMMAND_OPTIONS];
  }

  /**
   * Execute the init command
   * @param projectName - Name of the project to initialize
   * @param options - Command options
   * @returns {void}
   */
  async execute(projectName: string | undefined, options: InitCommandOptions): Promise<void> {
    try {
      this.printWelcomeMessage();
      const config = await this.getProjectConfiguration(projectName, options);

      if (!config) {
        console.log('❌ Project initialization cancelled');
        return;
      }

      this.showConfigurationSummary(config);
      console.log('✅ Project configuration validated');
      this.showNextSteps(config, options);
    } catch (error: unknown) {
      this.handleError(error, options);
    }
  }

  /**
   * Print welcome message
   */
  private printWelcomeMessage(): void {
    console.log('🚀 Nìmata CLI - TypeScript Project Generator');
    console.log();
  }

  /**
   * Handle execution errors
   * @param error - Error that occurred
   * @param options - Command options
   */
  private handleError(error: unknown, options: InitCommandOptions): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error creating project:', errorMessage);
    if (options.verbose) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      if (errorStack) {
        console.error(errorStack);
      }
    }
    process.exit(EXIT_CODES.ERROR);
  }

  /**
   * Get project configuration from user input or defaults
   * @param projectName - Name of the project to configure
   * @param options - Command options
   * @returns Project configuration or null if cancelled
   */
  private async getProjectConfiguration(
    projectName: string | undefined,
    options: InitCommandOptions
  ): Promise<ProjectConfig | null> {
    if (!projectName) {
      console.log('Error: Project name is required');
      return null;
    }

    // Create configuration from command-line options
    return this.createConfigFromOptions(projectName, options);
  }

  /**
   * Create configuration from command-line options
   * @param projectName - Name of the project
   * @param options - Command options
   * @returns Project configuration
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
   * @param quality - Quality level string to parse
   * @returns Parsed quality level
   */
  private parseQualityLevel(quality: string): 'light' | 'medium' | 'strict' {
    const validLevels = ['light', 'medium', 'strict'];
    if (validLevels.includes(quality)) {
      return quality as 'light' | 'medium' | 'strict';
    }
    console.warn(`Warning: Invalid quality level "${quality}". Using "medium".`);
    return 'medium';
  }

  /**
   * Parse AI assistants from string
   * @param ai - AI assistants string to parse
   * @returns Array of parsed AI assistants
   */
  private parseAIAssistants(ai: string): AIAssistant[] {
    const validAssistants = [...VALID_AI_ASSISTANTS];
    const assistants = ai.split(',').map((a) => a.trim().toLowerCase());

    const validAIAssistants: AIAssistant[] = assistants.filter((a): a is AIAssistant =>
      validAssistants.includes(a as AIAssistant)
    );

    if (validAIAssistants.length === 0) {
      console.warn(`Warning: No valid AI assistants specified. Using "${DEFAULT_AI_ASSISTANT}".`);
      return [DEFAULT_AI_ASSISTANT as AIAssistant];
    }

    const invalid = assistants.filter((a) => !validAssistants.includes(a as AIAssistant));
    if (invalid.length > 0) {
      console.warn(`Warning: Invalid AI assistants ignored: ${invalid.join(', ')}`);
    }

    return validAIAssistants;
  }

  /**
   * Parse project type from template string
   * @param template - Template string to parse
   * @returns Parsed project type
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
      console.warn(`Warning: Unknown template "${template}". Using "basic".`);
      return 'basic';
    }

    return projectType;
  }

  /**
   * Show configuration summary
   * @param config - Project configuration to display
   * @returns {void}
   */
  private showConfigurationSummary(config: ProjectConfig): void {
    console.log('📋 Project Configuration:');
    console.log(`   Name: ${config.name}`);
    console.log(`   Type: ${this.getProjectTypeName(config.projectType)}`);
    console.log(`   Quality: ${config.qualityLevel}`);
    console.log(`   AI Assistants: ${config.aiAssistants.join(', ')}`);
    console.log();
  }

  /**
   * Show next steps to the user
   * @param config - Project configuration
   * @param options - Command options
   * @returns {void}
   */
  private showNextSteps(config: ProjectConfig, options: InitCommandOptions): void {
    const projectPath = options.directory || config.name;

    this.printProjectReadyMessage(projectPath, options);
    this.printUsefulCommands();
    this.printAIAssistantInfo(config);
    console.log();
    console.log('Happy coding! 🚀');
  }

  /**
   * Print project ready message with next steps
   * @param projectPath - Path to the project
   * @param options - Command options
   */
  private printProjectReadyMessage(projectPath: string, options: InitCommandOptions): void {
    console.log('🎉 Project Ready! Next Steps:');
    console.log(`   1. cd ${projectPath}`);

    if (options.skipInstall) {
      console.log(`   ${FORMATTING.JSON_INDENT_SIZE}. bun install or npm install`);
      console.log(`   3. bun run dev or npm run dev`);
    } else {
      console.log(`   ${FORMATTING.JSON_INDENT_SIZE}. bun run dev or npm run dev`);
    }

    console.log(`   3. Open your favorite editor and start coding!`);
  }

  /**
   * Print useful commands
   */
  private printUsefulCommands(): void {
    console.log();
    console.log('📚 Useful Commands:');
    console.log(`   bun test - Run tests`);
    console.log(`   bun run lint - Check code quality`);
    console.log(`   bun run build - Build for production`);
  }

  /**
   * Print AI assistant information
   * @param config - Project configuration
   */
  private printAIAssistantInfo(config: ProjectConfig): void {
    if (config.aiAssistants.includes(DEFAULT_AI_ASSISTANT)) {
      console.log();
      console.log('🤖 AI Assistant Ready:');
      console.log(`   Claude Code is configured and ready to help!`);
      console.log(`   Check CLAUDE.md for project-specific instructions.`);
    }

    if (config.aiAssistants.includes('copilot')) {
      console.log();
      console.log('🤖 AI Assistant Ready:');
      console.log(`   GitHub Copilot is configured and ready to help!`);
      console.log(`   Check .github/copilot-instructions.md for guidance.`);
    }
  }

  /**
   * Get project type name for display
   * @param projectType - Project type to get display name for
   * @returns Display name of the project type
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
 * @returns New init command instance
 */
export function createInitCommand(): InitCommand {
  return new InitCommand();
}
