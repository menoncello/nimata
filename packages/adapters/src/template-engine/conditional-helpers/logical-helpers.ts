/**
 * Logical operator helpers for Handlebars
 *
 * Provides boolean logic operators for complex conditional
 * expressions in templates
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * Logical conditional helpers for Handlebars templates
 */
export class LogicalConditionalHelpers {
  /**
   * Register all logical operator helpers with Handlebars instance
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerLogicalOperators(handlebars);
  }

  /**
   * Register logical operator helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerLogicalOperators(handlebars: HandlebarsInstance): void {
    // AND helper for chaining conditions
    handlebars.registerHelper('and', (...args: unknown[]): boolean => {
      const conditions = args.slice(0, -1);
      return conditions.every((condition) => Boolean(condition));
    });

    // OR helper for chaining conditions
    handlebars.registerHelper('or', (...args: unknown[]): boolean => {
      const conditions = args.slice(0, -1);
      return conditions.some((condition) => Boolean(condition));
    });

    // NOT helper
    handlebars.registerHelper('not', (value: unknown): boolean => {
      return !Boolean(value);
    });

    // XOR helper (exclusive or)
    handlebars.registerHelper('xor', (...args: unknown[]): boolean => {
      const conditions = args.slice(0, -1);
      const truthyCount = conditions.filter((condition) => Boolean(condition)).length;
      return truthyCount === 1;
    });
  }
}
