/**
 * Template variable extraction utilities
 */

/**
 * Template variable extractor utilities
 */
export class TemplateVariableExtractor {
  /**
   * Extract variables from template content
   * @param {string} content - The template content to analyze
   * @returns {string): string[]} The list of extracted variables
   */
  static extractVariables(content: string): string[] {
    const variables = new Set<string>();
    const BRACE_START = 2;
    const BRACE_END = 2;

    // Match Handlebars variables {{variable}}
    const variableMatches = content.match(/{{([A-Z_a-z][\w.]*)}}/g);
    if (!variableMatches) {
      return Array.from(variables);
    }

    for (const match of variableMatches) {
      const variableName = this.extractVariableName(match, BRACE_START, BRACE_END);
      if (this.isValidVariable(variableName)) {
        variables.add(variableName);
      }
    }

    return Array.from(variables);
  }

  /**
   * Extract variable name from match
   * @param {string} match - Full match including braces
   * @param {number} braceStart - Number of characters at start
   * @param {number} braceEnd - Number of characters at end
   * @returns { string} Variable name
   */
  private static extractVariableName(match: string, braceStart: number, braceEnd: number): string {
    // Remove braces and trim
    const variable = match.slice(braceStart, -braceEnd).trim();

    // Skip helpers and special constructs
    if (this.isSpecialConstruct(variable)) {
      return '';
    }

    // Remove @data and other special variables
    if (this.isSpecialVariable(variable)) {
      return '';
    }

    // Take only the first part of dotted variables
    return variable.split('.')[0];
  }

  /**
   * Check if variable is a special construct
   * @param {string} variable - Variable name to check
   * @returns {string): boolean} True if special construct
   */
  private static isSpecialConstruct(variable: string): boolean {
    return variable.startsWith('#') || variable.startsWith('/') || variable.startsWith('>');
  }

  /**
   * Check if variable is a special variable
   * @param {string} variable - Variable name to check
   * @returns {string): boolean} True if special variable
   */
  private static isSpecialVariable(variable: string): boolean {
    return variable.startsWith('@');
  }

  /**
   * Check if variable name is valid
   * @param {string} variable - Variable name to check
   * @returns {string): boolean} True if valid
   */
  private static isValidVariable(variable: string): boolean {
    return variable.length > 0 && !/\W/.test(variable);
  }
}
