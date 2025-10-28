/**
 * API Hooks Generator
 *
 * Generates API-related React hooks for web applications
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates API-related React hooks for web applications
 */
export class ApiHooksGenerator {
  /**
   * Generates API hooks collection
   * @param _config - The project configuration
   * @returns API hooks content
   */
  generateApiHooks(_config: ProjectConfig): string {
    const imports = this.generateApiImports();
    const interfaces = this.generateApiInterfaces();
    const apiHook = this.generateApiHook();

    return `${imports}

${interfaces}

${apiHook}`;
  }

  /**
   * Generate imports for API hooks
   * @returns Imports content
   */
  private generateApiImports(): string {
    return `import { useState, useEffect, useCallback, useRef } from 'react';`;
  }

  /**
   * Generate API interfaces
   * @returns Interfaces content
   */
  private generateApiInterfaces(): string {
    return `interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

interface ApiOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
}`;
  }

  /**
   * Generate API hook
   * @returns API hook content
   */
  private generateApiHook(): string {
    const hookDeclaration = this.generateApiHookDeclaration();
    const coreLogic = this.generateApiCoreLogic();
    const executeFunction = this.generateApiExecuteFunction();
    const resetFunction = this.generateApiResetFunction();
    const returnValue = this.generateApiReturnValue();

    return `/**
 * Generic API hook for data fetching
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: ApiOptions = {}
) {
${hookDeclaration}

${coreLogic}

${executeFunction}

${resetFunction}

${returnValue}
}`;
  }

  /**
   * Generate API hook declaration
   * @returns Hook declaration code
   */
  private generateApiHookDeclaration(): string {
    return `  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { immediate = false, retryCount = 0, retryDelay = 1000 } = options;
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);`;
  }

  /**
   * Generate API core logic
   * @returns Core logic code
   */
  private generateApiCoreLogic(): string {
    return `  const execute = useCallback(async () => {
    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();

      if (mountedRef.current) {
        setState({
          data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
        retryCountRef.current = 0;
      }
    } catch (error) {
      if (mountedRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;
          setTimeout(execute, retryDelay * retryCountRef.current);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }
      }
    }
  }, [apiCall, retryCount, retryDelay]);`;
  }

  /**
   * Generate API execute function
   * @returns Execute function code
   */
  private generateApiExecuteFunction(): string {
    return `  const executeWithRetry = useCallback(() => {
    retryCountRef.current = 0;
    execute();
  }, [execute]);`;
  }

  /**
   * Generate API reset function
   * @returns Reset function code
   */
  private generateApiResetFunction(): string {
    return `  const reset = useCallback(() => {
    if (mountedRef.current) {
      setState({
        data: null,
        loading: false,
        error: null,
        lastFetched: null,
      });
      retryCountRef.current = 0;
    }
  }, []);`;
  }

  /**
   * Generate API return value
   * @returns Return value code
   */
  private generateApiReturnValue(): string {
    return `  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [immediate, execute]);

  return {
    ...state,
    execute: executeWithRetry,
    reset,
    refetch: executeWithRetry,
  };`;
  }
}
