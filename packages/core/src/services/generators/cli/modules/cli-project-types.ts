/**
 * CLI Project Types Generator
 *
 * Generates project-specific CLI type definitions
 */

/**
 * Generate project-specific types
 * @param className - Class name for the project
 * @returns Project-specific type definitions
 */
export function generateProjectSpecificTypes(className: string): string {
  return `/**
 * Project-specific CLI interface
 */
export interface ${className}CLI extends CLIApplication {
  // Add project-specific properties and methods here
}

/**
 * Project-specific configuration
 */
export interface ${className}Config extends ConfigFileOptions {
  // Add project-specific configuration options here
}

/**
 * Project-specific command results
 */
export interface ${className}CommandResult extends CommandResult {
  // Add project-specific result properties here
}`;
}
