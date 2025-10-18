import type { Config } from '../types/config';

/**
 * Configuration repository interface (Port)
 *
 * Defines the contract for loading, saving, and merging configuration.
 * Implementations handle the actual file I/O and storage mechanism.
 *
 * Configuration cascade strategy:
 * 1. Defaults (hardcoded in packages/core/src/config/defaults.ts)
 * 2. Global config (~/.nimata/config.yaml) merged with defaults
 * 3. Project config (.nimatarc) merged with global + defaults (highest priority)
 */
export interface ConfigRepository {
  /**
   * Loads and merges configuration from all sources
   *
   * @param projectRoot - Project root directory (defaults to process.cwd())
   * @returns Merged configuration with cascade applied
   *
   * Cascade order (last wins):
   * 1. Load defaults
   * 2. Merge global config if exists (~/.nimata/config.yaml)
   * 3. Merge project config if exists (<projectRoot>/.nimatarc)
   */
  load: (projectRoot?: string) => Promise<Config>;

  /**
   * Saves configuration to project-specific file
   *
   * @param config - Configuration to save
   * @param projectRoot - Project root directory
   *
   * Saves to: <projectRoot>/.nimatarc
   */
  save: (config: Config, projectRoot: string) => Promise<void>;

  /**
   * Deep merges two configurations with override priority
   *
   * @param base - Base configuration
   * @param override - Override configuration (takes priority)
   * @returns Merged configuration
   *
   * Merge strategy:
   * - Nested objects are deeply merged
   * - Arrays are replaced (not merged)
   * - Undefined values do not override defined values
   * - Override values win on conflict
   */
  merge: (base: Config, override: Partial<Config>) => Config;
}
