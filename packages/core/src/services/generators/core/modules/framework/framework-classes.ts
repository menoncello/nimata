/**
 * Framework class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Framework class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Framework class TypeScript code
 */
export function generateFrameworkClass(config: ProjectConfig): string {
  switch (config.projectType) {
    case 'bun-react':
      return generateReactClass(config);
    case 'bun-vue':
      return generateVueClass(config);
    case 'bun-express':
      return generateExpressClass(config);
    default:
      return generateBasicClass(config);
  }
}

/**
 * Generate React class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} React class TypeScript code
 */
export function generateReactClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `export class ${className}Core {
  private config: ${className}Config;

  constructor(config: Partial<${className}Config> = {}) {
    this.config = {
      debug: false,
      props: {},
      ...config
    };
  }

  /**
   * Initialize React component
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log('React component initialized');
    }
  }
}`;
}

/**
 * Generate Vue class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Vue class TypeScript code
 */
export function generateVueClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `export class ${className}Core {
  private config: ${className}Config;

  constructor(config: Partial<${className}Config> = {}) {
    this.config = {
      debug: false,
      props: {},
      ...config
    };
  }

  /**
   * Initialize Vue component
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log('Vue component initialized');
    }
  }
}`;
}

/**
 * Generate Express class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Express class TypeScript code
 */
export function generateExpressClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `export class ${className}Core {
  private config: Record<string, unknown>;

  constructor(config: Record<string, unknown> = {}) {
    this.config = config;
  }

  /**
   * Initialize Express server
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log('Express server initialized');
    }
  }
}`;
}

/**
 * Generate Basic class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Basic class TypeScript code
 */
export function generateBasicClass(config: ProjectConfig): string {
  const className = `${convertToPascalCase(config.name)}Core`;
  const configType = `${convertToPascalCase(config.name)}Config`;

  return [
    generateBasicClassHeader(className, configType, config),
    generateBasicConstructor(className, configType),
    generateBasicInitializeMethod(config),
    generateBasicConfigMethods(className, configType),
  ].join('\n');
}

/**
 * Generate Basic class header
 * @param {string} className - Class name
 * @param {string} configType - Configuration type
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Class header TypeScript code
 */
function generateBasicClassHeader(
  className: string,
  configType: string,
  config: ProjectConfig
): string {
  return `/**
 * ${config.name} core functionality
 */
export class ${className} {
  private config: ${configType};`;
}

/**
 * Generate Basic class constructor
 * @param {string} className - Class name
 * @param {string} configType - Configuration type
 * @returns {string} Constructor TypeScript code
 */
function generateBasicConstructor(className: string, configType: string): string {
  return `  constructor(config: ${configType} = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config
    };
  }`;
}

/**
 * Generate Basic initialize method
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Initialize method TypeScript code
 */
function generateBasicInitializeMethod(config: ProjectConfig): string {
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
 * Generate Basic configuration methods
 * @param {string} className - Class name
 * @param {string} configType - Configuration type
 * @returns {string} Configuration methods TypeScript code
 */
function generateBasicConfigMethods(className: string, configType: string): string {
  return `  /**
   * Get current configuration
   */
  getConfig(): ${configType} {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<${configType}>): void {
    this.config = { ...this.config, ...newConfig };
  }
}`;
}
