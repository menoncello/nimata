/**
 * CLI exports generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate CLI exports
 * @param config - Project configuration
 * @returns CLI exports TypeScript code
 */
export function generateCLIExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export main class and types
export { ${className}CLI as default, ${className}CLI };
export type { ${className}Config, CLIOptions, CommandResult };

// Convenience function
export async function createCLI(config?: Partial<${className}Config>): Promise<${className}CLI> {
  const cli = new ${className}CLI(config);
  await cli.initialize();
  return cli;
}`;
}
