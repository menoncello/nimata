/**
 * Template Variable Getter
 *
 * Provides type-safe variable access and storage for template contexts
 */
import type { VariableGetter } from '@nimata/core';

/**
 * Template variable getter implementation that provides type-safe variable access and storage.
 *
 * This class implements the VariableGetter interface and offers methods for storing,
 * retrieving, and managing template variables with proper type safety.
 */
export class TemplateVariableGetter implements VariableGetter<unknown> {
  private variables: Map<string, unknown> = new Map();

  /**
   * Sets a variable value in the internal storage.
   *
   * Stores a variable with the given name and value for later retrieval.
   *
   * @param name - The name of the variable to store
   * @param value - The value to associate with the variable name
   * @returns void
   */
  set(name: string, value: unknown): void {
    this.variables.set(name, value);
  }

  /**
   * Gets a typed variable from context with type safety.
   *
   * Retrieves a value from the context object using the provided key, maintaining
   * type safety through TypeScript generics.
   *
   * @param key - The key to retrieve from the context object
   * @param context - The template context object containing the data
   * @returns The typed variable value from the context or undefined if not found
   */
  get<K extends keyof unknown>(key: K, context: unknown): unknown[K] {
    return context[key as keyof unknown] as unknown[K];
  }

  /**
   * Gets a variable value from internal storage.
   *
   * Retrieves a previously stored variable from the internal variables map.
   *
   * @param name - The name of the variable to retrieve
   * @returns The stored variable value or undefined if the variable doesn't exist
   */
  getStored(name: string): unknown {
    return this.variables.get(name);
  }

  /**
   * Gets a nested variable with type safety using dot notation.
   *
   * Navigates through nested objects in the context using a dot-separated path
   * to retrieve deeply nested values.
   *
   * @param path - The dot notation path to the nested variable (e.g., "user.profile.name")
   * @param context - The template context object containing nested data
   * @returns The nested variable value or undefined if the path doesn't exist
   */
  getNested(path: string, context: unknown): unknown {
    const keys = path.split('.');
    let current: unknown = context;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }

      // Handle array access and object property access
      if (Array.isArray(current)) {
        // If current is an array, key should be a numeric index or special property
        if (key === 'length') {
          return current.length;
        } else if (/^\d+$/.test(key)) {
          // Numeric array index
          const index = Number.parseInt(key, 10);
          return current[index];
        }

        // Invalid array access
        return undefined;
      } else if (typeof current === 'object' && current !== null) {
        // If current is an object, access the property
        const obj = current as Record<string, unknown>;
        current = obj[key];
      } else {
        // Current is not an object/array, can't access further
        return undefined;
      }
    }

    return current;
  }

  /**
   * Gets a variable with fallback support.
   *
   * Retrieves a value from the context and returns a fallback value if the
   * original value is undefined, providing a default when needed.
   *
   * @param key - The key to retrieve from the context object
   * @param context - The template context object containing the data
   * @param fallback - The fallback value to return if the key is not found
   * @returns The variable value from context or the fallback value
   */
  getWithFallback<K extends keyof unknown>(
    key: K,
    context: unknown,
    fallback: unknown[K]
  ): unknown[K] {
    const value = this.get(key, context);
    return value === undefined ? fallback : value;
  }

  /**
   * Checks if a variable exists in internal storage.
   *
   * Determines whether a variable with the given name has been stored
   * in the internal variables map.
   *
   * @param name - The name of the variable to check for existence
   * @returns True if the variable exists in storage, false otherwise
   */
  has(name: string): boolean {
    return this.variables.has(name);
  }

  /**
   * Deletes a variable from internal storage.
   *
   * Removes a variable from the internal variables map, freeing up memory
   * and preventing further access to the stored value.
   *
   * @param name - The name of the variable to delete
   * @returns True if the variable was successfully deleted, false if it didn't exist
   */
  delete(name: string): boolean {
    return this.variables.delete(name);
  }

  /**
   * Clears all variables from internal storage.
   *
   * Removes all stored variables from the internal map, effectively resetting
   * the variable storage to an empty state.
   *
   * @returns void
   */
  clear(): void {
    this.variables.clear();
  }

  /**
   * Gets all variable names from internal storage.
   *
   * Retrieves an array containing the names of all variables currently
   * stored in the internal variables map.
   *
   * @returns An array of all stored variable names
   */
  keys(): string[] {
    return Array.from(this.variables.keys());
  }
}
