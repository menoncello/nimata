/**
 * AI Context Generator Helpers
 *
 * Helper functions for AI context generation
 */

import { AI_CONTEXT_CONSTANTS } from './ai-context-constants.js';

/**
 * Gets development command based on project type
 * @param {string} projectType - Project type
 * @returns {string): string} Development command string
 */
export function getDevCommandWrapper(projectType: string): string {
  switch (projectType) {
    case 'web':
      return AI_CONTEXT_CONSTANTS.DEV_COMMAND.WEB;
    case 'cli':
      return AI_CONTEXT_CONSTANTS.DEV_COMMAND.CLI;
    case 'library':
      return AI_CONTEXT_CONSTANTS.DEV_COMMAND.LIBRARY;
    default:
      return AI_CONTEXT_CONSTANTS.DEV_COMMAND.DEFAULT;
  }
}

/**
 * Gets key commands string
 * @returns {string} Key commands string
 */
export function getKeyCommandsWrapper(): string {
  return AI_CONTEXT_CONSTANTS.KEY_COMMANDS;
}
