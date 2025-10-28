/**
 * Utils Export Generator
 *
 * Generates utility function definitions and exports for TypeScript projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates utility function exports for TypeScript libraries
 */
export class UtilsExportGenerator {
  /**
   * Generates utility function definitions and exports
   * @param config - The project configuration
   * @returns Utility function definitions string
   */
  generateUtilsExports(config: ProjectConfig): string {
    const { name } = config;
    const header = this.getHeader(name);
    const objectUtils = this.getObjectUtilities();
    const functionUtils = this.getFunctionUtilities();
    const promiseUtils = this.getPromiseUtilities();
    const dataUtils = this.getDataUtilities();
    const stringUtils = this.getStringUtilities();
    const urlUtils = this.getUrlUtilities();

    return `${header}

${objectUtils}

${functionUtils}

${promiseUtils}

${dataUtils}

${stringUtils}

${urlUtils}
`;
  }

  /**
   * Get header comment
   * @param name - Project name
   * @returns Header string
   */
  private getHeader(name: string): string {
    return `// Utility functions for ${name}`;
  }

  /**
   * Get object manipulation utilities
   * @returns Object utilities code
   */
  private getObjectUtilities(): string {
    const deepClone = this.getDeepCloneFunction();
    const deepMerge = this.getDeepMergeFunction();
    const isObject = this.getIsObjectFunction();

    return `${deepClone}

${deepMerge}

${isObject}`;
  }

  /**
   * Get deep clone function
   * @returns Deep clone function code
   */
  private getDeepCloneFunction(): string {
    return `/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: unknown };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }

  return obj;
}`;
  }

  /**
   * Get deep merge function
   * @returns Deep merge function code
   */
  private getDeepMergeFunction(): string {
    return `/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}`;
  }

  /**
   * Get is object function
   * @returns Is object function code
   */
  private getIsObjectFunction(): string {
    return `/**
 * Check if value is an object
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item && typeof item === 'object' && !Array.isArray(item);
}`;
  }

  /**
   * Get function control utilities
   * @returns Function utilities code
   */
  private getFunctionUtilities(): string {
    const debounce = this.getDebounceFunction();
    const throttle = this.getThrottleFunction();

    return `${debounce}

${throttle}`;
  }

  /**
   * Get debounce function
   * @returns Debounce function code
   */
  private getDebounceFunction(): string {
    return `/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}`;
  }

  /**
   * Get throttle function
   * @returns Throttle function code
   */
  private getThrottleFunction(): string {
    return `/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`;
  }

  /**
   * Get promise and async utilities
   * @returns Promise utilities code
   */
  private getPromiseUtilities(): string {
    const retry = this.getRetryFunction();
    const timeout = this.getTimeoutFunction();
    const sleep = this.getSleepFunction();

    return `${retry}

${timeout}

${sleep}`;
  }

  /**
   * Get retry function
   * @returns Retry function code
   */
  private getRetryFunction(): string {
    return `/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}`;
  }

  /**
   * Get timeout function
   * @returns Timeout function code
   */
  private getTimeoutFunction(): string {
    return `/**
 * Timeout promise
 */
export function timeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(\`Operation timed out after \${timeoutMs}ms\`)), timeoutMs)
    )
  ]);
}`;
  }

  /**
   * Get sleep function
   * @returns Sleep function code
   */
  private getSleepFunction(): string {
    return `/**
 * Sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}`;
  }

  /**
   * Get data validation and format utilities
   * @returns Data utilities code
   */
  private getDataUtilities(): string {
    const generateUUID = this.getGenerateUUIDFunction();
    const formatBytes = this.getFormatBytesFunction();
    const isEmpty = this.getIsEmptyFunction();

    return `${generateUUID}

${formatBytes}

${isEmpty}`;
  }

  /**
   * Get generate UUID function
   * @returns Generate UUID function code
   */
  private getGenerateUUIDFunction(): string {
    return `/**
 * Generate random UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}`;
  }

  /**
   * Get format bytes function
   * @returns Format bytes function code
   */
  private getFormatBytesFunction(): string {
    return `/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}`;
  }

  /**
   * Get is empty function
   * @returns Is empty function code
   */
  private getIsEmptyFunction(): string {
    return `/**
 * Check if a value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}`;
  }

  /**
   * Get string manipulation utilities
   * @returns String utilities code
   */
  private getStringUtilities(): string {
    return `/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Camel case conversion
 */
export function camelCase(str: string): string {
  return str.replace(/[-_\\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
}

/**
 * Snake case conversion
 */
export function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => \`_\${letter.toLowerCase()}\`).replace(/^_/, '');
}

/**
 * Kebab case conversion
 */
export function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => \`-\${letter.toLowerCase()}\`).replace(/^-/, '');
}`;
  }

  /**
   * Get URL and query string utilities
   * @returns URL utilities code
   */
  private getUrlUtilities(): string {
    return `/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

/**
 * Convert object to query string
 */
export function toQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
}`;
  }
}
