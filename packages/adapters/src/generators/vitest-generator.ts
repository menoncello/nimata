/**
 * Vitest Configuration Generator
 *
 * Generates Vitest configuration files based on project requirements and quality levels
 */

import { COVERAGE_LEVELS } from '../utils/constants.js';
import {
  buildSetupHeader,
  buildCustomMatchers,
  buildGlobalHooks,
  buildWebSetupContent,
  buildStrictSetupContent,
} from './setup-builders.js';
import {
  buildTestConfigBody,
  buildUnitTestConfig,
  buildIntegrationTestConfig,
  buildBrowserTestConfig,
  type TestConfigOptions,
} from './test-config-builders.js';

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

export interface VitestConfigOptions {
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  targetEnvironment: 'node' | 'browser' | 'both';
  enableTypeScript: boolean;
  enableCoverage: boolean;
  enableUI: boolean;
  coverageThreshold: number;
}

export interface GeneratedVitestConfig {
  filename: string;
  content: string;
  description: string;
}

/**
 * Vitest Configuration Generator
 */
export class VitestGenerator {
  /**
   * Generate Vitest configuration for a project
   *
   * @param {ProjectConfig} config - Project configuration
   * @returns {ProjectConfig): GeneratedVitestConfig[]} Generated Vitest configuration files
   */
  generate(config: ProjectConfig): GeneratedVitestConfig[] {
    const options: VitestConfigOptions = {
      qualityLevel: config.qualityLevel,
      projectType: config.projectType,
      targetEnvironment: this.getTargetEnvironment(config.projectType),
      enableTypeScript: true,
      enableCoverage: true,
      enableUI: config.projectType !== 'cli',
      coverageThreshold: this.getCoverageThreshold(config.qualityLevel),
    };

    const configs: GeneratedVitestConfig[] = [];

    // Generate main Vitest configuration
    configs.push(this.generateMainConfig(options));

    // Generate workspace configuration for complex projects
    if (options.projectType === 'web' || options.projectType === 'library') {
      configs.push(this.generateWorkspaceConfig(options));
    }

    // Generate setup files
    configs.push(this.generateSetupFile(options));

    return configs;
  }

  /**
   * Generate main Vitest configuration
   * @param {VitestConfigOptions} options - Configuration options for Vitest
   * @returns {VitestConfigOptions): GeneratedVitestConfig} Main Vitest configuration object
   */
  private generateMainConfig(options: VitestConfigOptions): GeneratedVitestConfig {
    const filename = 'vitest.config.ts';
    const content = this.buildMainConfigContent(options);

    return {
      filename,
      content,
      description: 'Main Vitest configuration with test setup',
    };
  }

  /**
   * Generate workspace configuration
   * @param {VitestConfigOptions} options - Configuration options for Vitest workspace
   * @returns {VitestConfigOptions): GeneratedVitestConfig} Workspace configuration object
   */
  private generateWorkspaceConfig(options: VitestConfigOptions): GeneratedVitestConfig {
    const filename = 'vitest.workspace.ts';
    const content = this.buildWorkspaceConfigContent(options);

    return {
      filename,
      content,
      description: 'Vitest workspace configuration for multi-package projects',
    };
  }

  /**
   * Generate setup file
   * @param {VitestConfigOptions} options - Configuration options for Vitest setup
   * @returns {VitestConfigOptions): GeneratedVitestConfig} Setup file configuration object
   */
  private generateSetupFile(options: VitestConfigOptions): GeneratedVitestConfig {
    const filename = 'tests/setup.ts';
    const content = this.buildSetupFileContent(options);

    return {
      filename,
      content,
      description: 'Vitest setup file with global configurations',
    };
  }

  /**
   * Build main Vitest configuration content
   * @param {VitestConfigOptions} options - Configuration options for Vitest
   * @returns {VitestConfigOptions): string} Generated configuration string
   */
  private buildMainConfigContent(options: VitestConfigOptions): string {
    const testEnvironment = this.getTestEnvironment(options.targetEnvironment);
    const coverageConfig = this.getCoverageConfig(options);
    const importSection = this.buildImportSection(options);
    const testConfig = this.buildTestConfigSection(options, testEnvironment, coverageConfig);

    return `${importSection}
${testConfig}
`;
  }

  /**
   * Build import section for Vitest configuration
   * @param {VitestConfigOptions} options - Configuration options for Vitest
   * @returns {VitestConfigOptions): string} Import section string
   */
  private buildImportSection(options: VitestConfigOptions): string {
    const tsconfigImport = options.enableTypeScript
      ? "import tsconfigPaths from 'vite-tsconfig-paths';\n"
      : '';

    return `import { defineConfig } from 'vitest/config';
${tsconfigImport}`;
  }

  /**
   * Build test configuration section
   * @param {unknown} options - Configuration options for Vitest
   * @param {unknown} testEnvironment - Test environment to use
   * @param {unknown} coverageConfig - Coverage configuration string
   * @returns {string} Test configuration section
   */
  private buildTestConfigSection(
    options: VitestConfigOptions,
    testEnvironment: string,
    coverageConfig: string
  ): string {
    const plugins = options.enableTypeScript ? 'plugins: [tsconfigPaths()],\n  ' : '';
    const uiConfig = options.enableUI ? 'ui: true,\n    ' : '';
    const testMatch = this.getTestMatchPatterns(options.projectType);
    const reporterConfig = this.getReporterConfig(options.qualityLevel);
    const timeoutConfig = this.getTimeoutConfig(options.qualityLevel);

    const testConfigOptions: TestConfigOptions = {
      testEnvironment,
      uiConfig,
      coverageConfig,
      testMatch,
      reporterConfig,
      timeoutConfig,
    };

    const testConfigBody = this.buildTestConfigBody(testConfigOptions);

    return `export default defineConfig({
  ${plugins}test: ${testConfigBody}
});`;
  }

  /**
   * Build test configuration body
   * @param {TestConfigOptions} options - Test configuration options
   * @returns {TestConfigOptions): string} Test configuration body string
   */
  private buildTestConfigBody(options: TestConfigOptions): string {
    return buildTestConfigBody(options);
  }

  /**
   * Build workspace configuration content
   * @param {VitestConfigOptions} options - Configuration options for Vitest workspace
   * @returns {VitestConfigOptions): string} Generated workspace configuration string
   */
  private buildWorkspaceConfigContent(options: VitestConfigOptions): string {
    const unitTestConfig = this.buildUnitTestConfig();
    const integrationTestConfig = this.buildIntegrationTestConfig(options);
    const browserTestConfig = options.projectType === 'web' ? this.buildBrowserTestConfig() : '';

    return `import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Unit tests
  ${unitTestConfig},
  // Integration tests
  ${integrationTestConfig}${browserTestConfig}
]);
`;
  }

  /**
   * Build unit test configuration for workspace
   * @returns {string} Unit test configuration string
   */
  private buildUnitTestConfig(): string {
    return buildUnitTestConfig();
  }

  /**
   * Build integration test configuration for workspace
   * @param {VitestConfigOptions} options - Configuration options for Vitest
   * @returns {VitestConfigOptions): string} Integration test configuration string
   */
  private buildIntegrationTestConfig(options: VitestConfigOptions): string {
    const testEnvironment = this.getTestEnvironment(options.targetEnvironment);
    return buildIntegrationTestConfig(testEnvironment);
  }

  /**
   * Build browser test configuration for workspace
   * @returns {boolean} not applicable
   */
  private buildBrowserTestConfig(): string {
    return buildBrowserTestConfig();
  }

  /**
   * Build setup file content
   * @param {VitestConfigOptions} options - Configuration options for Vitest setup
   * @returns {VitestConfigOptions): string} Generated setup file content
   */
  private buildSetupFileContent(options: VitestConfigOptions): string {
    const baseSetup = this.buildBaseSetupContent();
    const webSetup = options.projectType === 'web' ? this.buildWebSetupContent() : '';
    const strictSetup = options.qualityLevel === 'strict' ? this.buildStrictSetupContent() : '';

    return `${baseSetup}${webSetup}${strictSetup}`;
  }

  /**
   * Build base setup content for all projects
   * @returns {string} Base setup content
   */
  private buildBaseSetupContent(): string {
    const header = buildSetupHeader();
    const customMatchers = buildCustomMatchers();
    const globalHooks = buildGlobalHooks();

    return `${header}${customMatchers}${globalHooks}

`;
  }

  /**
   * Build web-specific setup content
   * @returns {string} Web setup content
   */
  private buildWebSetupContent(): string {
    return buildWebSetupContent();
  }

  /**
   * Build strict quality setup content
   * @returns {string} Strict quality setup content
   */
  private buildStrictSetupContent(): string {
    return buildStrictSetupContent();
  }

  /**
   * Get test environment based on target environment
   * @param {string} targetEnvironment - Target environment type
   * @returns {string): string} Test environment string
   */
  private getTestEnvironment(targetEnvironment: string): string {
    switch (targetEnvironment) {
      case 'browser':
        return 'jsdom';
      case 'node':
        return 'node';
      case 'both':
        return 'node'; // Default to node for both
      default:
        return 'node';
    }
  }

  /**
   * Get coverage configuration
   * @param {VitestConfigOptions} options - Configuration options for Vitest
   * @returns {VitestConfigOptions): string} Coverage configuration string
   */
  private getCoverageConfig(options: VitestConfigOptions): string {
    if (!options.enableCoverage) {
      return 'enabled: false,';
    }

    const threshold = options.coverageThreshold;
    return `thresholds: {
        global: {
          branches: ${threshold},
          functions: ${threshold},
          lines: ${threshold},
          statements: ${threshold}
        }
      },`;
  }

  /**
   * Get test match patterns based on project type
   * @param {string} projectType - Project type identifier
   * @returns {string): string} Test match patterns string
   */
  private getTestMatchPatterns(projectType: string): string {
    switch (projectType) {
      case 'web':
        return `testMatch: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)'
    ],`;
      case 'cli':
        return `testMatch: [
      'tests/**/*.test.ts',
      'src/**/*.test.ts'
    ],`;
      case 'library':
        return `testMatch: [
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'tests/**/*.test.ts'
    ],`;
      default:
        return `testMatch: [
      '**/*.test.ts',
      '**/*.spec.ts'
    ],`;
    }
  }

  /**
   * Get reporter configuration based on quality level
   * @param {string} qualityLevel - Quality level identifier
   * @returns {string): string} Reporter configuration string
   */
  private getReporterConfig(qualityLevel: string): string {
    switch (qualityLevel) {
      case 'light':
        return `reporter: ['basic'],`;
      case 'medium':
        return `reporter: ['verbose', 'json'],`;
      case 'strict':
        return `reporter: ['verbose', 'json', 'html'],`;
      default:
        return `reporter: ['default'],`;
    }
  }

  /**
   * Get timeout configuration based on quality level
   * @param {string} qualityLevel - Quality level identifier
   * @returns {string): string} Timeout configuration string
   */
  private getTimeoutConfig(qualityLevel: string): string {
    switch (qualityLevel) {
      case 'light':
        return `testTimeout: 5000,`;
      case 'medium':
        return `testTimeout: 3000,`;
      case 'strict':
        return `testTimeout: 2000,`;
      default:
        return `testTimeout: 5000,`;
    }
  }

  /**
   * Get coverage threshold based on quality level
   * @param {string} qualityLevel - Quality level identifier
   * @returns {string): number} Coverage threshold percentage
   */
  private getCoverageThreshold(qualityLevel: string): number {
    switch (qualityLevel) {
      case 'light':
        return COVERAGE_LEVELS.LIGHT_THRESHOLD;
      case 'medium':
        return COVERAGE_LEVELS.MEDIUM_THRESHOLD;
      case 'strict':
        return COVERAGE_LEVELS.STRICT_THRESHOLD;
      default:
        return COVERAGE_LEVELS.DEFAULT_STRICT;
    }
  }

  /**
   * Get target environment based on project type
   * @param {string} projectType - Project type identifier
   * @returns {string): 'node' | 'browser' | 'both'} Target environment string
   */
  private getTargetEnvironment(projectType: string): 'node' | 'browser' | 'both' {
    switch (projectType) {
      case 'web':
        return 'browser';
      case 'cli':
        return 'node';
      case 'library':
        return 'both';
      default:
        return 'node';
    }
  }
}

/**
 * Create a Vitest generator instance
 * @returns {VitestGenerator} VitestGenerator instance
 */
export function createVitestGenerator(): VitestGenerator {
  return new VitestGenerator();
}
