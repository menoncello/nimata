/**
 * Template Category Inference Utilities
 *
 * Handles inferring template categories from file paths
 */

/**
 * Constants for template category inference
 */
const CATEGORY_CONSTANTS = {
  DEFAULT_CATEGORY: 'cli',
} as const;

/**
 * Template category inference utilities
 */
export class CategoryInference {
  /**
   * Infer template category from file path
   * @param filePath The file path
   * @returns The inferred category
   */
  static inferCategory(filePath: string): string {
    const pathLower = filePath.toLowerCase();

    // Check for documentation files first
    if (this.isDocumentationPath(pathLower)) return 'documentation';

    // Check for configuration files
    if (this.isConfigurationPath(pathLower)) return 'configuration';

    // Check for source code paths
    const sourceCategory = this.inferSourceCategory(pathLower);
    if (sourceCategory) return sourceCategory;

    return CATEGORY_CONSTANTS.DEFAULT_CATEGORY;
  }

  /**
   * Check if path indicates documentation
   * @param pathLower The lowercase file path
   * @returns True if documentation path
   */
  private static isDocumentationPath(pathLower: string): boolean {
    return pathLower.includes('readme') || pathLower.includes('doc');
  }

  /**
   * Check if path indicates configuration
   * @param pathLower The lowercase file path
   * @returns True if configuration path
   */
  private static isConfigurationPath(pathLower: string): boolean {
    return (
      pathLower.includes('config') || pathLower.includes('tsconfig') || pathLower.includes('json')
    );
  }

  /**
   * Infer source code category from path
   * @param pathLower The lowercase file path
   * @returns Source category or null if not a source path
   */
  private static inferSourceCategory(pathLower: string): string | null {
    // Check for 'src' before 'test' to avoid false positives
    if (pathLower.includes('src')) return 'source';
    if (pathLower.includes('component')) return 'component';
    if (pathLower.includes('page')) return 'page';
    if (pathLower.includes('hook')) return 'hook';
    if (pathLower.includes('util')) return 'utility';
    if (pathLower.includes('service')) return 'service';
    if (pathLower.includes('test')) return 'test';

    return null;
  }
}
