import { useState, useEffect, useCallback } from 'react';

interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

interface RouterState {
  currentPath: string;
  params: Record<string, string>;
  query: Record<string, string>;
  isNavigating: boolean;
}

interface RouterResult {
  currentPath: string;
  params: Record<string, string>;
  query: Record<string, string>;
  isNavigating: boolean;
  navigate: (path: string, replace?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
}

const parseUrl = (
  path: string
): { params: Record<string, string>; query: Record<string, string> } => {
  const url = new URL(
    path,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  );
  const params: Record<string, string> = {};
  const query: Record<string, string> = {};

  // Extract query parameters
  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value;
  }

  return { params, query };
};

/**
 * Initializes the router state with current location
 * @returns {RouterState} Initial router state
 */
const createInitialState = (): RouterState => ({
  currentPath: typeof window === 'undefined' ? '/' : window.location.pathname,
  params: {},
  query: {},
  isNavigating: false,
});

/**
 * Updates state for navigation
 * @param {React.Dispatch<React.SetStateAction<RouterState>>} setState - State setter function
 * @param {string} path - Target path
 * @param {Record<string, string>} params - Route parameters
 * @param {Record<string, string>} query - Query parameters
 * @returns {void}
 */
const updateNavigationState = (
  setState: React.Dispatch<React.SetStateAction<RouterState>>,
  path: string,
  params: Record<string, string>,
  query: Record<string, string>
): void => {
  setState((prev) => ({
    ...prev,
    currentPath: path,
    params,
    query,
    isNavigating: false,
  }));
};

/**
 * Handles browser history navigation
 * @param {string} path - URL path to navigate to
 * @param {boolean} replace - Whether to replace current history entry
 * @returns {void}
 */
const handleHistoryNavigation = (path: string, replace: boolean): void => {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
  }
};

/**
 * Creates navigation function with proper state management
 * @param {React.Dispatch<React.SetStateAction<RouterState>>} setState - State setter function
 * @param {Route[]} _routes - Available routes array (currently unused but required for consistency)
 * @returns {(path: string, replace?: boolean) => void} Navigation function
 */
const createNavigateFunction = (
  setState: React.Dispatch<React.SetStateAction<RouterState>>,
  _routes: Route[]
): ((path: string, replace?: boolean) => void) => {
  return (path: string, replace = false): void => {
    setState((prev) => ({ ...prev, isNavigating: true }));
    handleHistoryNavigation(path, replace);
    const { params, query } = parseUrl(path);
    updateNavigationState(setState, path, params, query);
  };
};

/**
 * Creates history navigation functions
 * @returns {{ goBack: () => void; goForward: () => void }} History navigation functions
 */
const createHistoryFunctions = (): { goBack: () => void; goForward: () => void } => {
  const goBack = useCallback((): void => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  const goForward = useCallback((): void => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }, []);

  return { goBack, goForward };
};

/**
 * Creates popstate event handler
 * @param {(path: string, replace?: boolean) => void} navigate - Navigation function
 * @returns {() => void} Popstate event handler
 */
const createPopStateHandler = (
  navigate: (path: string, replace?: boolean) => void
): (() => void) => {
  return useCallback((): void => {
    if (typeof window !== 'undefined') {
      navigate(window.location.pathname, true);
    }
  }, [navigate]);
};

/**
 * Sets up popstate event listener
 * @param {() => void} handlePopState - Popstate event handler
 * @returns {void}
 */
const setupPopStateListener = (handlePopState: () => void): void => {
  useEffect((): (() => void) | undefined => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return (): void => window.removeEventListener('popstate', handlePopState);
    }
    return undefined;
  }, [handlePopState]);
};

/**
 * Simple router hook for client-side routing
 * @param {Route[]} routes - Array of route definitions with path and component
 * @returns {RouterResult} Router state and navigation functions
 */
export function useRouter(routes: Route[]): RouterResult {
  const [state, setState] = useState<RouterState>(createInitialState);
  const navigate = useCallback(createNavigateFunction(setState, routes), [routes]);

  const { goBack, goForward } = createHistoryFunctions();
  const handlePopState = createPopStateHandler(navigate);

  setupPopStateListener(handlePopState);

  return {
    currentPath: state.currentPath,
    params: state.params,
    query: state.query,
    isNavigating: state.isNavigating,
    navigate,
    goBack,
    goForward,
  };
}
