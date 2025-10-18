import { homedir } from 'os';
import { join } from 'path';
import { DEFAULT_CONFIG } from '@nimata/core/config/defaults';
import type { ConfigRepository } from '@nimata/core/interfaces/config-repository';
import { ConfigSchema, validateConfigPaths, type Config } from '@nimata/core/types/config';
import { deepMerge } from '@nimata/core/utils/deep-merge';

/**
 * YAML Configuration Repository
 *
 * Implements ConfigRepository using Bun native YAML parsing.
 */
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * KB_PER_MB;
const MAX_NESTING_DEPTH = 10;

/**
 * YAML Configuration Repository implementation
 */
export class YAMLConfigRepository implements ConfigRepository {
  private static readonly MAX_FILE_SIZE_MB = 1;
  private static readonly MAX_FILE_SIZE = YAMLConfigRepository.MAX_FILE_SIZE_MB * BYTES_PER_MB;
  private static readonly PROJECT_CONFIG_NAME = '.nimatarc';

  private cachedConfig: Config | null = null;
  private cacheKey: string | null = null;

  /**
   * Loads configuration with full cascade support
   * @param projectRoot - Optional project root directory (defaults to process.cwd())
   * @returns Merged configuration with all cascade levels applied
   */
  async load(projectRoot?: string): Promise<Config> {
    const root = projectRoot || process.cwd();

    // Check cache first
    if (this.cachedConfig && this.cacheKey === root) {
      return this.cachedConfig;
    }

    let config = { ...DEFAULT_CONFIG };
    config = await this.loadAndMergeGlobalConfig(config);
    config = await this.loadAndMergeProjectConfig(config, root);

    this.cachedConfig = config;
    this.cacheKey = root;

    return config;
  }

  /**
   * Saves configuration to project .nimatarc file
   * @param config - Configuration object to save
   * @param projectRoot - Project root directory
   */
  async save(config: Config, projectRoot: string): Promise<void> {
    const configPath = join(projectRoot, YAMLConfigRepository.PROJECT_CONFIG_NAME);
    const yamlString = Bun.YAML.stringify(config);

    await Bun.write(configPath, yamlString);

    // Update cache
    this.cachedConfig = config;
    this.cacheKey = projectRoot;
  }

  /**
   * Merges configuration objects with deep merge strategy
   * @param base - Base configuration
   * @param override - Override configuration
   * @returns Merged configuration
   */
  merge(base: Config, override: Partial<Config>): Config {
    return deepMerge(base, override);
  }

  /**
   * Validates configuration schema
   * @param config - Configuration to validate
   * @returns Validated configuration
   */
  validate(config: unknown): Config {
    return ConfigSchema.parse(config);
  }

  /**
   * Clears the configuration cache
   */
  clearCache(): void {
    this.cachedConfig = null;
    this.cacheKey = null;
  }

  /**
   * Loads and merges global configuration
   * @param config - Base configuration
   * @returns Merged configuration
   */
  private async loadAndMergeGlobalConfig(config: Config): Promise<Config> {
    const home = process.env['HOME'] || homedir();
    const globalConfigPath = join(home, '.nimata', 'config.yaml');
    const globalConfig = await this.loadConfigFile(globalConfigPath);

    if (globalConfig) {
      return this.merge(config, globalConfig);
    }

    return config;
  }

  /**
   * Loads and merges project configuration
   * @param config - Base configuration
   * @param root - Project root directory
   * @returns Merged configuration
   */
  private async loadAndMergeProjectConfig(config: Config, root: string): Promise<Config> {
    const projectConfigPath = join(root, YAMLConfigRepository.PROJECT_CONFIG_NAME);
    const projectConfig = await this.loadConfigFile(projectConfigPath);

    if (projectConfig) {
      return this.merge(config, projectConfig);
    }

    return config;
  }

  /**
   * Loads configuration file with validation
   * @param path - File path to load
   * @returns Parsed configuration or null if file doesn't exist
   */
  private async loadConfigFile(path: string): Promise<Config | null> {
    try {
      const file = Bun.file(path);
      const exists = await file.exists();

      if (!exists) {
        return null;
      }

      await this.validateFileSize({ size: () => Promise.resolve(file.size) });
      const content = await file.text();
      const data = await this.parseAndValidateYAML(content);

      return this.validateConfigSchema(data, path);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid paths')) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * Validates file size
   * @param file - File to validate
   * @param file.size - File size function
   */
  private readonly validateFileSize = async (file: { size: () => Promise<number> }): Promise<void> => {
    const size = await file.size();
    if (size > YAMLConfigRepository.MAX_FILE_SIZE) {
      throw new Error(`Configuration file too large: ${size} bytes (max: ${YAMLConfigRepository.MAX_FILE_SIZE} bytes)`);
    }
  }

  /**
   * Parses and validates YAML content
   * @param content - YAML content to parse and validate
   * @returns Parsed and validated data
   */
  private async parseAndValidateYAML(content: string): Promise<Record<string, unknown>> {
    await this.validateYAMLSecurity(content);
    const data = Bun.YAML.parse(content) as Record<string, unknown>;
    await this.validateNestingDepth(data);
    return data;
  }

  /**
   * Validates configuration schema
   * @param data - Data to validate
   * @param path - File path for error reporting
   * @returns Validated configuration
   */
  private validateConfigSchema(data: Record<string, unknown>, path: string): Config {
    const validated = ConfigSchema.partial().parse(data);
    const pathErrors = validateConfigPaths(validated as Config);
    if (pathErrors.length > 0) {
      throw new Error(`Invalid paths in ${path}:\n${pathErrors.join('\n')}`);
    }
    return validated as Config;
  }

  /**
   * Validates YAML security constraints
   * @param yamlString - YAML content to validate
   */
  private async validateYAMLSecurity(yamlString: string): Promise<void> {
    // Check for YAML anchors/aliases (potential DoS vectors)
    if (yamlString.includes('&') || yamlString.includes('*')) {
      throw new Error('Config file contains YAML anchors/aliases which are not allowed for security reasons');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\${.*}/, // Environment variable interpolation
      /<script/i, // Script tags
      /javascript:/i, // JavaScript URLs
      /data:.*base64/i, // Base64 data URLs
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(yamlString)) {
        throw new Error('Config file contains potentially unsafe content');
      }
    }
  }

  /**
   * Validates nesting depth to prevent stack overflow attacks
   * @param obj - Object to validate
   * @param depth - Current depth (for recursion)
   */
  private async validateNestingDepth(obj: unknown, depth = 0): Promise<void> {
    if (depth > MAX_NESTING_DEPTH) {
      throw new Error(`Config exceeds maximum nesting depth of ${MAX_NESTING_DEPTH} levels`);
    }

    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const value of Object.values(obj as Record<string, unknown>)) {
        await this.validateNestingDepth(value, depth + 1);
      }
    }
  }

  /**
   * Counts enabled tools for logging purposes
   * @param config - Configuration object
   * @returns Number of enabled tools
   */
  private countEnabledTools(config: Config): number {
    return Object.values(config.tools).filter(tool => tool.enabled).length;
  }
}