/**
 * Handlebars Helper Registration
 *
 * Contains all the helper registration logic for the Handlebars template engine
 */
import Handlebars from 'handlebars';
import { ConditionalHelpers } from './conditional-helpers.js';

type HandlebarsInstance = typeof Handlebars;

/**
 * Registers all default Handlebars helpers
 * @param handlebars - Handlebars instance
 */
export function registerDefaultHelpers(handlebars: HandlebarsInstance): void {
  // Register all helper groups
  registerStringHelpers(handlebars);
  registerConditionalHelpers(handlebars);
  registerArrayHelpers(handlebars);
  registerUtilityHelpers(handlebars);

  // Register enhanced conditional helpers
  ConditionalHelpers.registerAll(handlebars);
}

/**
 * Registers string manipulation helpers
 * @param handlebars - Handlebars instance
 */
function registerStringHelpers(handlebars: HandlebarsInstance): void {
  // Register string helpers
  handlebars.registerHelper('uppercase', (str: string): string => {
    return typeof str === 'string' ? str.toUpperCase() : String(str);
  });

  handlebars.registerHelper('lowercase', (str: string): string => {
    return typeof str === 'string' ? str.toLowerCase() : String(str);
  });

  handlebars.registerHelper('capitalize', (str: string): string => {
    return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : String(str);
  });
}

/**
 * Registers conditional helpers
 * @param handlebars - Handlebars instance
 */
function registerConditionalHelpers(handlebars: HandlebarsInstance): void {
  handlebars.registerHelper('eq', (a: unknown, b: unknown): boolean => {
    return a === b;
  });

  handlebars.registerHelper('ne', (a: unknown, b: unknown): boolean => {
    return a !== b;
  });

  handlebars.registerHelper('gt', (a: number, b: number): boolean => {
    return Number(a) > Number(b);
  });

  handlebars.registerHelper('gte', (a: number, b: number): boolean => {
    return Number(a) >= Number(b);
  });

  handlebars.registerHelper('lt', (a: number, b: number): boolean => {
    return Number(a) < Number(b);
  });

  handlebars.registerHelper('lte', (a: number, b: number): boolean => {
    return Number(a) <= Number(b);
  });
}

/**
 * Registers array helpers
 * @param handlebars - Handlebars instance
 */
function registerArrayHelpers(handlebars: HandlebarsInstance): void {
  handlebars.registerHelper('length', (arr: unknown[]): number => {
    return Array.isArray(arr) ? arr.length : 0;
  });
}

/**
 * Registers utility helpers
 * @param handlebars - Handlebars instance
 */
function registerUtilityHelpers(handlebars: HandlebarsInstance): void {
  handlebars.registerHelper('json', (obj: unknown): string => {
    const JSON_INDENTATION = 2;
    return JSON.stringify(obj, null, JSON_INDENTATION);
  });

  handlebars.registerHelper('now', (): string => {
    return new Date().toISOString();
  });

  handlebars.registerHelper('year', (): string => {
    return new Date().getFullYear().toString();
  });

  handlebars.registerHelper('objectKeys', (obj: Record<string, unknown>): string[] => {
    return obj && typeof obj === 'object' ? Object.keys(obj) : [];
  });

  handlebars.registerHelper('and', (...args: unknown[]): boolean => {
    const conditions = args.slice(0, -1);
    return conditions.every((condition) => Boolean(condition));
  });
}
