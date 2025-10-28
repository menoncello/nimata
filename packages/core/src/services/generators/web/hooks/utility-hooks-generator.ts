/**
 * Utility Hooks Generator
 *
 * Generates utility React hooks for web applications
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates utility React hooks for web applications
 */
export class UtilityHooksGenerator {
  /**
   * Generates utility hooks collection
   * @param _config - The project configuration
   * @returns Utility hooks content
   */
  generateUtilityHooks(_config: ProjectConfig): string {
    const imports = this.generateUtilityImports();
    const localStorageHook = this.generateLocalStorageHook();
    const debounceHook = this.generateDebounceHook();
    const windowSizeHook = this.generateWindowSizeHook();

    return `${imports}

${localStorageHook}

${debounceHook}

${windowSizeHook}`;
  }

  /**
   * Generate imports for utility hooks
   * @returns Imports content
   */
  private generateUtilityImports(): string {
    return `import { useState, useEffect, useCallback, useRef } from 'react';`;
  }

  /**
   * Generate localStorage hook
   * @returns LocalStorage hook content
   */
  private generateLocalStorageHook(): string {
    const hookDeclaration = this.generateLocalStorageHookDeclaration();
    const coreLogic = this.generateLocalStorageLogic();
    const returnValue = this.generateLocalStorageReturnValue();

    return `/**
 * localStorage hook with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
${hookDeclaration}

${coreLogic}

${returnValue}
}`;
  }

  /**
   * Generate localStorage hook declaration
   * @returns Hook declaration code
   */
  private generateLocalStorageHookDeclaration(): string {
    return `  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });`;
  }

  /**
   * Generate localStorage logic
   * @returns Hook logic code
   */
  private generateLocalStorageLogic(): string {
    return `  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(\`Error removing localStorage key "\${key}":\`, error);
    }
  }, [key, initialValue]);`;
  }

  /**
   * Generate localStorage return value
   * @returns Return value code
   */
  private generateLocalStorageReturnValue(): string {
    return `  return [storedValue, setValue, removeValue] as const;`;
  }

  /**
   * Generate debounce hook
   * @returns Debounce hook content
   */
  private generateDebounceHook(): string {
    const hookDeclaration = this.generateDebounceHookDeclaration();
    const effect = this.generateDebounceEffect();

    return `/**
 * Debounce hook for values and callbacks
 */
export function useDebounce<T>(value: T, delay: number): T {
${hookDeclaration}

${effect}

  return debouncedValue;
}`;
  }

  /**
   * Generate debounce hook declaration
   * @returns Hook declaration code
   */
  private generateDebounceHookDeclaration(): string {
    return `  const [debouncedValue, setDebouncedValue] = useState<T>(value);`;
  }

  /**
   * Generate debounce effect
   * @returns Effect code
   */
  private generateDebounceEffect(): string {
    return `  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);`;
  }

  /**
   * Generate window size hook
   * @returns Window size hook content
   */
  private generateWindowSizeHook(): string {
    const hookDeclaration = this.generateWindowSizeHookDeclaration();
    const effect = this.generateWindowSizeEffect();

    return `/**
 * Window size hook with debounced updates
 */
export function useWindowSize() {
${hookDeclaration}

${effect}

  return windowSize;
}`;
  }

  /**
   * Generate window size hook declaration
   * @returns Hook declaration code
   */
  private generateWindowSizeHookDeclaration(): string {
    return `  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });`;
  }

  /**
   * Generate window size effect
   * @returns Effect code
   */
  private generateWindowSizeEffect(): string {
    return `  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially

    return () => window.removeEventListener('resize', handleResize);
  }, []);`;
  }
}
