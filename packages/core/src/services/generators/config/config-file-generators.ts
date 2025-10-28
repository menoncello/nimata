/**
 * Configuration File Generators
 *
 * Generates individual configuration files for projects
 */
import type { ProjectConfig } from '../../../types/project-config.js';
import { ESLintConfigGenerator } from './eslint-config-generator.js';
import { GitignoreGenerator } from './gitignore-generator.js';
import { PackageJsonGenerator } from './package-json-generator.js';
import { TypeScriptConfigGenerator } from './typescript-config-generator.js';

/**
 * Configuration File Generators
 *
 * Generates individual configuration files for projects
 */
export class ConfigFileGenerators {
  private readonly gitignoreGenerator = new GitignoreGenerator();
  private readonly packageJsonGenerator = new PackageJsonGenerator();
  private readonly typescriptConfigGenerator = new TypeScriptConfigGenerator();
  private readonly eslintConfigGenerator = new ESLintConfigGenerator();

  /**
   * Generate .gitignore content
   * @param config - Project configuration
   * @returns .gitignore content
   */
  generateGitignore(config: ProjectConfig): string {
    return this.gitignoreGenerator.generate(config);
  }

  /**
   * Generate package.json content
   * @param config - Project configuration
   * @returns package.json content
   */
  generatePackageJson(config: ProjectConfig): string {
    return this.packageJsonGenerator.generate(config);
  }

  /**
   * Generate TypeScript configuration
   * @param config - Project configuration
   * @returns tsconfig.json content
   */
  generateTsConfig(config: ProjectConfig): string {
    return this.typescriptConfigGenerator.generate(config);
  }

  /**
   * Generate ESLint configuration
   * @param config - Project configuration
   * @returns eslint.config.js content
   */
  generateESLintConfig(config: ProjectConfig): string {
    return this.eslintConfigGenerator.generate(config);
  }
}
