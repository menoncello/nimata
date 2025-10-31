/**
 * Conditional Helpers Module
 *
 * Modular conditional helpers for Handlebars templates providing
 * advanced conditional logic across different data types
 */
import Handlebars from 'handlebars';
import { AdvancedConditionalHelpers } from './advanced-helpers.js';
import { ArrayConditionalHelpers } from './array-helpers.js';
import { BasicConditionalHelpers } from './basic-helpers.js';
import { ConditionalUtils } from './conditional-utils.js';
import { LogicalConditionalHelpers } from './logical-helpers.js';
import { ObjectConditionalHelpers } from './object-helpers.js';
import { StringConditionalHelpers } from './string-helpers.js';

type HandlebarsInstance = typeof Handlebars;

/**
 * Main conditional helpers registry
 */
export class ConditionalHelpers {
  /**
   * Register all conditional helpers with Handlebars instance
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    BasicConditionalHelpers.registerAll(handlebars);
    AdvancedConditionalHelpers.registerAll(handlebars);
    LogicalConditionalHelpers.registerAll(handlebars);
    StringConditionalHelpers.registerAll(handlebars);
    ArrayConditionalHelpers.registerAll(handlebars);
    ObjectConditionalHelpers.registerAll(handlebars);
  }
}

// Export all helper classes and utilities
export { ConditionalUtils };
export { BasicConditionalHelpers };
export { StringConditionalHelpers };
export { ArrayConditionalHelpers };
export { ObjectConditionalHelpers };
export { AdvancedConditionalHelpers };
export { LogicalConditionalHelpers };
