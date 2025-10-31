/**
 * Command Builders Utility
 *
 * Utility functions for building development commands and project-specific instructions
 */

/**
 * Configuration object for common commands
 */
interface CommonCommands {
  test: string;
  lint: string;
  typecheck: string;
  format: string;
}

/**
 * Get key commands based on project type
 * @param {string} projectType - Type of project being generated
 * @param {(projectType} getProjectSpecificCommandsForKeys - Function to get project-specific commands
 * @param {unknown} commands - Common commands configuration
 * @returns {void} Formatted markdown string with key commands
 */
export function getKeyCommands(
  projectType: string,
  getProjectSpecificCommandsForKeys: (projectType: string) => string,
  commands: CommonCommands
): string {
  const common = `- ${commands.test}: Run test suite
- ${commands.lint}: Check code quality
- ${commands.typecheck}: Verify TypeScript types
- ${commands.format}: Format code with Prettier`;

  const specific = getProjectSpecificCommandsForKeys(projectType);

  return `${common}\n${specific}`;
}

/**
 * Get project-specific commands
 * @param {unknown} projectType - Type of project being generated
 * @param {unknown} devCommandPattern - Development command pattern
 * @param {unknown} buildCommandPattern - Build command pattern
 * @returns {string} Formatted markdown string with project-specific commands
 */
export function getProjectSpecificCommands(
  projectType: string,
  devCommandPattern: string,
  buildCommandPattern: string
): string {
  switch (projectType) {
    case 'cli':
      return `- ${devCommandPattern}: Development mode with hot reload
- ${buildCommandPattern}: Build CLI for distribution
- \`bun run start\`: Run the compiled CLI`;

    case 'web':
      return `- ${devCommandPattern}: Start development server
- ${buildCommandPattern}: Build for production
- \`bun run preview\`: Preview production build`;

    case 'library':
      return `- ${devCommandPattern}: Watch mode for development
- ${buildCommandPattern}: Build library for distribution
- \`bun run build:types\`: Generate type declarations`;

    default:
      return `- ${devCommandPattern}: Development mode
- ${buildCommandPattern}: Build project`;
  }
}

/**
 * Get project-specific commands for key commands section
 * @param {unknown} projectType - Type of project being generated
 * @param {unknown} devCommandPattern - Development command pattern
 * @param {unknown} buildCommandPattern - Build command pattern
 * @returns {string} Formatted markdown string with project-specific commands
 */
export function getProjectSpecificCommandsForKeys(
  projectType: string,
  devCommandPattern: string,
  buildCommandPattern: string
): string {
  switch (projectType) {
    case 'cli':
      return `- ${devCommandPattern}: Development mode with hot reload\n- ${buildCommandPattern}: Build CLI for distribution`;
    case 'web':
      return `- ${devCommandPattern}: Start development server\n- ${buildCommandPattern}: Build for production`;
    case 'library':
      return `- ${devCommandPattern}: Watch mode for development\n- ${buildCommandPattern}: Build library for distribution`;
    default:
      return `- ${devCommandPattern}: Development mode`;
  }
}

/**
 * Get dev command based on project type
 * @param {string} projectType - Type of project being generated
 * @param {string} devCommandPattern - Development command pattern
 * @returns { string} Development command string for the project type
 */
export function getDevCommand(projectType: string, devCommandPattern: string): string {
  switch (projectType) {
    case 'web':
      return devCommandPattern;
    case 'cli':
      return `${devCommandPattern} or \`bun start\``;
    case 'library':
      return `${devCommandPattern} (watch mode)`;
    default:
      return devCommandPattern;
  }
}
