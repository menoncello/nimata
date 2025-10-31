import { ConfigProjectConfig } from '../types';

/**
 * Core class for config-project functionality
 */
export class ConfigProjectCore {
  private config: ConfigProjectConfig;

  constructor(config: ConfigProjectConfig) {
    this.config = config;
  }

  /**
   * Initialize the project
   */
  initialize(config?: ConfigProjectConfig): boolean {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    return true;
  }

  /**
   * Get current configuration
   */
  getConfig(): ConfigProjectConfig {
    return { ...this.config };
  }

  /**
   * Set new configuration
   */
  setConfig(config: ConfigProjectConfig): void {
    this.config = config;
  }

  /**
   * Update configuration partially
   */
  updateConfig(updates: Partial<ConfigProjectConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
