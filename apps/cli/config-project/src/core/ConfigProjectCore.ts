import { ConfigProjectConfig } from '../types';

/**
 * Core class for config-project functionality
 */
export class ConfigProjectCore {
  private config: ConfigProjectConfig;

  /**
   * Constructor for ConfigProjectCore
   * @param {ConfigProjectConfig} config - The configuration object for the project
   */
  constructor(config: ConfigProjectConfig) {
    this.config = config;
  }

  /**
   * Initialize the project
   * @param {ConfigProjectConfig | undefined} config - Optional configuration overrides
   * @returns {boolean} True if initialization was successful
   */
  initialize(config?: ConfigProjectConfig): boolean {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    return true;
  }

  /**
   * Get current configuration
   * @returns {ConfigProjectConfig} A copy of the current configuration
   */
  getConfig(): ConfigProjectConfig {
    return { ...this.config };
  }

  /**
   * Set new configuration
   * @param {ConfigProjectConfig} config - The configuration object to set
   */
  setConfig(config: ConfigProjectConfig): void {
    this.config = config;
  }

  /**
   * Update configuration partially
   * @param {Partial<ConfigProjectConfig>} updates - Partial configuration updates to apply
   */
  updateConfig(updates: Partial<ConfigProjectConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
