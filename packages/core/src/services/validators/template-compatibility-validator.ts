/**
 * Template compatibility validation helpers
 */
import { BASIC, BUN_REACT, BUN_VUE, BUN_EXPRESS, BUN_TYPESCRIPT } from './validation-constants.js';

/**
 * Template compatibility matrix
 */
const COMPATIBILITY_MATRIX: Record<string, string[]> = {
  [BASIC]: [BASIC],
  [BUN_TYPESCRIPT]: [BUN_TYPESCRIPT],
  [BUN_REACT]: [BUN_REACT],
  [BUN_VUE]: [BUN_VUE],
  [BUN_EXPRESS]: [BUN_EXPRESS],
} as const;

/**
 * Check if template is compatible with project type using exact match
 * @param template - Template name
 * @param projectType - Project type
 * @returns Whether template is exactly compatible
 */
export function isExactMatch(template: string, projectType: string): boolean {
  return template === projectType;
}

/**
 * Check compatibility using the compatibility matrix
 * @param template - Template name
 * @param projectType - Project type
 * @returns Whether template is compatible according to matrix
 */
export function checkMatrixCompatibility(template: string, projectType: string): boolean {
  const compatibleTypes = COMPATIBILITY_MATRIX[template];
  if (compatibleTypes) {
    return compatibleTypes.includes(projectType);
  }
  return false;
}

/**
 * Check default compatibility rules
 * @param template - Template name
 * @param projectType - Project type
 * @returns Whether template is compatible by default rules
 */
export function checkDefaultCompatibility(template: string, projectType: string): boolean {
  switch (template) {
    case BASIC:
      return [BASIC, BUN_TYPESCRIPT].includes(projectType);
    case BUN_TYPESCRIPT:
      return [BASIC, BUN_TYPESCRIPT, BUN_REACT, BUN_VUE, BUN_EXPRESS].includes(projectType);
    default:
      return true; // Assume compatible if no specific rules
  }
}

/**
 * Main template compatibility check function
 * @param template - Template name
 * @param projectType - Project type
 * @returns Whether template is compatible
 */
export function isTemplateCompatible(template: string, projectType: string): boolean {
  // Exact match is always compatible
  if (isExactMatch(template, projectType)) {
    return true;
  }

  // Check compatibility matrix
  if (checkMatrixCompatibility(template, projectType)) {
    return true;
  }

  // Check default compatibility rules
  return checkDefaultCompatibility(template, projectType);
}

/**
 * Validate template compatibility and generate warning if needed
 * @param template - Template name (optional)
 * @param projectType - Project type (optional)
 * @returns Warning message if incompatible, null if compatible
 */
export function validateTemplateCompatibility(
  template?: string,
  projectType?: string
): string | null {
  if (!template || !projectType) {
    return null;
  }

  const isCompatible = isTemplateCompatible(template, projectType);
  if (!isCompatible) {
    return `Template '${template}' may not be compatible with project type '${projectType}'`;
  }

  return null;
}
