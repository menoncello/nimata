/**
 * Web exports generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { convertToPascalCase } from '../shared/common-generators.js';

/**
 * Generate Web exports
 * @param config - Project configuration
 * @returns Web exports TypeScript code
 */
export function generateWebExports(config: ProjectConfig): string {
  const className = convertToPascalCase(config.name);
  return `// Export main class and types
export { ${className}App as default, ${className}App };
export type { ${className}Config, Route, AppComponent };

// Convenience function
export async function createApp(config?: Partial<${className}Config>): Promise<${className}App> {
  const app = new ${className}App(config);
  await app.initialize();
  return app;
}`;
}
