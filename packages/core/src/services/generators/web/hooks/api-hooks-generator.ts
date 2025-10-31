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
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} API hooks content
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
   * @returns {string} Imports content
   */
  private generateApiImports(): string {
    return `import { useState, useEffect, useCallback, useRef } from 'react';`;
  }

  /**
   * Generate API interfaces
   * @returns {string} Interfaces content
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
   * @returns {string} API hook content
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
   * @returns {string} Hook declaration code
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
   * @returns {string} Core logic code
   */
  private generateApiCoreLogic(): string {
    return [
      this.getExecuteFunctionStart(),
      this.getApiSuccessHandling(),
      this.getApiErrorHandling(),
      this.getExecuteFunctionEnd(),
    ].join('\n');
  }

  /**
   * Get execute function start
   * @returns {string} Execute function start
   */
  private getExecuteFunctionStart(): string {
    return `  const execute = useCallback(async () => {
    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));`;
  }

  /**
   * Get API success handling
   * @returns {string} API success handling code
   */
  private getApiSuccessHandling(): string {
    return `    try {
      const data = await apiCall();

      if (mountedRef.current) {
        setState({
          data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
        retryCountRef.current = 0;
      }`;
  }

  /**
   * Get API error handling
   * @returns {string} API error handling code
   */
  private getApiErrorHandling(): string {
    return `    } catch (error) {
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
    }`;
  }

  /**
   * Get execute function end
   * @returns {string} Execute function end
   */
  private getExecuteFunctionEnd(): string {
    return `  }, [apiCall, retryCount, retryDelay]);`;
  }

  /**
   * Generate API execute function
   * @returns {string} Execute function code
   */
  private generateApiExecuteFunction(): string {
    return `  const executeWithRetry = useCallback(() => {
    retryCountRef.current = 0;
    execute();
  }, [execute]);`;
  }

  /**
   * Generate API reset function
   * @returns {string} Reset function code
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
   * @returns {string} Return value code
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
