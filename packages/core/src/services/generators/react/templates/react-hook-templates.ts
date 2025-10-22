/**
 * React Hook Templates
 * Contains template generation methods for React hooks
 */
export class ReactHookTemplates {
  /**
   * Generate useApp hook template
   * @returns useApp hook template
   */
  getUseAppHookTemplate(): string {
    const imports = this.getHookImports();
    const interfaces = this.getHookInterfaces();
    const hook = this.getHookImplementation();

    return `${imports}

${interfaces}

${hook}`;
  }

  /**
   * Get React hook import statements
   * @returns Import statements string for React hooks
   */
  private getHookImports(): string {
    return `import { useState, useCallback } from 'react';`;
  }

  /**
   * Generate TypeScript interfaces for app state
   * @returns TypeScript interface definitions string
   */
  private getHookInterfaces(): string {
    return `interface AppState {
  debug: boolean;
  theme: 'light' | 'dark';
  user: {
    id?: string;
    name?: string;
  } | null;
}`;
  }

  /**
   * Generate the main useApp hook implementation
   * @returns Complete hook implementation string
   */
  private getHookImplementation(): string {
    const stateInit = this.getHookStateInitialization();
    const callbacks = this.getHookCallbacks();
    const returnStatement = this.getHookReturnStatement();

    return `/**
 * Hook for managing global application state
 */
export function useAppState() {
  ${stateInit}

  ${callbacks}

  ${returnStatement}`;
  }

  /**
   * Generate React state initialization for the hook
   * @returns State initialization code string
   */
  private getHookStateInitialization(): string {
    return `const [state, setState] = useState<AppState>({
    debug: false,
    theme: 'light',
    user: null
  });`;
  }

  /**
   * Generate callback functions for state manipulation
   * @returns Callback functions implementation string
   */
  private getHookCallbacks(): string {
    return `const toggleDebug = useCallback(() => {
    setState(prev => ({ ...prev, debug: !prev.debug }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const setUser = useCallback((user: AppState['user']) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const clearUser = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
  }, []);`;
  }

  /**
   * Generate the hook return statement with exposed API
   * @returns Return statement exposing state and functions
   */
  private getHookReturnStatement(): string {
    return `return {
    state,
    setState,
    toggleDebug,
    setTheme,
    setUser,
    clearUser
  };`;
  }
}
