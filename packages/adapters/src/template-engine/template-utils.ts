/**
 * Template utilities
 */

/**
 * Template utility functions
 */
export class TemplateUtils {
  /**
   * Generate template ID from file path
   * @param {string} filePath - The file path to convert
   * @returns {string): string} The generated template ID
   */
  static generateTemplateId(filePath: string): string {
    // Replace non-word characters (except hyphens) with hyphens
    let result = '';
    for (const char of filePath) {
      result += /[\w-]/.test(char) ? char : '-';
    }

    // Replace multiple consecutive hyphens with single hyphen
    result = result.replace(/-+/g, '-');

    // Convert to lowercase and remove leading/trailing hyphens
    const lowerResult = result.toLowerCase();
    let cleanedResult = lowerResult.startsWith('-') ? lowerResult.slice(1) : lowerResult;
    cleanedResult = cleanedResult.endsWith('-') ? cleanedResult.slice(0, -1) : cleanedResult;
    return cleanedResult;
  }

  /**
   * Infer category from file path
   * @param {string} filePath - The file path to analyze
   * @returns {string): string} The inferred category
   */
  static inferCategory(filePath: string): string {
    const pathLower = filePath.toLowerCase();

    // Check for source files
    if (this.isSourceFile(pathLower)) {
      return 'source';
    }

    // Check for test files
    if (this.isTestFile(pathLower)) {
      return 'testing';
    }

    // Check for documentation files
    if (this.isDocumentationFile(pathLower)) {
      return 'documentation';
    }

    // Check for configuration files
    if (this.isConfigurationFile(pathLower)) {
      return 'configuration';
    }

    // Check for script files
    if (this.isScriptFile(pathLower)) {
      return 'scripts';
    }

    // Check for build files
    if (this.isBuildFile(pathLower)) {
      return 'build';
    }

    return 'general';
  }

  /**
   * Resolve file path with context variables
   * @param {string} filePath - The file path to resolve
   * @param {Record<string} context - The template context containing variables
   * @returns {string} The resolved file path
   */
  static resolveFilePath(filePath: string, context: Record<string, unknown>): string {
    // Simple variable substitution in file paths
    return filePath.replace(/{{([A-Z_a-z][\w.]*)}}/g, (match, variable) => {
      const value = context[variable.trim()];
      return typeof value === 'string' ? value : match;
    });
  }

  /**
   * Check if path represents a source file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if source file
   */
  private static isSourceFile(pathLower: string): boolean {
    return pathLower.includes('/src/') || pathLower.endsWith('/src') || pathLower.includes('lib/');
  }

  /**
   * Check if path represents a test file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if test file
   */
  private static isTestFile(pathLower: string): boolean {
    return (
      pathLower.includes('/test/') || pathLower.includes('/tests/') || pathLower.includes('test.')
    );
  }

  /**
   * Check if path represents a documentation file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if documentation file
   */
  private static isDocumentationFile(pathLower: string): boolean {
    return (
      pathLower.includes('/doc/') || pathLower.includes('readme') || pathLower.includes('docs/')
    );
  }

  /**
   * Check if path represents a configuration file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if configuration file
   */
  private static isConfigurationFile(pathLower: string): boolean {
    return pathLower.includes('/config/') || pathLower.includes('config.');
  }

  /**
   * Check if path represents a script file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if script file
   */
  private static isScriptFile(pathLower: string): boolean {
    return pathLower.includes('/script/') || pathLower.includes('scripts/');
  }

  /**
   * Check if path represents a build file
   * @param {string} pathLower - Lowercase file path
   * @returns {string): boolean} True if build file
   */
  private static isBuildFile(pathLower: string): boolean {
    return pathLower.includes('/build/') || pathLower.includes('/dist/');
  }
}
