/**
 * config-project
 * Project from config
 *
 * @author Unknown
 * @license MIT
 * @version 1.0.0
 *
 * This package was generated using basic template
 * with strict quality standards.
 */

export interface ConfigProjectConfig {
  /** Application name */
  name: string;
  /** Application version */
  version: string;
  /** Debug mode flag */
  debug: boolean;
  /** API base URL */
  apiBaseUrl?: string;
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Router mode */
  routerMode?: 'hash' | 'history';
  /** Custom options */
  options?: Record<string, unknown>;
}

export interface Route {
  /** Route path */
  path: string;
  /** Component name */
  component: string;
  /** Route title */
  title?: string;
  /** Route meta */
  meta?: Record<string, unknown>;
}

export interface AppComponent {
  /** Component name */
  name: string;
  /** Component props */
  props?: Record<string, unknown>;
  /** Component state */
  state?: Record<string, unknown>;
}

/**
 *
 */
export class ConfigProjectApp {
  private config: ConfigProjectConfig;
  private initialized = false;
  private currentRoute = '/';

  /**
   *
   * @param config
   */
  constructor(config: Partial<ConfigProjectConfig> = {}) {
    this.config = {
      name: 'config-project',
      version: '1.0.0',
      debug: false,
      theme: 'light',
      routerMode: 'history',
      ...config,
    };
  }

  /**
   * Initialize web application
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.config.debug) {
      console.log(`${this.config.name} v${this.config.version} initializing...`);
    }

    // Initialize web-specific logic here
    this.setupRouting();
    this.setupTheme();

    this.initialized = true;

    if (this.config.debug) {
      console.log('Web app initialized successfully');
    }
  }

  /**
   * Setup routing
   */
  private setupRouting(): void {
    // Routing setup logic here
    if (this.config.debug) {
      console.log('Setting up routing...');
    }
  }

  /**
   * Setup theme
   */
  private setupTheme(): void {
    if (this.config.theme && this.config.theme !== 'auto') {
      document.documentElement.setAttribute('data-theme', this.config.theme);
    }
  }

  /**
   * Navigate to route
   * @param path - Route path
   */
  navigateTo(path: string): void {
    this.currentRoute = path;
    if (this.config.routerMode === 'history') {
      history.pushState({}, '', path);
    } else {
      location.hash = path;
    }
    this.render();
  }

  /**
   * Render application
   */
  private render(): void {
    // Rendering logic here
    if (this.config.debug) {
      console.log(`Rendering route: ${this.currentRoute}`);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ConfigProjectConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   * @param updates
   */
  updateConfig(updates: Partial<ConfigProjectConfig>): void {
    this.config = { ...this.config, ...updates };
    if (updates.theme) {
      this.setupTheme();
    }
  }
}

// Export main class and types
export { ConfigProjectApp as default, ConfigProjectApp };
export type { ConfigProjectConfig, Route, AppComponent };

// Convenience function
/**
 *
 * @param config
 */
export async function createApp(config?: Partial<ConfigProjectConfig>): Promise<ConfigProjectApp> {
  const app = new ConfigProjectApp(config);
  await app.initialize();
  return app;
}
