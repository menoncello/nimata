/**
 * CLI Project Generators
 *
 * Generates CLI executable files and entry point content
 */

import type { ProjectConfig } from '../enhanced-init-types.js';

/**
 * CLI Project Generators Class
 */
export class CliProjectGenerators {
  /**
   * Generate CLI executable file
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI executable content
   */
  generateCliExecutable(config: ProjectConfig): string {
    return `#!/usr/bin/env bun

/**
 * CLI executable for ${config.name}
 */

import { main } from '../src/cli/index.js';

// Run the CLI
main().catch((error) => {
  console.log('CLI execution failed:', error);
  process.exit(1);
});
`;
  }

  /**
   * Generate CLI entry point content
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} CLI entry point content
   */
  generateCliEntryContent(config: ProjectConfig): string {
    return `/**
 * CLI entry point for ${config.name}
 */

export async function main(): Promise<void> {
  console.log('Hello from ${config.name} CLI!');

  // TODO: Implement CLI functionality
  process.exit(0);
}
`;
  }
}
