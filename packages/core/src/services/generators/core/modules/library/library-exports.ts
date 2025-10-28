/**
 * Library exports generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Library exports
 * @param config - Project configuration
 * @returns Library exports TypeScript code
 */
export function generateLibraryExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export main class and types
export { ${className} as default, ${className} };
export type { ${className}Config, ${className}Options, LibraryResult };

// Version information
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '${config.name}';

// Convenience function
export async function create${className}(config?: Partial<${className}Config>): Promise<${className}> {
  return ${className}.create(config);
}`;
}
