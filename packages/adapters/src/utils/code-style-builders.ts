/**
 * Code Style Configuration Builders
 *
 * Utility functions for building code style configurations
 */

import { CodeStyleConfig } from '../types/config-types.js';
import { FORMATTING } from './constants.js';

/**
 * Get code style based on quality level
 * @param qualityLevel - Quality level of the project ('light', 'medium', 'strict')
 * @returns Code style configuration object
 */
export function getCodeStyle(qualityLevel: string): CodeStyleConfig {
  switch (qualityLevel) {
    case 'light':
      return buildLightCodeStyle();
    case 'medium':
      return buildMediumCodeStyle();
    case 'strict':
      return buildStrictCodeStyle();
    default:
      return buildMediumCodeStyle();
  }
}

/**
 * Build light quality code style configuration
 * @returns Code style configuration for light quality level
 */
function buildLightCodeStyle(): CodeStyleConfig {
  return {
    indentSize: FORMATTING.JSON_INDENT_SIZE,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 120,
  };
}

/**
 * Build medium quality code style configuration
 * @returns Code style configuration for medium quality level
 */
function buildMediumCodeStyle(): CodeStyleConfig {
  return {
    indentSize: FORMATTING.JSON_INDENT_SIZE,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 100,
  };
}

/**
 * Build strict quality code style configuration
 * @returns Code style configuration for strict quality level
 */
function buildStrictCodeStyle(): CodeStyleConfig {
  return {
    indentSize: FORMATTING.JSON_INDENT_SIZE,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 80,
  };
}
