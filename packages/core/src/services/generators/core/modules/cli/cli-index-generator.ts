/**
 * CLI index file generator
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { generateIndexDocumentation } from '../shared/common-generators.js';
import { generateCLIClass } from './cli-classes.js';
import { generateCLIExports } from './cli-exports.js';
import { generateCLIInterface } from './cli-interfaces.js';

/**
 * Generate CLI project index file
 * @param {ProjectConfig} config - Project configuration
 * @returns {string} CLI index file TypeScript code
 */
export function generateCLIIndexFile(config: ProjectConfig): string {
  const documentation = generateIndexDocumentation(config);
  const interfaceCode = generateCLIInterface(config);
  const classCode = generateCLIClass(config);
  const exports = generateCLIExports(config);

  return `${documentation}

${interfaceCode}

${classCode}

${exports}`;
}
