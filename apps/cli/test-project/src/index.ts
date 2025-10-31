/**
 * test-project
 * A modern TypeScript library built with Bun
 *
 * @author Unknown
 * @license MIT
 * @version 1.0.0
 *
 * This package was generated using basic template
 * with medium quality standards.
 */

/**
 * test-project configuration and utilities
 */
export interface TestProjectConfig {
  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Custom options for test-project
   */
  options?: Record<string, unknown>;
}

/**
 * test-project core functionality
 */
export class TestProjectCore {
  private config: TestProjectConfig;
  /**
   *
   * @param config
   */
  constructor(config: TestProjectConfig = {}) {
    this.config = {
      debug: false,
      options: {},
      ...config
    };
  }
  /**
   * Initialize test-project
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.log(`test-project initialized with debug mode`);
    }
  }
  /**
   * Get current configuration
   */
  getConfig(): TestProjectConfig {
    return { ...this.config };
  }
  /**
   * Set configuration (replaces entire config)
   * @param newConfig
   */
  setConfig(newConfig: TestProjectConfig): void {
    this.config = { ...newConfig };
  }
  /**
   * Update configuration
   * @param newConfig
   */
  updateConfig(newConfig: Partial<TestProjectConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}