/**
 * TypeScript index file generators
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';
import { generateIndexDocumentation } from '../shared/common-generators.js';
import { generateTypeScriptClass } from './typescript-classes.js';
import { generateTypeScriptExports } from './typescript-exports.js';
import { generateTypeScriptInterface } from './typescript-interfaces.js';

/**
 * Generate TypeScript project index file
 * @param config - Project configuration
 * @returns TypeScript index file TypeScript code
 */
export function generateTypeScriptIndexFile(config: ProjectConfig): string {
  const documentation = generateIndexDocumentation(config);
  const interfaceCode = generateTypeScriptInterface(config);
  const classCode = generateTypeScriptClass(config);
  const exports = generateTypeScriptExports(config);

  return `${documentation}

${interfaceCode}

${classCode}

${exports}`;
}
