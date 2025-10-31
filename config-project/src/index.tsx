/**
 * ConfigProject Core Library
 *
 * This file provides the core functionality for the config-project
 * as a library that can be imported and tested.
 */

export interface ConfigProjectConfig {
  debug?: boolean;
  options?: Record<string, any>;
}

export class ConfigProjectCore {
  private config: ConfigProjectConfig;

  constructor(config: ConfigProjectConfig = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config,
    };
  }

  /**
   * Initialize the config project core
   */
  initialize(config?: ConfigProjectConfig): ConfigProjectCore {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    if (this.config.debug) {
      console.log('ConfigProjectCore initialized with debug mode');
    }

    return this;
  }

  /**
   * Get current configuration
   */
  getConfig(): ConfigProjectConfig {
    return { ...this.config };
  }

  /**
   * Set configuration
   */
  setConfig(config: ConfigProjectConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Update configuration partially
   */
  updateConfig(updates: Partial<ConfigProjectConfig>): void {
    if (updates) {
      this.config = { ...this.config, ...updates };
    }
  }

  /**
   * Reset configuration to defaults
   */
  resetConfig(): void {
    this.config = {
      debug: false,
      options: {},
    };
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugEnabled(): boolean {
    return Boolean(this.config.debug);
  }

  /**
   * Get a specific option value
   */
  getOption(key: string): any {
    return this.config.options?.[key];
  }

  /**
   * Set a specific option value
   */
  setOption(key: string, value: any): void {
    if (!this.config.options) {
      this.config.options = {};
    }
    this.config.options[key] = value;
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

/**
 * Initialize and render the React application
 */
function initializeApp(): void {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Initialize the application only when this file is run directly
if (typeof window !== 'undefined' && document.getElementById('root')) {
  initializeApp();
}

export { initializeApp };
export default ConfigProjectCore;
