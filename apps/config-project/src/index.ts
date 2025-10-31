/**
 * ConfigProject Core Library
 *
 * This file provides the core functionality for the config-project
 * as a library that can be imported and tested.
 */

export interface ConfigProjectConfig {
  debug?: boolean;
  options?: Record<string, unknown>;
}

/**
 * ConfigProjectCore - Main class for configuration management
 */
export class ConfigProjectCore {
  private config: ConfigProjectConfig;

  /**
   * Create a new ConfigProjectCore instance
   * @param {ConfigProjectConfig} config - Initial configuration object
   */
  constructor(config: ConfigProjectConfig = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config,
    };
  }

  /**
   * Initialize the config project core
   * @param {ConfigProjectConfig} config - Optional configuration to merge
   * @returns {ConfigProjectCore} This instance for method chaining
   */
  initialize(config?: ConfigProjectConfig): ConfigProjectCore {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    if (this.config.debug) {
      // Debug mode is enabled - proper logging would be implemented here
    }

    return this;
  }

  /**
   * Get current configuration
   * @returns {ConfigProjectConfig} A copy of the current configuration
   */
  getConfig(): ConfigProjectConfig {
    return { ...this.config };
  }

  /**
   * Set configuration
   * @param {ConfigProjectConfig} config - Configuration to merge with current config
   */
  setConfig(config: ConfigProjectConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Update configuration partially
   * @param {Partial<ConfigProjectConfig>} updates - Partial configuration to merge
   */
  updateConfig(updates: Partial<ConfigProjectConfig>): void {
    if (updates) {
      this.config = { ...this.config, ...updates };
    }
  }

  /**
   * Reset configuration to defaults
   * @returns {void}
   */
  resetConfig(): void {
    this.config = {
      debug: false,
      options: {},
    };
  }

  /**
   * Check if debug mode is enabled
   * @returns {boolean} True if debug mode is enabled
   */
  isDebugEnabled(): boolean {
    return Boolean(this.config.debug);
  }

  /**
   * Get a specific option value
   * @param {string} key - Option key to retrieve
   * @returns {unknown} Option value or undefined if not found
   */
  getOption(key: string): unknown {
    return this.config.options?.[key];
  }

  /**
   * Set a specific option value
   * @param {string} key - Option key to set
   * @param {unknown} value - Option value to set
   */
  setOption(key: string, value: unknown): void {
    if (!this.config.options) {
      this.config.options = {};
    }
    this.config.options[key] = value;
  }
}
