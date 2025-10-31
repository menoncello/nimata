/**
 * CLI class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate CLI class constructor
 * @param {string} className - Class name
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Constructor code
 */
function generateConstructor(className: string, config: ProjectConfig): string {
  return `  constructor(config: Partial<${className}Config> = {}) {
    this.config = {
      name: '${config.name}',
      version: '1.0.0',
      debug: false,
      ...config
    };
  }`;
}

/**
 * Generate initialize method
 * @returns {string} Initialize method code
 */
function generateInitializeMethod(): string {
  return `  /**
   * Initialize CLI application
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.config.debug) {
      console.log(\`\${this.config.name} CLI v\${this.config.version} initializing...\`);
    }

    // Initialize CLI-specific logic here
    this.initialized = true;

    if (this.config.debug) {
      console.log('CLI initialized successfully');
    }
  }`;
}

/**
 * Generate execute command method
 * @returns {string} Execute command method code
 */
function generateExecuteCommandMethod(): string {
  return `  /**
   * Execute CLI command
   * @param {string} command - Command to execute
   * @param {string} args - Command arguments
   * @returns {string} Command result
   */
  async executeCommand(command: string, args: string[] = []): Promise<CommandResult> {
    if (!this.initialized) {
      throw new Error('CLI must be initialized before executing commands');
    }

    try {
      if (this.config.debug) {
        console.log(\`Executing command: \${command} with args: \${args.join(' ')}\`);
      }

      // Command execution logic here
      return {
        success: true,
        data: \`Command \${command} executed successfully\`,
        exitCode: 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        exitCode: 1,
      };
    }
  }`;
}

/**
 * Generate configuration methods
 * @param {string} className - Class name
 * @returns {string} Configuration methods code
 */
function generateConfigMethods(className: string): string {
  return `  /**
   * Get current configuration
   */
  getConfig(): ${className}Config {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<${className}Config>): void {
    this.config = { ...this.config, ...updates };
  }`;
}

/**
 * Generate CLI class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} CLI class TypeScript code
 */
export function generateCLIClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);

  const constructorCode = generateConstructor(className, config);
  const initializeMethod = generateInitializeMethod();
  const executeCommandMethod = generateExecuteCommandMethod();
  const configMethods = generateConfigMethods(className);

  return `export class ${className}CLI {
  private config: ${className}Config;
  private initialized: boolean = false;

${constructorCode}

${initializeMethod}

${executeCommandMethod}

${configMethods}
}`;
}
