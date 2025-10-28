/**
 * Framework exports generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Framework exports
 * @param config - Project configuration
 * @returns Framework exports TypeScript code
 */
export function generateFrameworkExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);

  switch (config.projectType) {
    case 'bun-react':
      return `// Export main class and types
export { ${className}Core as default, ${className}Core };
export type { ${className}Props };`;
    case 'bun-vue':
      return `// Export main class and types
export { ${className}Core as default, ${className}Core };
export type { ${className}Config };`;
    case 'bun-express':
      return `// Export main class and types
export { ${className}Core as default, ${className}Core };
export type { ${className}Middleware };`;
    default:
      return `// Export main class and types
export { ${className}Core as default, ${className}Core };`;
  }
}
