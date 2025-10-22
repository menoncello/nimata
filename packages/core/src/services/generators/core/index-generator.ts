/**
 * Index File Generator
 *
 * Generates main index.ts files with interfaces and classes
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';

/**
 * Generator for main index files
 */
export class IndexGenerator {
  /**
   * Generate main index.ts file content
   * @param config - Project configuration
   * @returns Index file TypeScript code
   */
  generateIndexFile(config: ProjectConfig): string {
    const exportInterface = this.generateExportInterface(config);
    const exportClass = this.generateExportClass(config);
    const documentation = this.generateIndexDocumentation(config);

    return `${documentation}

${exportInterface}

${exportClass}`;
  }

  /**
   * Generate export interface
   * @param config - Project configuration
   * @returns Interface TypeScript code
   */
  private generateExportInterface(config: ProjectConfig): string {
    const baseInterface = this.getBaseInterface(config);
    const additionalInterface = this.getAdditionalInterface(config);

    return additionalInterface ? `${baseInterface}\n\n${additionalInterface}` : baseInterface;
  }

  /**
   * Get base interface definition
   * @param config - Project configuration
   * @returns Base interface code
   */
  private getBaseInterface(config: ProjectConfig): string {
    return `/**
 * ${config.name} configuration and utilities
 */
export interface ${toPascalCase(config.name)}Config {
  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Custom options for ${config.name}
   */
  options?: Record<string, unknown>;
}`;
  }

  /**
   * Get additional interface based on project type
   * @param config - Project configuration
   * @returns Additional interface code or empty string
   */
  private getAdditionalInterface(config: ProjectConfig): string {
    switch (config.projectType) {
      case 'bun-react':
      case 'bun-vue':
        return this.getReactInterface(config);
      case 'bun-express':
        return this.getExpressInterface(config);
      default:
        return '';
    }
  }

  /**
   * Get React-specific interface
   * @param config - Project configuration
   * @returns React interface code
   */
  private getReactInterface(config: ProjectConfig): string {
    return `export interface ${toPascalCase(config.name)}Props {
  /**
   * Component children
   */
  children?: React.ReactNode;
}`;
  }

  /**
   * Get Express-specific interface
   * @param config - Project configuration
   * @returns Express interface code
   */
  private getExpressInterface(config: ProjectConfig): string {
    return `export interface ${toPascalCase(config.name)}Middleware {
  /**
   * Express middleware function
   */
  (req: any, res: any, next: any): void;
}`;
  }

  /**
   * Generate export class
   * @param config - Project configuration
   * @returns Class TypeScript code
   */
  private generateExportClass(config: ProjectConfig): string {
    const className = `${toPascalCase(config.name)}Core`;

    return [
      this.getClassHeader(config, className),
      this.getClassConstructor(config, className),
      this.getInitializeMethod(config),
      this.getConfigMethod(className),
      this.getUpdateConfigMethod(className),
      this.getClassFooter(),
    ].join('\n');
  }

  /**
   * Get class header
   * @param config - Project configuration
   * @param className - Class name
   * @returns Class header
   */
  private getClassHeader(config: ProjectConfig, className: string): string {
    return `/**
 * ${config.name} core functionality
 */
export class ${className} {
  private config: ${toPascalCase(config.name)}Config;`;
  }

  /**
   * Get class constructor
   * @param config - Project configuration
   * @param _className - Class name (unused, kept for interface compatibility)
   * @returns Class constructor
   */
  private getClassConstructor(config: ProjectConfig, _className: string): string {
    return `  constructor(config: ${toPascalCase(config.name)}Config = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config
    };
  }`;
  }

  /**
   * Get initialize method
   * @param config - Project configuration
   * @returns Initialize method
   */
  private getInitializeMethod(config: ProjectConfig): string {
    return `  /**
   * Initialize ${config.name}
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log(\`${config.name} initialized with debug mode\`);
    }
  }`;
  }

  /**
   * Get getConfig method
   * @param className - Class name
   * @returns GetConfig method
   */
  private getConfigMethod(className: string): string {
    return `  /**
   * Get current configuration
   */
  getConfig(): ${this.toPascalCase(className.replace('Core', ''))}Config {
    return { ...this.config };
  }`;
  }

  /**
   * Get updateConfig method
   * @param className - Class name
   * @returns UpdateConfig method
   */
  private getUpdateConfigMethod(className: string): string {
    return `  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<${this.toPascalCase(className.replace('Core', ''))}Config>): void {
    this.config = { ...this.config, ...newConfig };
  }`;
  }

  /**
   * Get class footer
   * @returns Class footer
   */
  private getClassFooter(): string {
    return `}`;
  }

  /**
   * Generate index documentation
   * @param config - Project configuration
   * @returns Documentation JSDoc comment
   */
  private generateIndexDocumentation(config: ProjectConfig): string {
    return `/**
 * ${config.name}
 * ${config.description || 'A modern TypeScript library built with Bun'}
 *
 * @author ${config.author || 'Unknown'}
 * @license ${config.license || 'MIT'}
 * @version 1.0.0
 *
 * This package was generated using ${config.template || 'basic'} template
 * with ${config.qualityLevel} quality standards.
 */`;
  }

  /**
   * Convert string to PascalCase
   * @param str - Input string
   * @returns PascalCase string
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w)|[A-Z]|(?:\b\w)/g, (word) => {
        return word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/_/g, '');
  }
}
