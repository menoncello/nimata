/**
 * Basic Structure Generator
 *
 * Generates basic project structure and files
 */
import type { ProjectConfig } from '../../../types/project-config.js';

export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
}

/**
 * Generator for basic project structures
 */
export class BasicStructureGenerator {
  /**
   * Generate basic project structure
   * @param config - Project configuration
   * @returns Basic directory structure
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    return [
      // Basic directories
      { path: 'src/utils', type: 'directory' },
      { path: 'src/constants', type: 'directory' },

      // Utility files
      {
        path: 'src/utils/helpers.ts',
        type: 'file',
        content: this.generateHelpers(config),
      },

      {
        path: 'src/constants/index.ts',
        type: 'file',
        content: this.generateConstants(config),
      },
    ];
  }

  /**
   * Generate helper functions
   * @param _config - Project configuration
   * @returns Helper functions TypeScript code
   */
  private generateHelpers(_config: ProjectConfig): string {
    return [
      this.getHelpersHeader(),
      this.getFormatDateFunction(),
      this.getDelayFunction(),
      this.getRandomStringFunction(),
      this.getDeepCloneFunction(),
      this.getIsObjectFunction(),
      this.getNestedValueFunction(),
    ].join('\n\n');
  }

  /**
   * Get helpers header
   * @returns Helpers header
   */
  private getHelpersHeader(): string {
    return `/**
 * Utility helper functions
 */`;
  }

  /**
   * Get formatDate function
   * @returns formatDate function
   */
  private getFormatDateFunction(): string {
    return `/**
 * Format a date as ISO string
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}`;
  }

  /**
   * Get delay function
   * @returns delay function
   */
  private getDelayFunction(): string {
    return `/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}`;
  }

  /**
   * Get generateRandomString function
   * @returns generateRandomString function
   */
  private getRandomStringFunction(): string {
    return `/**
 * Generate a random string
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}`;
  }

  /**
   * Get deepClone function
   * @returns deepClone function
   */
  private getDeepCloneFunction(): string {
    return `/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}`;
  }

  /**
   * Get isObject function
   * @returns isObject function
   */
  private getIsObjectFunction(): string {
    return `/**
 * Check if a value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}`;
  }

  /**
   * Get getNestedValue function
   * @returns getNestedValue function
   */
  private getNestedValueFunction(): string {
    return `/**
 * Safely access nested object properties
 */
export function getNestedValue<T = any>(
  obj: Record<string, unknown>,
  path: string
): T | undefined {
  return path.split('.').reduce((current, key) => {
    return isObject(current) ? current[key] as T : undefined;
  }, obj) as T | undefined;
}`;
  }

  /**
   * Generate constants file
   * @param config - Project configuration
   * @returns Constants TypeScript code
   */
  private generateConstants(config: ProjectConfig): string {
    return `/**
 * Application constants
 */

export const APP_NAME = '${config.name}';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = '${config.description || 'A modern TypeScript library'}';

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100
} as const;

export const API_LIMITS = {
  MAX_REQUEST_SIZE: '10mb',
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000 // 15 minutes
} as const;`;
  }
}
