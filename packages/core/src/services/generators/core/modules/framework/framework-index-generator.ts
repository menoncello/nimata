/**
 * Framework index file generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { generateIndexDocumentation } from '../shared/common-generators.js';
import { generateFrameworkClass } from './framework-classes.js';
import { generateFrameworkExports } from './framework-exports.js';
import { generateFrameworkInterface } from './framework-interfaces.js';

/**
 * Generate Framework project index file
 * @param config - Project configuration
 * @returns Framework index file TypeScript code
 */
export function generateFrameworkIndexFile(config: ProjectConfig): string {
  const documentation = generateIndexDocumentation(config);
  const interfaceCode = generateFrameworkInterface(config);
  const classCode = generateFrameworkClass(config);
  const exports = generateFrameworkExports(config);

  return `${documentation}

${interfaceCode}

${classCode}

${exports}`;
}
