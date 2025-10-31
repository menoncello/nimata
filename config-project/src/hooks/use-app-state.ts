import { useState, useEffect } from 'react';

interface AppState {
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
}

// Constants for timing operations
const NOTIFICATION_DISPLAY_DURATION = 5000; // 5 seconds
const NOTIFICATION_CHECK_INTERVAL = 1000; // 1 second

// Helper function to initialize theme
const initializeTheme = (setTheme: (theme: 'light' | 'dark') => void): void => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
  }
};

// Helper function to filter expired notifications
const filterExpiredNotifications = (notifications: Notification[]): Notification[] => {
  return notifications.filter((n) => Date.now() - n.timestamp.getTime() < NOTIFICATION_DISPLAY_DURATION);
};

// Simple state updater functions
const createUpdateUser = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (user: User | null) => {
  setState((prev) => ({ ...prev, user }));
};

const createSetLoading = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (loading: boolean) => {
  setState((prev) => ({ ...prev, loading }));
};

const createSetError = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (error: string | null) => {
  setState((prev) => ({ ...prev, error }));
};

const createAddNotification = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  setState((prev) => ({
    ...prev,
    notifications: [...prev.notifications, newNotification],
  }));
};

const createRemoveNotification = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (id: string) => {
  setState((prev) => ({
    ...prev,
    notifications: prev.notifications.filter((n) => n.id !== id),
  }));
};

const createClearNotifications = (setState: React.Dispatch<React.SetStateAction<AppState>>) => () => {
  setState((prev) => ({ ...prev, notifications: [] }));
};

const createSetTheme = (setState: React.Dispatch<React.SetStateAction<AppState>>) => (theme: 'light' | 'dark') => {
  setState((prev) => ({ ...prev, theme }));

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

// Helper function to set up effects
const setupEffects = (setTheme: (theme: 'light' | 'dark') => void, setState: React.Dispatch<React.SetStateAction<AppState>>): void => {
  useEffect(() => {
    initializeTheme(setTheme);
  }, [setTheme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        notifications: filterExpiredNotifications(prev.notifications),
      }));
    }, NOTIFICATION_CHECK_INTERVAL);

    return () => clearInterval(timer);
  }, []);
};

// Hook state creation and function setup
const useAppCore = (): {
  state: AppState;
  updateUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
} => {
  const [state, setState] = useState<AppState>(() => ({
    user: null,
    theme: 'light',
    loading: false,
    error: null,
    notifications: [],
  }));

  const updateUser = createUpdateUser(setState);
  const setLoading = createSetLoading(setState);
  const setError = createSetError(setState);
  const addNotification = createAddNotification(setState);
  const removeNotification = createRemoveNotification(setState);
  const clearNotifications = createClearNotifications(setState);
  const setTheme = createSetTheme(setState);

  return { state, updateUser, setLoading, setError, addNotification, removeNotification, clearNotifications, setTheme };
};

/**
 * Application state management hook
 * @returns {object} Object containing state management functions and state variables
 */
export function useAppState(): {
  user: User | null;
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  updateUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
} {
  const { state, updateUser, setLoading, setError, addNotification, removeNotification, clearNotifications, setTheme } = useAppCore();
  setupEffects(setTheme, setState);

  return {
    ...state,
    updateUser,
    setLoading,
    setError,
    addNotification,
    removeNotification,
    clearNotifications,
    setTheme,
  };
}
