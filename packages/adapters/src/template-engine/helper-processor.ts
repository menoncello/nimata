/**
 * Helper Template Processor
 *
 * Handles helper function processing in templates
 */
import { processHelperArguments } from './argument-processor.js';
import type { TemplateContext } from './types.js';

// Constants for template processing
const DOUBLE_BRACE_LENGTH = 2;

/**
 * Find the next helper match in template
 * @param {string} template - Template string to search
 * @param {number} startPos - Starting position for search
 * @returns {{ match: RegExpMatchArray; matchIndex: number; helperName: string; closingBraceIndex: number; hasNoArgs: boolean } | null} Helper match info or null
 */
function findNextHelperMatch(
  template: string,
  startPos: number
): {
  match: RegExpMatchArray;
  matchIndex: number;
  helperName: string;
  closingBraceIndex: number;
  hasNoArgs: boolean;
} | null {
  const helperRegex = /{{helper:([A-Z_a-z][\w-]*)(?:\s+|}})/;
  const match = template.substring(startPos).match(helperRegex);

  if (!match) return null;

  const matchIndex = template.indexOf(match[0], startPos);
  const helperName = match[1] || '';
  const hasNoArgs = match[0].endsWith('}}');

  const closingBraceIndex = hasNoArgs
    ? matchIndex + match[0].length - DOUBLE_BRACE_LENGTH
    : template.indexOf('}}', matchIndex + match[0].length);

  if (closingBraceIndex === -1) return null;

  return { match, matchIndex, helperName, closingBraceIndex, hasNoArgs };
}

/**
 * Extract helper arguments from template
 * @param {string} template - Template string
 * @param {{ matchIndex: number; match: RegExpMatchArray; closingBraceIndex: number; hasNoArgs: boolean }} params - Parameters object
 * @param {number} params.matchIndex - Match start position
 * @param {RegExpMatchArray} params.match - RegExp match
 * @param {number} params.closingBraceIndex - Closing brace position
 * @param {boolean} params.hasNoArgs - Whether helper has no arguments
 * @returns {string} Arguments string
 */
function extractHelperArguments(
  template: string,
  params: {
    matchIndex: number;
    match: RegExpMatchArray;
    closingBraceIndex: number;
    hasNoArgs: boolean;
  }
): string {
  const { matchIndex, match, closingBraceIndex, hasNoArgs } = params;
  return hasNoArgs ? '' : template.substring(matchIndex + match[0].length, closingBraceIndex);
}

/**
 * Execute helper function and return result
 * @param {(...args: unknown[]) => unknown} helper - Helper function
 * @param {string} argsString - Arguments string
 * @param {TemplateContext} context - Template context
 * @returns {string} Helper result or original template snippet on error
 */
function executeHelper(
  helper: (...args: unknown[]) => unknown,
  argsString: string,
  context: TemplateContext
): string {
  try {
    const args = processHelperArguments(argsString, context);
    const helperResult = helper(...args);
    return String(helperResult);
  } catch {
    return ''; // Return empty string on error
  }
}

/**
 * Process a single helper match
 * @param {string} template - Template string
 * @param {{ match: RegExpMatchArray; matchIndex: number; helperName: string; closingBraceIndex: number; hasNoArgs: boolean }} matchInfo - Helper match information
 * @param {RegExpMatchArray} matchInfo.match - RegExp match
 * @param {number} matchInfo.matchIndex - Match start position
 * @param {string} matchInfo.helperName - Helper name
 * @param {number} matchInfo.closingBraceIndex - Closing brace position
 * @param {boolean} matchInfo.hasNoArgs - Whether helper has no arguments
 * @param {TemplateContext} context - Template context
 * @param {Map<string} helpers - Available helpers
 * @returns {string} Processed result string
 */
function processSingleHelper(
  template: string,
  matchInfo: {
    match: RegExpMatchArray;
    matchIndex: number;
    helperName: string;
    closingBraceIndex: number;
    hasNoArgs: boolean;
  },
  context: TemplateContext,
  helpers: Map<string, (...args: unknown[]) => unknown>
): string {
  const { match, matchIndex, helperName, closingBraceIndex, hasNoArgs } = matchInfo;

  const argsString = extractHelperArguments(template, {
    matchIndex,
    match,
    closingBraceIndex,
    hasNoArgs,
  });
  const helper = helpers.get(helperName || '');

  if (helper) {
    return executeHelper(helper, argsString, context);
  }

  // Return original template snippet if helper not found
  return template.substring(matchIndex, closingBraceIndex + DOUBLE_BRACE_LENGTH);
}

/**
 * Processes helper functions in the template
 * @param {string} template - Template string to process
 * @param {TemplateContext} context - Context object containing variable values
 * @param {Map<string} helpers - Map of registered helper functions
 * @returns {Promise<string>} Template string with processed helpers
 */
export async function processHelpers(
  template: string,
  context: TemplateContext,
  helpers: Map<string, (...args: unknown[]) => unknown> = new Map()
): Promise<string> {
  let result = '';
  let pos = 0;

  while (pos < template.length) {
    const matchInfo = findNextHelperMatch(template, pos);

    if (!matchInfo) {
      result += template.substring(pos);
      break;
    }

    const { matchIndex, closingBraceIndex } = matchInfo;

    // Add content before the helper
    result += template.substring(pos, matchIndex);

    // Process the helper
    result += processSingleHelper(template, matchInfo, context, helpers);

    pos = closingBraceIndex + DOUBLE_BRACE_LENGTH;
  }

  return result;
}
