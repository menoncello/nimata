/**
 * App State Hook
 *
 * Global application state management for config-project
 */

export interface AppState {
  user: {
    isAuthenticated: boolean;
    name?: string;
    email?: string;
  };
  theme: 'light' | 'dark';
  loading: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface AppStateHookReturn {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  subscribe: (listener: (state: AppState) => void) => () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * App state manager
 */
export class AppStateManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  /**
   * Creates a new AppStateManager instance
   * @param {Partial<AppState>} initialState - Initial state to merge with default state
   */
  constructor(initialState: Partial<AppState> = {}) {
    this.state = {
      user: {
        isAuthenticated: false,
      },
      theme: 'light',
      loading: false,
      notifications: [],
      ...initialState,
    };
  }

  /**
   * Get current state
   * @returns {AppState} Current app state
   */
  getState(): AppState {
    return { ...this.state };
  }

  /**
   * Update state
   * @param {Partial<AppState>} updates - State updates to apply
   */
  updateState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   * @param {(state: AppState) => void} listener - Listener function to be called when state changes
   * @returns {() => void} Unsubscribe function to remove listener
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Add notification
   * @param {Omit<Notification, 'id' | 'timestamp'>} notification - Notification to add to the notifications array
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...notification,
    };

    this.updateState({
      notifications: [...this.state.notifications, newNotification],
    });
  }

  /**
   * Remove notification
   * @param {string} id - Notification ID to remove from the notifications array
   */
  removeNotification(id: string): void {
    this.updateState({
      notifications: this.state.notifications.filter((n) => n.id !== id),
    });
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state value
   */
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  /**
   * Set theme
   * @param {'light' | 'dark'} theme - Theme to set ('light' or 'dark')
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
    if (typeof globalThis !== 'undefined' && globalThis.document) {
      globalThis.document.documentElement.setAttribute('data-theme', theme);
    }
  }
}

/**
 * Global app state instance
 */
export const appState = new AppStateManager();

/**
 * Hook for accessing app state
 * @returns {AppStateHookReturn} App state and utilities for managing application state
 */
export function useAppState(): AppStateHookReturn {
  return {
    state: appState.getState(),
    updateState: appState.updateState.bind(appState),
    subscribe: appState.subscribe.bind(appState),
    addNotification: appState.addNotification.bind(appState),
    removeNotification: appState.removeNotification.bind(appState),
    setLoading: appState.setLoading.bind(appState),
    setTheme: appState.setTheme.bind(appState),
  };
}
