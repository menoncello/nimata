/**
 * Web class generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Web class
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Web class TypeScript code
 */
export function generateWebClass(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return [
    generateWebClassHeader(className, config),
    generateWebConstructor(className, config),
    generateWebInitializeMethod(),
    generateWebRoutingMethods(),
    generateWebNavigationMethod(),
    generateWebConfigMethods(className),
  ].join('\n');
}

/**
 * Generate Web class header and properties
 * @param {string} className - Class name
 * @param {ProjectConfig} _config - Project configuration
 * @returns {string} Class header TypeScript code
 */
function generateWebClassHeader(className: string, _config: ProjectConfig): string {
  return `export class ${className}App {
  private config: ${className}Config;
  private initialized: boolean = false;
  private currentRoute: string = '/';`;
}

/**
 * Generate Web class constructor
 * @param {string} className - Class name
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Constructor TypeScript code
 */
function generateWebConstructor(className: string, config: ProjectConfig): string {
  return `  constructor(config: Partial<${className}Config> = {}) {
    this.config = {
      name: '${config.name}',
      version: '1.0.0',
      debug: false,
      theme: 'light',
      routerMode: 'history',
      ...config
    };
  }`;
}

/**
 * Generate Web initialize method
 * @returns {string} Initialize method TypeScript code
 */
function generateWebInitializeMethod(): string {
  return `  /**
   * Initialize web application
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.config.debug) {
      console.log(\`\${this.config.name} v\${this.config.version} initializing...\`);
    }

    // Initialize web-specific logic here
    this.setupRouting();
    this.setupTheme();

    this.initialized = true;

    if (this.config.debug) {
      console.log('Web app initialized successfully');
    }
  }`;
}

/**
 * Generate Web routing and theme methods
 * @returns {string} Routing and theme methods TypeScript code
 */
function generateWebRoutingMethods(): string {
  return `  /**
   * Setup routing
   */
  private setupRouting(): void {
    // Routing setup logic here
    if (this.config.debug) {
      console.log('Setting up routing...');
    }
  }

  /**
   * Setup theme
   */
  private setupTheme(): void {
    if (this.config.theme && this.config.theme !== 'auto') {
      document.documentElement.setAttribute('data-theme', this.config.theme);
    }
  }`;
}

/**
 * Generate Web navigation method
 * @returns {string} Navigation method TypeScript code
 */
function generateWebNavigationMethod(): string {
  return `  /**
   * Navigate to route
   * @param {string} path - Route path
   */
  navigateTo(path: string): void {
    this.currentRoute = path;
    if (this.config.routerMode === 'history') {
      history.pushState({}, '', path);
    } else {
      location.hash = path;
    }
    this.render();
  }

  /**
   * Render application
   */
  private render(): void {
    // Rendering logic here
    if (this.config.debug) {
      console.log(\`Rendering route: \${this.currentRoute}\`);
    }
  }`;
}

/**
 * Generate Web configuration methods
 * @param {string} className - Class name
 * @returns {string} Configuration methods TypeScript code
 */
function generateWebConfigMethods(className: string): string {
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
    if (updates.theme) {
      this.setupTheme();
    }
  }
}`;
}
