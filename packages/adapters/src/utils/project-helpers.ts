/**
 * Project Helpers Utility
 *
 * Utility functions for project configuration and metadata
 */

/**
 * Get frameworks based on project type
 * @param projectType - Type of project being generated
 * @returns List of frameworks configured for the project type
 */
export function getFrameworks(projectType: string): string[] {
  const baseFrameworks = ['typescript', 'vitest'];

  switch (projectType) {
    case 'cli':
      return [...baseFrameworks, 'commander'];
    case 'web':
      return [...baseFrameworks, 'express'];
    case 'library':
      return [...baseFrameworks, 'rollup'];
    default:
      return baseFrameworks;
  }
}

/**
 * Get target environment based on project type
 * @param projectType - Type of project being generated
 * @returns Target environment ('node', 'browser', or 'both')
 */
export function getTargetEnvironment(projectType: string): string {
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
 * @param projectType - Type of project being generated
 * @returns Human-readable project type name
 */
export function getProjectTypeName(projectType: string): string {
  const names = {
    basic: 'Basic TypeScript Project',
    web: 'Web Application',
    cli: 'CLI Application',
    library: 'Library Package',
  };
  return names[projectType as keyof typeof names] || 'Unknown';
}

/**
 * Get environment name for display
 * @param targetEnvironment - Target environment ('node', 'browser', 'both')
 * @returns Human-readable environment name
 */
export function getEnvironmentName(targetEnvironment: string): string {
  const names = {
    node: 'Node.js',
    browser: 'Browser',
    both: 'Universal (Node.js + Browser)',
  };
  return names[targetEnvironment as keyof typeof names] || 'Unknown';
}
