/**
 * App Types
 *
 * Type definitions for config-project
 */

export interface AppConfig {
  name: string;
  version: string;
  description?: string;
  debug: boolean;
  theme?: 'light' | 'dark';
  apiBaseUrl?: string;
}

export interface Route {
  path: string;
  component: string;
  title?: string;
  meta?: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ComponentProps {
  [key: string]: unknown;
}

export interface EventData {
  type: string;
  data: unknown;
  timestamp: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}
