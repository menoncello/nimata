/**
 * Internal Tech Stack Registry Interfaces
 *
 * Internal interfaces used by the tech stack registry implementation
 */

/**
 * Template engine adapter for tech stack
 */
export interface TemplateEngineAdapter {
  renderTemplate: (template: string, context: Record<string, unknown>) => Promise<string>;
  validateTemplate: (template: string) => Promise<boolean>;
  getFileExtensions: () => string[];
  getDefaultHelpers: () => Record<string, (...args: unknown[]) => unknown>;
}

/**
 * Build system adapter for tech stack
 */
export interface BuildSystemAdapter {
  getDefaultBuildConfig: () => Record<string, unknown>;
  getBuildCommands: () => string[];
  validateBuildConfig: (config: Record<string, unknown>) => boolean;
  generateBuildFiles: (config: Record<string, unknown>) => Promise<string[]>;
}

/**
 * Package manager adapter for tech stack
 */
export interface PackageManagerAdapter {
  getDefaultDependencies: () => Record<string, string>;
  getDevDependencies: () => Record<string, string>;
  getScripts: () => Record<string, string>;
  generatePackageFile: (config: Record<string, unknown>) => Promise<string>;
}

/**
 * Tech stack adapter collection
 */
export interface TechStackAdapters {
  templateEngine?: TemplateEngineAdapter;
  buildSystem?: BuildSystemAdapter;
  packageManager?: PackageManagerAdapter;
}
