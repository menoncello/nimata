/**
 * Hook Generator
 *
 * Generates React hooks for web applications
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { ApiHooksGenerator } from './api-hooks-generator.js';
import { RouterHooksGenerator } from './router-hooks-generator.js';
import { UtilityHooksGenerator } from './utility-hooks-generator.js';

/**
 * Generates React hooks for web applications
 */
export class HookGenerator {
  private utilityHooksGenerator = new UtilityHooksGenerator();
  private apiHooksGenerator = new ApiHooksGenerator();
  private routerHooksGenerator = new RouterHooksGenerator();

  /**
   * Generates application state hook
   * @param _config - The project configuration
   * @returns Application state hook content
   */
  generateAppStateHook(_config: ProjectConfig): string {
    const imports = this.generateHookImports();
    const interfaces = this.generateAppStateInterfaces();
    const appStateHook = this.generateMainAppStateHook();

    return `${imports}

${interfaces}

${appStateHook}`;
  }

  /**
   * Generate imports for hooks
   * @returns Imports content
   */
  private generateHookImports(): string {
    return `import { useState, useEffect, useCallback, useRef } from 'react';`;
  }

  /**
   * Generate application state interfaces
   * @returns Interfaces content
   */
  private generateAppStateInterfaces(): string {
    return `interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  notifications: Notification[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
}`;
  }

  /**
   * Generate the main application state hook
   * @returns Main app state hook content
   */
  private generateMainAppStateHook(): string {
    const hookDeclaration = this.generateAppStateHookDeclaration();
    const coreLogic = this.generateAppStateCoreLogic();
    const notificationLogic = this.generateNotificationLogic();
    const themeLogic = this.generateThemeLogic();
    const lifecycleEffects = this.generateAppStateLifecycleEffects();
    const returnValue = this.generateAppStateReturnValue();

    return `/**
 * Application state management hook
 */
export function useAppState() {
${hookDeclaration}

${coreLogic}

${notificationLogic}

${themeLogic}

${lifecycleEffects}

${returnValue}
}`;
  }

  /**
   * Generate hook state initialization
   * @returns Hook initialization content
   */
  private generateAppStateHookDeclaration(): string {
    return `  const [state, setState] = useState<AppState>(() => ({
    user: null,
    theme: 'light',
    loading: false,
    error: null,
    notifications: [],
  }));`;
  }

  /**
   * Generate core state management logic
   * @returns Core logic content
   */
  private generateAppStateCoreLogic(): string {
    return `  const updateUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);`;
  }

  /**
   * Generate notification management logic
   * @returns Notification logic content
   */
  private generateNotificationLogic(): string {
    return `  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification],
    }));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }));
  }, []);`;
  }

  /**
   * Generate theme management logic
   * @returns Theme logic content
   */
  private generateThemeLogic(): string {
    return `  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);`;
  }

  /**
   * Generate lifecycle effects
   * @returns Lifecycle effects content
   */
  private generateAppStateLifecycleEffects(): string {
    return `  useEffect(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;

      setTheme(initialTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n =>
          Date.now() - n.timestamp.getTime() < 5000
        ),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);`;
  }

  /**
   * Generate return value
   * @returns Return value content
   */
  private generateAppStateReturnValue(): string {
    return `  return {
    ...state,
    updateUser,
    setLoading,
    setError,
    addNotification,
    removeNotification,
    clearNotifications,
    setTheme,
  };`;
  }

  /**
   * Generate utility hooks
   * @param config - The project configuration
   * @returns Utility hooks content
   */
  generateUtilityHooks(config: ProjectConfig): string {
    return this.utilityHooksGenerator.generateUtilityHooks(config);
  }

  /**
   * Generate API hooks
   * @param config - The project configuration
   * @returns API hooks content
   */
  generateApiHooks(config: ProjectConfig): string {
    return this.apiHooksGenerator.generateApiHooks(config);
  }

  /**
   * Generate router hooks
   * @param config - The project configuration
   * @returns Router hooks content
   */
  generateRouterHooks(config: ProjectConfig): string {
    return this.routerHooksGenerator.generateRouterHooks(config);
  }
}
