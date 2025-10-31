import { useState, useEffect, useCallback, useRef } from 'react';

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

/**
 * Application state management hook
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    user: null,
    theme: 'light',
    loading: false,
    error: null,
    notifications: [],
  }));

  const updateUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
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
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  useEffect(() => {
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
  }, []);

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