/**
 * CLAUDE.md Helper Utilities
 *
 * Utility functions for CLAUDE.md generation
 */

/**
 * Get target environment based on project type
 * @param projectType - Project type identifier
 * @returns Target environment string
 */
export function getTargetEnvironment(projectType: string): 'node' | 'browser' | 'both' {
  switch (projectType) {
    case 'web':
      return 'browser';
    case 'cli':
      return 'node';
    case 'library':
      return 'both';
    default:
      return 'node';
  }
}

/**
 * Get project type name for display
 * @param projectType - Project type identifier
 * @returns Display name for project type
 */
export function getProjectTypeName(projectType: string): string {
  const names = {
    basic: 'Basic TypeScript Project',
    web: 'Web Application',
    cli: 'CLI Application',
    library: 'TypeScript Library',
  };
  return names[projectType as keyof typeof names] || 'Unknown';
}

/**
 * Get environment name for display
 * @param targetEnvironment - Target environment identifier
 * @returns Display name for environment
 */
export function getEnvironmentName(targetEnvironment: string): string {
  const names = {
    node: 'Node.js',
    browser: 'Browser',
    both: 'Universal (Node.js + Browser)',
  };
  return names[targetEnvironment as keyof typeof names] || 'Unknown';
}
