/**
 * Object-based conditional helpers for Handlebars
 *
 * Provides conditional logic helpers for object operations including
 * size checks, property matching, and structure validation
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * Object conditional helpers for Handlebars templates
 */
export class ObjectConditionalHelpers {
  /**
   * Register all object-based conditional helpers with Handlebars instance
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerObjectSizeHelpers(handlebars);
    this.registerObjectPropertyHelpers(handlebars);
  }

  /**
   * Register object size-based conditional helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerObjectSizeHelpers(handlebars: HandlebarsInstance): void {
    this.registerObjectSizeHelper(handlebars);
    this.registerObjectMinSizeHelper(handlebars);
  }

  /**
   * Register object size helper
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerObjectSizeHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifObjectSize',
      function (
        this: Record<string, unknown>,
        obj: Record<string, unknown>,
        size: number,
        options: Handlebars.HelperOptions
      ): string {
        // Treat null and undefined as size 0
        if (!obj || typeof obj !== 'object') {
          return size === 0 ? options.fn(this) : options.inverse(this);
        }
        return Object.keys(obj).length === size ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Register object minimum size helper
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerObjectMinSizeHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifObjectMinSize',
      function (
        this: Record<string, unknown>,
        obj: Record<string, unknown>,
        minSize: number,
        options: Handlebars.HelperOptions
      ): string {
        // Treat null and undefined as size 0
        if (!obj || typeof obj !== 'object') {
          return minSize <= 0 ? options.fn(this) : options.inverse(this);
        }
        return Object.keys(obj).length >= minSize ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Register object property-based conditional helpers
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerObjectPropertyHelpers(handlebars: HandlebarsInstance): void {
    this.registerAllPropertiesMatchHelper(handlebars);
    this.registerAnyPropertyMatchesHelper(handlebars);
  }

  /**
   * Register all properties match helper
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerAllPropertiesMatchHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifAllPropertiesMatch',
      function (
        this: Record<string, unknown>,
        obj: Record<string, unknown>,
        value: unknown,
        options: Handlebars.HelperOptions
      ): string {
        if (!obj || typeof obj !== 'object') return options.inverse(this);

        const allMatch = Object.values(obj).every((propValue) => propValue === value);
        return allMatch ? options.fn(this) : options.inverse(this);
      }
    );
  }

  /**
   * Register any property matches helper
   * @param {HandlebarsInstance} handlebars - Handlebars instance
   */
  private static registerAnyPropertyMatchesHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifAnyPropertyMatches',
      function (
        this: Record<string, unknown>,
        obj: Record<string, unknown>,
        value: unknown,
        options: Handlebars.HelperOptions
      ): string {
        if (!obj || typeof obj !== 'object') return options.inverse(this);

        const anyMatch = Object.values(obj).includes(value);
        return anyMatch ? options.fn(this) : options.inverse(this);
      }
    );
  }
}
