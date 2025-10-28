/**
 * CLI Utility Types Generator
 *
 * Generates CLI utility type definitions
 */

/**
 * Generate utility types
 * @returns Utility type definitions
 */
export function generateUtilityTypes(): string {
  return [
    generateTransformUtilityTypes(),
    generateAsyncUtilityTypes(),
    generateInterfaceUtilityTypes(),
  ].join('\n\n');
}

/**
 * Generate transformation utility types
 * @returns Transformation utility type definitions
 */
function generateTransformUtilityTypes(): string {
  return `/**
 * Deep partial utility type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Required keys utility type
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Optional keys utility type
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;`;
}

/**
 * Generate async utility types
 * @returns Async utility type definitions
 */
function generateAsyncUtilityTypes(): string {
  return `/**
 * Async function type
 */
export type AsyncFunction<T extends unknown[] = unknown[], R = unknown> = (...args: T) => Promise<R>;`;
}

/**
 * Generate interface utility types
 * @returns Interface utility type definitions
 */
function generateInterfaceUtilityTypes(): string {
  return `/**
 * Event emitter interface
 */
export interface EventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): void;
  off(event: string, listener: (...args: unknown[]) => void): void;
  emit(event: string, ...args: unknown[]): void;
}

/**
 * Progress reporter interface
 */
export interface ProgressReporter {
  start(message: string, total?: number): void;
  update(current: number, message?: string): void;
  finish(message?: string): void;
  error(message: string): void;
}`;
}
