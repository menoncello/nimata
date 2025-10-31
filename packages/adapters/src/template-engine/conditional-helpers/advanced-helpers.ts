/**
 * Advanced conditional helpers for Handlebars
 *
 * Provides sophisticated conditional logic including switch statements,
 * range checks, and complex condition evaluations
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * Advanced conditional helpers for Handlebars templates
 */
export class AdvancedConditionalHelpers {
  /**
   * Register all advanced conditional helpers with Handlebars instance
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerSwitchHelpers(handlebars);
    this.registerRangeHelpers(handlebars);
  }

  /**
   * Register switch-like conditional helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerSwitchHelpers(handlebars: HandlebarsInstance): void {
    // Switch-like helper for multiple conditions
    handlebars.registerHelper(
      'switch',
      (value: unknown, options: Handlebars.HelperOptions): string => {
        const data = Handlebars.createFrame(options.data);
        data.switchValue = value;

        return options.fn ? options.fn(this, { data }) : '';
      }
    );

    // Case helper for switch statements
    handlebars.registerHelper(
      'case',
      (expectedValue: unknown, options: Handlebars.HelperOptions): string => {
        const currentValue = options.data.root.switchValue;
        return currentValue === expectedValue ? options.fn(this) : '';
      }
    );

    // Default case for switch statements
    handlebars.registerHelper('switchDefault', (options: Handlebars.HelperOptions): string => {
      return options.fn(this);
    });
  }

  /**
   * Register range-based conditional helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerRangeHelpers(handlebars: HandlebarsInstance): void {
    // Range-based conditional
    handlebars.registerHelper(
      'ifInRange',
      (value: number, min: number, max: number, options: Handlebars.HelperOptions): string => {
        const numValue = Number(value);
        return numValue >= min && numValue <= max ? options.fn(this) : options.inverse(this);
      }
    );

    // Array includes check
    handlebars.registerHelper(
      'ifIncludes',
      (array: unknown[], item: unknown, options: Handlebars.HelperOptions): string => {
        return Array.isArray(array) && array.includes(item)
          ? options.fn(this)
          : options.inverse(this);
      }
    );
  }
}
