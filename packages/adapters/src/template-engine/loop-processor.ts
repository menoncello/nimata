/**
 * Loop Template Processor
 *
 * Handles loop processing in templates
 */
import { REGEX_PATTERNS } from '../utils/constants-new.js';
import { getNestedValue } from './argument-processor.js';
import type { TemplateContext } from './types.js';

/**
 * Create loop item context with iteration metadata
 * @param params - Parameters object containing loop info
 * @param params.baseContext - Base context object
 * @param params.item - Current array item
 * @param params.index - Current index
 * @param params.arrayLength - Total array length
 * @param params.arrayName - Name of the array being iterated
 * @param params.key - Property key for object iteration
 * @returns Item context with iteration metadata
 */
function createLoopItemContext(params: {
  baseContext: TemplateContext;
  item: unknown;
  index: number;
  arrayLength: number;
  arrayName?: string;
  key?: string | number;
}): TemplateContext {
  const { baseContext, item, index, arrayLength, arrayName, key } = params;
  const itemContext: Record<string, unknown> = {
    ...baseContext,
    this: item,
    '@index': index.toString(),
    '@first': index === 0,
    '@last': index === arrayLength - 1,
    '@key': key?.toString() || '',
  };

  // Only add array name if it exists
  if (arrayName) {
    itemContext[arrayName] = item;
  }

  // Spread item properties into context for direct access
  // Item properties take precedence over parent context
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const itemObj = item as Record<string, unknown>;
    for (const [key, value] of Object.entries(itemObj)) {
      itemContext[key] = value;
    }
  }

  return itemContext as TemplateContext;
}

/**
 * Process a single loop item with all template transformations
 * @param content - Loop content template
 * @param itemContext - Item-specific context
 * @returns Processed content string
 */
async function processLoopItem(content: string, itemContext: TemplateContext): Promise<string> {
  let processedContent = content;

  // Process helpers first
  const { processHelpers } = await import('./helper-processor.js');
  processedContent = await processHelpers(processedContent, itemContext);

  // Process nested loops
  const { processLoops } = await import('./loop-processor.js');
  processedContent = await processLoops(processedContent, itemContext);

  // Process simple variables like {{this}} in loop content
  processedContent = processedContent.replace(REGEX_PATTERNS.SIMPLE_VAR, (match, variablePath) => {
    const trimmedPath = variablePath.trim();
    const value = getNestedValue(itemContext, trimmedPath);
    return value === null || value === undefined ? '' : String(value);
  });

  return processedContent;
}

/**
 * Process all items in an array loop
 * @param array - Array to iterate over
 * @param content - Loop content template
 * @param context - Base context
 * @param arrayName - Name of the array being iterated
 * @returns Processed content for all items
 */
async function processArrayItems(
  array: unknown[],
  content: string,
  context: TemplateContext,
  arrayName?: string
): Promise<string> {
  const processedItems: string[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const itemContext = createLoopItemContext({
      baseContext: context,
      item,
      index: i,
      arrayLength: array.length,
      arrayName,
    });
    let processedContent = await processLoopItem(content, itemContext);

    // Remove trailing commas for the last item to avoid invalid JSON
    if (i === array.length - 1) {
      processedContent = processedContent.replace(/,\s*$/, '');
    }

    processedItems.push(processedContent);
  }

  return processedItems.join('');
}

/**
 * Process loop items in object
 * @param obj - Object to iterate over
 * @param content - Loop content template
 * @param context - Base context
 * @param objectName - Name of the object being iterated
 * @returns Processed content for all items
 */
async function processObjectItems(
  obj: Record<string, unknown>,
  content: string,
  context: TemplateContext,
  objectName?: string
): Promise<string> {
  const processedItems: string[] = [];
  let i = 0;

  const keys = Object.keys(obj);
  for (const key of keys) {
    const value = obj[key];
    const itemContext = createLoopItemContext({
      baseContext: context,
      item: value,
      index: i,
      arrayLength: keys.length,
      arrayName: objectName,
      key,
    });
    let processedContent = await processLoopItem(content, itemContext);

    // Remove trailing commas for the last item to avoid invalid JSON
    if (i === keys.length - 1) {
      processedContent = processedContent.replace(/,\s*$/, '');
    }

    processedItems.push(processedContent);
    i++;
  }

  return processedItems.join('');
}

/**
 * Loop match result type
 */
interface LoopMatch {
  fullMatch: string;
  arrayName: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Find matching closing tag for a loop block
 * @param template - Template string
 * @param contentStart - Position where content starts
 * @returns Position of closing tag or -1 if not found
 */
function findClosingTag(template: string, contentStart: number): number {
  let depth = 1;
  let j = contentStart;
  const EACH_START_TAG = '{{#each';
  const EACH_END_TAG = '{{/each}}';

  while (j < template.length && depth > 0) {
    if (template.substring(j).startsWith(EACH_START_TAG)) {
      depth++;
      j += EACH_START_TAG.length;
    } else if (template.substring(j).startsWith(EACH_END_TAG)) {
      depth--;
      if (depth === 0) {
        return j;
      }
      j += EACH_END_TAG.length;
    } else {
      j++;
    }
  }
  return -1;
}

/**
 * Extract loop match from template
 * @param template - Template string
 * @param startIndex - Start position
 * @param arrayName - Name of array being looped
 * @param match - Regex match result
 * @returns Loop match object or null
 */
function extractLoopMatch(
  template: string,
  startIndex: number,
  arrayName: string,
  match: RegExpMatchArray
): LoopMatch | null {
  const contentStart = startIndex + match[0].length;
  const closingPos = findClosingTag(template, contentStart);

  if (closingPos === -1) {
    return null;
  }

  const EACH_END_TAG = '{{/each}}';
  const content = template.substring(contentStart, closingPos);
  const fullMatch = template.substring(startIndex, closingPos + EACH_END_TAG.length);

  return {
    fullMatch,
    arrayName,
    content,
    startIndex,
    endIndex: closingPos + EACH_END_TAG.length,
  };
}

/**
 * Parameters for processing loop start
 */
interface LoopStartParams {
  template: string;
  position: number;
  depth: number;
  results: LoopMatch[];
  pattern: RegExp;
}

/**
 * Process loop start tag
 * @param params - Loop start parameters
 * @returns New position
 */
function processLoopStart(params: LoopStartParams): number {
  const { template, position, depth, results, pattern } = params;
  const remainder = template.substring(position);
  const match = remainder.match(pattern);

  if (match && depth === 0) {
    const arrayName = match[1] || '';
    const loopMatch = extractLoopMatch(template, position, arrayName, match);
    if (loopMatch) {
      results.push(loopMatch);
      return loopMatch.endIndex - 1;
    }
  }
  return position + '{{#each'.length;
}

/**
 * Find top-level loop blocks (not nested inside other loops)
 * @param template - Template string to search
 * @returns Array of top-level loop matches
 */
function findTopLevelLoops(template: string): LoopMatch[] {
  const results: LoopMatch[] = [];
  const startPattern = /^{{#each\s+([\w.]+)}}/;
  const EACH_START = '{{#each';
  const EACH_END = '{{/each}}';
  let currentDepth = 0;
  let i = 0;

  while (i < template.length) {
    const remainder = template.substring(i);

    if (remainder.startsWith(EACH_START)) {
      i = processLoopStart({
        template,
        position: i,
        depth: currentDepth,
        results,
        pattern: startPattern,
      });
      currentDepth++;
    } else if (remainder.startsWith(EACH_END)) {
      currentDepth--;
      i += EACH_END.length;
    } else {
      i++;
    }
  }

  return results;
}

/**
 * Process one iteration of loop replacements
 * @param currentResult - Current template result
 * @param context - Template context
 * @returns Tuple of [hasChanges, newResult]
 */
async function processLoopIteration(
  currentResult: string,
  context: TemplateContext
): Promise<[boolean, string]> {
  const matches = findTopLevelLoops(currentResult);
  matches.sort((a, b) => a.startIndex - b.startIndex);

  const firstMatch = matches[0];
  if (!firstMatch) {
    return [false, currentResult];
  }

  const { fullMatch, arrayName, content } = firstMatch;
  const processedContent = await processEachBlock(fullMatch, arrayName, content, context);
  return [true, currentResult.replace(fullMatch, processedContent)];
}

/**
 * Processes loop blocks in the template
 * @param template - Template string to process
 * @param context - Context object containing variable values
 * @returns Template string with processed loops
 */
export async function processLoops(template: string, context: TemplateContext): Promise<string> {
  let result = template;
  let hasChanges = true;

  while (hasChanges) {
    [hasChanges, result] = await processLoopIteration(result, context);
  }

  return result;
}

/**
 * Process a single each block in template
 * @param fullMatch - Full matched block from template
 * @param arrayName - Name of array to iterate
 * @param content - Content inside each block
 * @param context - Template context
 * @returns Processed content string
 */
async function processEachBlock(
  fullMatch: string,
  arrayName: string,
  content: string,
  context: TemplateContext
): Promise<string> {
  const value = getNestedValue(context, arrayName ?? '');

  if (!Array.isArray(value) && typeof value !== 'object') {
    return '';
  }

  if (Array.isArray(value)) {
    return processArrayItems(value, content, context, arrayName);
  }

  if (value && typeof value === 'object') {
    return processObjectItems(value as Record<string, unknown>, content, context, arrayName);
  }

  return '';
}
