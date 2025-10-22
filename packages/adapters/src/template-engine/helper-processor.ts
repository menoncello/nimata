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
 * @param template - Template string to search
 * @param startPos - Starting position for search
 * @returns Helper match info or null
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
 * @param template - Template string
 * @param params - Parameters object containing match info
 * @param params.matchIndex - Match start position
 * @param params.match - RegExp match
 * @param params.closingBraceIndex - Closing brace position
 * @param params.hasNoArgs - Whether helper has no arguments
 * @returns Arguments string
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
 * @param helper - Helper function
 * @param argsString - Arguments string
 * @param context - Template context
 * @returns Helper result or original template snippet on error
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
 * @param template - Template string
 * @param matchInfo - Helper match information
 * @param matchInfo.match - RegExp match
 * @param matchInfo.matchIndex - Match start position
 * @param matchInfo.helperName - Helper name
 * @param matchInfo.closingBraceIndex - Closing brace position
 * @param matchInfo.hasNoArgs - Whether helper has no arguments
 * @param context - Template context
 * @param helpers - Available helpers
 * @returns Processed result string
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
 * @param template - Template string to process
 * @param context - Context object containing variable values
 * @param helpers - Map of registered helper functions
 * @returns Template string with processed helpers
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
