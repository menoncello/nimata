/**
 * Deep merge utility for configuration objects.
 *
 * Algorithm Complexity:
 * - Time: O(n) where n is total number of keys across all nesting levels
 * - Space: O(d) where d is maximum nesting depth (call stack depth)
 *
 * Merge Strategy:
 * - Nested objects are deeply merged (recursive)
 * - Arrays are replaced (not merged)
 * - Undefined values in override do not replace defined values in base
 * - Override values always win on conflict
 * - Null is treated as a defined value (will override)
 */

/**
 * Type guard to check if a value is a plain object (not array, null, or primitive)
 * @param value - Value to check
 * @returns True if value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]' &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Deeply merges two objects with override priority.
 *
 * @param base - Base configuration object
 * @param override - Override configuration object (takes priority)
 * @returns Merged configuration object
 *
 * @example
 * ```ts
 * const defaults = { tools: { eslint: { enabled: true, configPath: 'a.json' } } };
 * const override = { tools: { eslint: { configPath: 'b.json' } } };
 *
 * const result = deepMerge(defaults, override);
 * // Result: { tools: { eslint: { enabled: true, configPath: 'b.json' } } }
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  validateInputs(base);
  const result: Record<string, unknown> = { ...base };
  mergeKeys(result, override);
  return result as T;
}

/**
 * Validates merge inputs
 * @param base - Base object
 */
function validateInputs<T extends Record<string, unknown>>(base: T): void {
  if (typeof base !== 'object' || base === null || Array.isArray(base)) {
    throw new TypeError('Base must be an object');
  }
}

/**
 * Merges override keys into result
 * @param result - Result object to mutate
 * @param override - Override values
 */
function mergeKeys<T extends Record<string, unknown>>(
  result: Record<string, unknown>,
  override: Partial<T>
): void {
  if (!isPlainObject(override)) {
    return;
  }

  for (const key in override) {
    if (!Object.prototype.hasOwnProperty.call(override, key)) {
      continue;
    }
    mergeKey(result, key, override[key]);
  }
}

/**
 * Merges single key
 * @param result - Result object
 * @param key - Key to merge
 * @param overrideValue - Override value
 */
function mergeKey(result: Record<string, unknown>, key: string, overrideValue: unknown): void {
  if (overrideValue === undefined) {
    return;
  }

  const baseValue = result[key];
  const shouldMergeRecursively = isPlainObject(baseValue) && isPlainObject(overrideValue);

  result[key] = shouldMergeRecursively
    ? deepMerge(baseValue as Record<string, unknown>, overrideValue as Record<string, unknown>)
    : overrideValue;
}
