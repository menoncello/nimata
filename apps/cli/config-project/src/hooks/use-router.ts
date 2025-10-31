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

/**
 * Simple router hook for client-side routing
 */
export function useRouter(routes: Route[] = []) {
  const [state, setState] = useState<RouterState>(() => ({
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    params: {},
    query: {},
    isNavigating: false,
  }));

  const navigate = useCallback(
    (path: string, replace = false) => {
      setState((prev) => ({ ...prev, isNavigating: true }));
      if (typeof window !== 'undefined') {
        if (replace) {
          window.history.replaceState(null, '', path);
        } else {
          window.history.pushState(null, '', path);
        }
      }
      // Parse URL
      const url = new URL(
        path,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
      );
      const params: Record<string, string> = {};
      const query: Record<string, string> = {};

      // Extract query parameters
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });
      // Find matching route and extract params
      const matchedRoute = routes.find((route) => {
        const routePattern = route.path.replace(/:[^/]+/g, '([^/]+)').replace(/\*\*/g, '.*');
        const regex = new RegExp(`^${routePattern}$`);
        const match = path.match(regex);

        if (match) {
          const paramKeys = (route.path.match(/:[^/]+/g) || []).map((key) => key.substring(1));
          paramKeys.forEach((key, index) => {
            params[key] = match[index + 1];
          });
          return true;
        }
        return false;
      });
      setState((prev) => ({
        ...prev,
        currentPath: path,
        params,
        query,
        isNavigating: false,
      }));
    },
    [routes]
  );

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  const goForward = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }, []);

  const handlePopState = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigate(window.location.pathname, true);
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [handlePopState]);

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
