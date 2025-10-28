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

/**
 * App state manager
 */
export class AppStateManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  /**
   *
   * @param initialState
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
   * @returns Current app state
   */
  getState(): AppState {
    return { ...this.state };
  }

  /**
   * Update state
   * @param updates - State updates
   */
  updateState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   * @param listener - Listener function
   * @returns Unsubscribe function
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
    for (const listener of this.listeners) listener(this.getState());
  }

  /**
   * Add notification
   * @param notification - Notification to add
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
   * @param id - Notification ID to remove
   */
  removeNotification(id: string): void {
    this.updateState({
      notifications: this.state.notifications.filter((n) => n.id !== id),
    });
  }

  /**
   * Set loading state
   * @param loading - Loading state
   */
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  /**
   * Set theme
   * @param theme - Theme to set
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/**
 * Global app state instance
 */
export const appState = new AppStateManager();

/**
 * Hook for accessing app state
 * @returns App state and utilities
 */
export function useAppState() {
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
