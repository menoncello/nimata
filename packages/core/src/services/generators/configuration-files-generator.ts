/**
 * Configuration Files Generator
 *
 * Handles generation of configuration files for projects
 * Integrates with existing DirectoryStructureGenerator functionality
 */
import type { ProjectConfig } from '../../types/project-config.js';
import { FILE_PERMISSIONS } from '../validators/validation-constants.js';
import { ConfigFileGenerators } from './config/config-file-generators.js';
import { DirectoryItem } from './directory-structure-generator.js';

/**
 * Configuration Files Generator
 *
 * Provides focused interface for generating configuration files
 * Wraps the existing DirectoryStructureGenerator functionality
 */
export class ConfigurationFilesGenerator {
  private readonly configFileGenerators: ConfigFileGenerators;

  /**
   * Create a new ConfigurationFilesGenerator instance
   */
  constructor() {
    this.configFileGenerators = new ConfigFileGenerators();
  }

  /**
   * Generate configuration files for a project
   * @param config - Project configuration
   * @returns Array of configuration file items
   */
  generate(config: ProjectConfig): DirectoryItem[] {
    const configFiles: DirectoryItem[] = [];

    // Always generate .gitignore
    configFiles.push({
      path: '.gitignore',
      type: 'file',
      mode: FILE_PERMISSIONS,
      content: this.configFileGenerators.generateGitignore(config),
    });

    // Always generate package.json
    configFiles.push({
      path: 'package.json',
      type: 'file',
      mode: FILE_PERMISSIONS,
      content: this.configFileGenerators.generatePackageJson(config),
    });

    // Always generate tsconfig.json
    configFiles.push({
      path: 'tsconfig.json',
      type: 'file',
      mode: FILE_PERMISSIONS,
      content: this.configFileGenerators.generateTsConfig(config),
    });

    // Generate ESLint configuration for strict/high quality levels
    if (config.qualityLevel === 'strict' || config.qualityLevel === 'high') {
      configFiles.push({
        path: 'eslint.config.js',
        type: 'file',
        mode: FILE_PERMISSIONS,
        content: this.configFileGenerators.generateESLintConfig(config),
      });
    }

    return configFiles;
  }
}
