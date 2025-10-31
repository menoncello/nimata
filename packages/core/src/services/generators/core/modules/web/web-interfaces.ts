/**
 * Web interface generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Web interface
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} Web interface TypeScript code
 */
export function generateWebInterface(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  const configInterface = generateWebConfigInterface(className);
  const routeInterface = generateRouteInterface();
  const componentInterface = generateAppComponentInterface();

  return `${configInterface}

${routeInterface}

${componentInterface}`;
}

/**
 * Generate Web config interface
 * @param {string} className - Class name
 * @returns {string} Config interface code
 */
export function generateWebConfigInterface(className: string): string {
  return `export interface ${className}Config {
  /** Application name */
  name: string;
  /** Application version */
  version: string;
  /** Debug mode flag */
  debug: boolean;
  /** API base URL */
  apiBaseUrl?: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Router mode */
  routerMode?: 'hash' | 'history';
  /** Custom options */
  options?: Record<string, unknown>;
}`;
}

/**
 * Generate Route interface
 * @returns {string} Route interface code
 */
export function generateRouteInterface(): string {
  return `export interface Route {
  /** Route path */
  path: string;
  /** Component name */
  component: string;
  /** Route title */
  title?: string;
  /** Route meta */
  meta?: Record<string, unknown>;
}`;
}

/**
 * Generate App component interface
 * @returns {string} Component interface code
 */
export function generateAppComponentInterface(): string {
  return `export interface AppComponent {
  /** Component name */
  name: string;
  /** Component props */
  props?: Record<string, unknown>;
  /** Component state */
  state?: Record<string, unknown>;
}`;
}
