/**
 * Types for Variable Substitution
 */

/**
 * Variable substitution result
 */
export interface VariableSubstitutionResult {
  substitutedContent: string;
  usedVariables: string[];
  validation: import('@nimata/core').ValidationResult;
}
