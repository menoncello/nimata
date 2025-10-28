/**
 * Basic conditional helpers for Handlebars
 *
 * Provides foundational conditional logic helpers including
 * existence checks, multi-conditionals, and type validation
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * Basic conditional helpers for Handlebars templates
 */
export class BasicConditionalHelpers {
  /**
   * Register all basic conditional helpers with Handlebars instance
   * @param handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerMultiConditionHelpers(handlebars);
    this.registerExistenceHelpers(handlebars);
    this.registerTypeCheckHelpers(handlebars);
  }

  /**
   * Register multi-condition helpers
   * @param handlebars - Handlebars instance
   */
  private static registerMultiConditionHelpers(handlebars: HandlebarsInstance): void {
    // Enhanced if helper that supports multiple conditions
    handlebars.registerHelper('ifAny', (...args: unknown[]): string | boolean => {
      const options = args[args.length - 1] as Handlebars.HelperOptions;
      const conditions = args.slice(0, -1);

      const hasTruthy = conditions.some((condition) => Boolean(condition));

      // If called as block helper
      if (options && typeof options.fn === 'function') {
        return hasTruthy ? options.fn(this) : options.inverse(this);
      }

      // If called as inline helper
      return hasTruthy;
    });

    // Helper that checks if all conditions are truthy
    handlebars.registerHelper('ifAll', (...args: unknown[]): string | boolean => {
      const lastArg = args[args.length - 1];

      // Check if this is called as a block helper (has options with fn/inverse functions)
      const isBlockHelper =
        lastArg &&
        typeof lastArg === 'object' &&
        'fn' in lastArg &&
        'inverse' in lastArg &&
        typeof (lastArg as Handlebars.HelperOptions).fn === 'function';

      if (isBlockHelper) {
        const options = lastArg as Handlebars.HelperOptions;
        const conditions = args.slice(0, -1);
        return conditions.every((condition) => Boolean(condition))
          ? options.fn(this)
          : options.inverse(this);
      }

      // Called as inline helper (sub-expression)
      return args.every((condition) => Boolean(condition));
    });
  }

  /**
   * Register existence checking helpers
   * @param handlebars - Handlebars instance
   */
  private static registerExistenceHelpers(handlebars: HandlebarsInstance): void {
    this.registerIfExistsHelper(handlebars);
    this.registerIfEmptyHelper(handlebars);
    this.registerIfNotEmptyHelper(handlebars);
  }

  /**
   * Register ifExists helper
   * @param handlebars - Handlebars instance
   */
  private static registerIfExistsHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifExists',
      function (
        this: Record<string, unknown>,
        value: unknown,
        options?: Handlebars.HelperOptions
      ): string | boolean {
        const isBlockHelper = BasicConditionalHelpers.isBlockHelper(options);

        if (value !== null && value !== undefined) {
          return isBlockHelper ? options.fn(this) : true;
        }

        return isBlockHelper ? options.inverse(this) : false;
      }
    );
  }

  /**
   * Register ifEmpty helper
   * @param handlebars - Handlebars instance
   */
  private static registerIfEmptyHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifEmpty',
      function (
        this: Record<string, unknown>,
        value: unknown,
        options: Handlebars.HelperOptions
      ): string {
        const isEmpty = BasicConditionalHelpers.isValueEmpty(value);
        return isEmpty ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Register ifNotEmpty helper
   * @param handlebars - Handlebars instance
   */
  private static registerIfNotEmptyHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifNotEmpty',
      function (
        this: Record<string, unknown>,
        value: unknown,
        options: Handlebars.HelperOptions
      ): string {
        const isEmpty = BasicConditionalHelpers.isValueEmpty(value);
        return isEmpty ? options.inverse(this) : options.fn(this);
      }
    );
  }

  /**
   * Check if options object is a block helper
   * @param options - Options object
   * @returns True if block helper
   */
  private static isBlockHelper(options?: Handlebars.HelperOptions): boolean {
    return !!(
      options &&
      typeof options === 'object' &&
      'fn' in options &&
      'inverse' in options &&
      typeof options.fn === 'function'
    );
  }

  /**
   * Register type checking helpers
   * @param handlebars - Handlebars instance
   */
  private static registerTypeCheckHelpers(handlebars: HandlebarsInstance): void {
    // Object has property check (works as both block and inline helper)
    handlebars.registerHelper(
      'ifHasProperty',
      function (
        this: Record<string, unknown>,
        obj: Record<string, unknown>,
        property: string,
        options?: Handlebars.HelperOptions
      ): string | boolean {
        const hasProperty = obj && typeof obj === 'object' && property in obj;

        // If called as block helper with options
        if (options && typeof options.fn === 'function') {
          return hasProperty ? options.fn(this) : options.inverse(this);
        }

        // If called as inline helper (e.g., in expressions)
        return hasProperty;
      }
    );

    // Instanceof check
    handlebars.registerHelper(
      'ifType',
      function (
        this: Record<string, unknown>,
        value: unknown,
        type: string,
        options: Handlebars.HelperOptions
      ): string {
        const matches = BasicConditionalHelpers.getTypeMatchResult(value, type);
        return matches ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Checks if a value is considered empty
   * @param value - Value to check
   * @returns True if value is empty
   */
  private static isValueEmpty(value: unknown): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  /**
   * Gets type match result for value checking
   * @param value - Value to check
   * @param type - Expected type
   * @returns True if value matches type
   */
  private static getTypeMatchResult(value: unknown, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && Number.isNaN(value) === false;
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'function':
        return typeof value === 'function';
      default:
        return false;
    }
  }
}
