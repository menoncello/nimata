/**
 * Conditional Template Processor
 *
 * Handles conditional block processing in templates
 */
import { getNestedValue } from './argument-processor.js';
import type { TemplateContext } from './types.js';

// Constants for template processing
const IF_TOKEN_LENGTH = 6;
const ELSE_TOKEN_LENGTH = 8;
const ENDIF_TOKEN_LENGTH = 7;
const BRACE_LENGTH = 2;

/**
 * Find conditional block boundaries
 * @param template - Template string
 * @param startPos - Starting position to search from
 * @returns Object with block positions or null if not found
 */
function findConditionalBlock(
  template: string,
  startPos: number
): {
  ifStart: number;
  ifEnd: number;
  condition: string;
  elseStart: number;
  endIfStart: number;
} | null {
  const ifStart = template.indexOf('{{#if ', startPos);
  if (ifStart === -1) return null;

  const ifEnd = template.indexOf('}}', ifStart);
  if (ifEnd === -1) return null;

  const condition = template.slice(ifStart + IF_TOKEN_LENGTH, ifEnd).trim();
  const elseStart = template.indexOf('{{else}}', ifEnd);
  const endIfStart = template.indexOf('{{/if}}', ifEnd);

  if (endIfStart === -1) return null;

  return { ifStart, ifEnd, condition, elseStart, endIfStart };
}

/**
 * Extract conditional content
 * @param template - Template string
 * @param ifEnd - End position of if block start
 * @param elseStart - Position of else block (optional)
 * @param endIfStart - Position of endif block
 * @returns Object with if and else content
 */
function extractConditionalContent(
  template: string,
  ifEnd: number,
  elseStart: number,
  endIfStart: number
): { ifContent: string; elseContent: string } {
  return elseStart !== -1 && elseStart < endIfStart
    ? {
        ifContent: template.slice(ifEnd + BRACE_LENGTH, elseStart),
        elseContent: template.slice(elseStart + ELSE_TOKEN_LENGTH, endIfStart),
      }
    : {
        ifContent: template.slice(ifEnd + BRACE_LENGTH, endIfStart),
        elseContent: '',
      };
}

/**
 * Process single conditional block
 * @param template - Template string
 * @param context - Context object
 * @param currentPos - Current processing position
 * @returns Object with processed content and new position
 */
async function processSingleConditional(
  template: string,
  context: TemplateContext,
  currentPos: number
): Promise<{ content: string; newPos: number; finished: boolean }> {
  const block = findConditionalBlock(template, currentPos);

  if (!block) {
    return Promise.resolve({
      content: template.slice(currentPos),
      newPos: template.length,
      finished: true,
    });
  }

  const { ifStart, ifEnd, condition, elseStart, endIfStart } = block;
  const { ifContent, elseContent } = extractConditionalContent(
    template,
    ifEnd,
    elseStart,
    endIfStart
  );

  const shouldRender = evaluateCondition(condition, context);
  const selectedContent = shouldRender ? ifContent : elseContent;

  // Don't recursively process here - let the main loop handle nested conditionals
  const result = [template.slice(currentPos, ifStart), selectedContent];

  return Promise.resolve({
    content: result.join(''),
    newPos: endIfStart + ENDIF_TOKEN_LENGTH,
    finished: false,
  });
}

/**
 * Evaluates a condition expression
 * @param condition - Condition string to evaluate
 * @param context - Context object containing variable values
 * @returns Boolean result of condition evaluation
 */
function evaluateCondition(condition: string, context: TemplateContext): boolean {
  // Remove quotes and trim
  const cleanCondition = condition.replace(/["']/g, '').trim();

  // Handle boolean values
  if (cleanCondition === 'true') return true;
  if (cleanCondition === 'false') return false;

  // Handle empty/null checks
  if (cleanCondition === 'null' || cleanCondition === 'undefined') return false;

  // Handle logical operators
  if (cleanCondition.includes('&&')) {
    const parts = cleanCondition.split('&&').map((p) => p.trim());
    return parts.every((part) => evaluateCondition(part, context));
  }

  if (cleanCondition.includes('||')) {
    const parts = cleanCondition.split('||').map((p) => p.trim());
    return parts.some((part) => evaluateCondition(part, context));
  }

  // Handle negation
  if (cleanCondition.startsWith('!')) {
    return !evaluateCondition(cleanCondition.slice(1), context);
  }

  // Get the value from context
  const value = getNestedValue(context, cleanCondition);

  // Check if value exists and is truthy
  return value != null && Boolean(value);
}

/**
 * Process all conditionals at current position
 * @param currentTemplate - Current template state
 * @param context - Template context
 * @returns Tuple of [hasChanges, newTemplate]
 */
async function processConditionalPass(
  currentTemplate: string,
  context: TemplateContext
): Promise<[boolean, string]> {
  let hasChanges = false;
  const result = [];
  let pos = 0;

  while (pos < currentTemplate.length) {
    const processed = await processSingleConditional(currentTemplate, context, pos);

    if (processed.content !== currentTemplate.slice(pos, processed.newPos)) {
      hasChanges = true;
    }

    result.push(processed.content);

    if (processed.finished) {
      break;
    }

    pos = processed.newPos;
  }

  return [hasChanges, result.join('')];
}

/**
 * Process conditional blocks in template
 * @param template - Template string to process
 * @param context - Context object containing variable values
 * @returns Template string with processed conditionals
 */
export async function processConditionals(
  template: string,
  context: TemplateContext
): Promise<string> {
  let currentTemplate = template;
  let hasChanges = true;

  while (hasChanges) {
    const [changed, newTemplate] = await processConditionalPass(currentTemplate, context);
    hasChanges = changed && newTemplate !== currentTemplate;
    currentTemplate = newTemplate;
  }

  return currentTemplate;
}
