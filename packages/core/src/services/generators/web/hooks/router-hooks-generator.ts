/**
 * Router Hooks Generator
 *
 * Generates router-related React hooks for web applications
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generates router-related React hooks for web applications
 */
export class RouterHooksGenerator {
  /**
   * Generates router hooks collection
   * @param {ProjectConfig} _config - Project configuration
   * @returns {string} Router hooks content
   */
  generateRouterHooks(_config: ProjectConfig): string {
    const imports = this.generateRouterImports();
    const interfaces = this.generateRouterInterfaces();
    const routerHook = this.generateRouterHook();

    return `${imports}

${interfaces}

${routerHook}`;
  }

  /**
   * Generate imports for router hooks
   * @returns {string} Imports content
   */
  private generateRouterImports(): string {
    return `import { useState, useEffect, useCallback } from 'react';`;
  }

  /**
   * Generate router interfaces
   * @returns {string} Interfaces content
   */
  private generateRouterInterfaces(): string {
    return `interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

interface RouterState {
  currentPath: string;
  params: Record<string, string>;
  query: Record<string, string>;
  isNavigating: boolean;
}`;
  }

  /**
   * Generate router hook
   * @returns {string} Router hook content
   */
  private generateRouterHook(): string {
    const hookDeclaration = this.generateRouterHookDeclaration();
    const navigationLogic = this.generateNavigationLogic();
    const eventHandlers = this.generateRouterEventHandlers();
    const effects = this.generateRouterEffects();

    return `/**
 * Simple router hook for client-side routing
 */
export function useRouter(routes: Route[] = []) {
${hookDeclaration}

${navigationLogic}

${eventHandlers}

${effects}

  return {
    currentPath: state.currentPath,
    params: state.params,
    query: state.query,
    isNavigating: state.isNavigating,
    navigate,
    goBack,
    goForward,
  };
}`;
  }

  /**
   * Generate router hook declaration
   * @returns {string} Hook declaration code
   */
  private generateRouterHookDeclaration(): string {
    return `  const [state, setState] = useState<RouterState>(() => ({
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    params: {},
    query: {},
    isNavigating: false,
  }));`;
  }

  /**
   * Generate navigation logic
   * @returns {string} Navigation logic code
   */
  private generateNavigationLogic(): string {
    return [this.getNavigateFunction(), this.getGoBackFunction(), this.getGoForwardFunction()].join(
      '\n\n'
    );
  }

  /**
   * Get navigate function
   * @returns {string} Navigate function code
   */
  private getNavigateFunction(): string {
    return [
      this.getNavigateFunctionStart(),
      this.getNavigateHistoryHandling(),
      this.getUrlParsing(),
      this.getRouteMatching(),
      this.getNavigateFunctionEnd(),
    ].join('\n');
  }

  /**
   * Get navigate function start
   * @returns {string} Navigate function start
   */
  private getNavigateFunctionStart(): string {
    return `  const navigate = useCallback((path: string, replace = false) => {
    setState(prev => ({ ...prev, isNavigating: true }));`;
  }

  /**
   * Get navigate history handling
   * @returns {string} Navigate history handling code
   */
  private getNavigateHistoryHandling(): string {
    return `    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
    }`;
  }

  /**
   * Get URL parsing logic
   * @returns {string} URL parsing code
   */
  private getUrlParsing(): string {
    return `    // Parse URL
    const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const params: Record<string, string> = {};
    const query: Record<string, string> = {};

    // Extract query parameters
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });`;
  }

  /**
   * Get route matching logic
   * @returns {string} Route matching code
   */
  private getRouteMatching(): string {
    return `    // Find matching route and extract params
    const matchedRoute = routes.find(route => {
      const routePattern = route.path
        .replace(/:[^/]+/g, '([^/]+)')
        .replace(/\*/g, '.*');
      const regex = new RegExp(\`^\${routePattern}$\`);
      const match = path.match(regex);

      if (match) {
        const paramKeys = (route.path.match(/:[^/]+/g) || [])
          .map(key => key.substring(1));
        paramKeys.forEach((key, index) => {
          params[key] = match[index + 1];
        });
        return true;
      }
      return false;
    });`;
  }

  /**
   * Get navigate function end
   * @returns {string} Navigate function end
   */
  private getNavigateFunctionEnd(): string {
    return `    setState(prev => ({
      ...prev,
      currentPath: path,
      params,
      query,
      isNavigating: false,
    }));
  }, [routes]);`;
  }

  /**
   * Get go back function
   * @returns {string} Go back function code
   */
  private getGoBackFunction(): string {
    return `  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);`;
  }

  /**
   * Get go forward function
   * @returns {string} Go forward function code
   */
  private getGoForwardFunction(): string {
    return `  const goForward = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }, []);`;
  }

  /**
   * Generate router event handlers
   * @returns {string} Event handlers code
   */
  private generateRouterEventHandlers(): string {
    return `  const handlePopState = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigate(window.location.pathname, true);
    }
  }, [navigate]);`;
  }

  /**
   * Generate router effects
   * @returns {string} Effects code
   */
  private generateRouterEffects(): string {
    return `  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [handlePopState]);`;
  }
}
