/**
 * TypeScript exports generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate TypeScript exports
 * @param config - Project configuration
 * @returns TypeScript exports TypeScript code
 */
export function generateTypeScriptExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export main class and types
export { ${className} as default, ${className} };
export type { ${className}Config, Validator, Adapter, Service };

// Version information
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '${config.name}';

// Re-export utilities
export * from './lib/validators/index.js';
export * from './lib/adapters/index.js';
export * from './lib/services/index.js';
export * from './lib/utils/index.js';`;
}
