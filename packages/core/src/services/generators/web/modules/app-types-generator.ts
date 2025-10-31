/**
 * Application Types Generator
 *
 * Generates application-wide type definitions for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate application types
 * @param {ProjectConfig} _config - Project configuration (unused)
 * @returns {string} Application types code
 */
export function generateAppTypes(_config: ProjectConfig): string {
  const header = getAppTypesHeader();
  const stateTypes = getStateTypes();
  const navigationTypes = getNavigationTypes();
  const apiTypes = getApiTypes();
  const formTypes = getFormTypes();
  const themeTypes = getThemeTypes();
  const componentTypes = getComponentTypes();
  const environmentTypes = getEnvironmentTypes();

  return `${header}

${stateTypes}

${navigationTypes}

${apiTypes}

${formTypes}

${themeTypes}

${componentTypes}

${environmentTypes}`;
}

/**
 * Get app types header
 * @returns {string} Header comment
 */
function getAppTypesHeader(): string {
  return `/**
 * Application-wide type definitions
 */`;
}

/**
 * Get state-related types
 * @returns {string} State types code
 */
function getStateTypes(): string {
  return `// Global app state types
export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}`;
}

/**
 * Get navigation types
 * @returns {string} Navigation types code
 */
function getNavigationTypes(): string {
  return `// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}`;
}

/**
 * Get API response types
 * @returns {string} API types code
 */
function getApiTypes(): string {
  return `// API response types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}`;
}

/**
 * Get form-related types
 * @returns {string} Form types code
 */
function getFormTypes(): string {
  return `// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}`;
}

/**
 * Get theme types
 * @returns {string} Theme types code
 */
function getThemeTypes(): string {
  return `// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}`;
}

/**
 * Get component prop types
 * @returns {string} Component types code
 */
function getComponentTypes(): string {
  return `// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}`;
}

/**
 * Get environment types
 * @returns {string} Environment types code
 */
function getEnvironmentTypes(): string {
  return `// Environment types
export interface Environment {
  API_BASE_URL: string;
  APP_VERSION: string;
  NODE_ENV: 'development' | 'production' | 'test';
}`;
}
