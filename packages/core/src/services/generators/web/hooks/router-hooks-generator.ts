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
   * @param _config - The project configuration
   * @returns Router hooks content
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
   * @returns Imports content
   */
  private generateRouterImports(): string {
    return `import { useState, useEffect, useCallback } from 'react';`;
  }

  /**
   * Generate router interfaces
   * @returns Interfaces content
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
   * @returns Router hook content
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
   * @returns Hook declaration code
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
   * @returns Navigation logic code
   */
  private generateNavigationLogic(): string {
    return `  const navigate = useCallback((path: string, replace = false) => {
    setState(prev => ({ ...prev, isNavigating: true }));

    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
    }

    // Parse URL
    const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const params: Record<string, string> = {};
    const query: Record<string, string> = {};

    // Extract query parameters
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    // Find matching route and extract params
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
    });

    setState(prev => ({
      ...prev,
      currentPath: path,
      params,
      query,
      isNavigating: false,
    }));
  }, [routes]);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  const goForward = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }, []);`;
  }

  /**
   * Generate router event handlers
   * @returns Event handlers code
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
   * @returns Effects code
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
