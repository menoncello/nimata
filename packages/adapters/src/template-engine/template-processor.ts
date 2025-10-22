/**
 * Template Processor
 *
 * Handles template rendering, conditionals, and loops
 * This module re-exports functions from specialized processor modules
 */

// Re-export all processor functions from specialized modules
export { processConditionals } from './conditional-processor.js';
export { processHelpers } from './helper-processor.js';
export { processLoops } from './loop-processor.js';
export { replaceVariables, parseValueWrapper as parseValue } from './variable-processor.js';
