/**
 * Array-based conditional helpers for Handlebars
 *
 * Provides conditional logic helpers for array operations including
 * length checks, property comparisons, and sorting
 */
import Handlebars from 'handlebars';

type HandlebarsInstance = typeof Handlebars;

/**
 * Array conditional helpers for Handlebars templates
 */
export class ArrayConditionalHelpers {
  /**
   * Register all array-based conditional helpers with Handlebars instance
   * @param handlebars - Handlebars instance
   */
  static registerAll(handlebars: HandlebarsInstance): void {
    this.registerArrayLengthHelpers(handlebars);
    this.registerArrayPropertyHelpers(handlebars);
  }

  /**
   * Register array length-based conditional helpers
   * @param handlebars - Handlebars instance
   */
  private static registerArrayLengthHelpers(handlebars: HandlebarsInstance): void {
    this.registerArrayLengthHelper(handlebars);
    this.registerArrayMinLengthHelper(handlebars);
    this.registerArrayMaxLengthHelper(handlebars);
  }

  /**
   * Register helper to check if array has specific length
   * @param handlebars - Handlebars instance
   */
  private static registerArrayLengthHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifArrayLength',
      function (
        this: Record<string, unknown>,
        array: unknown[],
        length: number,
        options: Handlebars.HelperOptions
      ): string {
        return Array.isArray(array) && array.length === length
          ? options.fn(this)
          : options.inverse(this);
      }
    );
  }

  /**
   * Register helper to check if array has minimum length
   * @param handlebars - Handlebars instance
   */
  private static registerArrayMinLengthHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifArrayMinLength',
      function (
        this: Record<string, unknown>,
        array: unknown[],
        minLength: number,
        options: Handlebars.HelperOptions
      ): string {
        return Array.isArray(array) && array.length >= minLength
          ? options.fn(this)
          : options.inverse(this);
      }
    );
  }

  /**
   * Register helper to check if array has maximum length
   * @param handlebars - Handlebars instance
   */
  private static registerArrayMaxLengthHelper(handlebars: HandlebarsInstance): void {
    handlebars.registerHelper(
      'ifArrayMaxLength',
      function (
        this: Record<string, unknown>,
        array: unknown[],
        maxLength: number,
        options: Handlebars.HelperOptions
      ): string {
        return Array.isArray(array) && array.length <= maxLength
          ? options.fn(this)
          : options.inverse(this);
      }
    );
  }

  /**
   * Register array property-based conditional helpers
   * @param handlebars - Handlebars instance
   */
  private static registerArrayPropertyHelpers(handlebars: HandlebarsInstance): void {
    // Check if array is sorted
    handlebars.registerHelper(
      'ifArraySorted',
      function (
        this: Record<string, unknown>,
        array: unknown[],
        options: Handlebars.HelperOptions
      ): string {
        return ArrayConditionalHelpers.isArraySorted(array)
          ? options.fn(this)
          : options.inverse(this);
      }
    );

    // Check if all array items match condition
    handlebars.registerHelper(
      'ifAllMatch',
      function (
        this: Record<string, unknown>,
        array: unknown[],
        matchParams: { property: string; value: unknown },
        options: Handlebars.HelperOptions
      ): string {
        return ArrayConditionalHelpers.checkIfAllMatch(this, array, matchParams, options);
      }
    );
  }

  /**
   * Checks if array is sorted in ascending order
   * @param array - Array to check
   * @returns True if array is sorted
   */
  public static isArraySorted(array: unknown[]): boolean {
    if (!Array.isArray(array)) return false;

    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i - 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates a match condition function for array items
   * @param property - Property to check (for objects)
   * @param value - Value to match
   * @returns Function that checks if an item matches the condition
   */
  public static createMatchCondition(property: string, value: unknown): (item: unknown) => boolean {
    return (item: unknown): boolean => {
      if (typeof item === 'object' && item !== null && property in item) {
        return (item as Record<string, unknown>)[property] === value;
      }
      return item === value;
    };
  }

  /**
   * Checks if all array items match a condition
   * @param array - Array to check
   * @param property - Property to check (for objects)
   * @param value - Value to match
   * @returns True if all items match
   */
  public static doAllArrayItemsMatch(array: unknown[], property: string, value: unknown): boolean {
    if (!Array.isArray(array)) return false;

    const matchCondition = this.createMatchCondition(property, value);
    return this.doAllArrayItemsMatchCondition(array, matchCondition);
  }

  /**
   * Checks if all array items match a condition function
   * @param array - Array to check
   * @param matchCondition - Function that checks if an item matches
   * @returns True if all items match
   */
  public static doAllArrayItemsMatchCondition(
    array: unknown[],
    matchCondition: (item: unknown) => boolean
  ): boolean {
    if (!Array.isArray(array)) return false;

    return array.every(matchCondition);
  }

  /**
   * Handlebars helper implementation for checking if all array items match
   * @param context - Handlebars context (this)
   * @param array - Array to check
   * @param matchParams - Object containing property and value to match
   * @param matchParams.property - Property to check (for objects)
   * @param matchParams.value - Value to match
   * @param options - Handlebars helper options
   * @returns Rendered template content
   */
  public static checkIfAllMatch(
    context: Record<string, unknown>,
    array: unknown[],
    matchParams: { property: string; value: unknown },
    options: Handlebars.HelperOptions
  ): string {
    const matchCondition = this.createMatchCondition(matchParams.property, matchParams.value);
    return this.doAllArrayItemsMatchCondition(array, matchCondition)
      ? options.fn(context)
      : options.inverse(context);
  }
}
