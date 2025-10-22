/**
 * ESLint Configuration Generator
 *
 * Generates ESLint configuration files based on project quality level and requirements
 */

import { getQualityRules } from './eslint-rules.js';
import { getTypeScriptRules } from './eslint-typescript-rules.js';
import {
  getTargetEnvironment,
  getGlobalVariables,
  getTestingRules,
  type ESLintConfigOptions,
} from './eslint-utils.js';

// Constants
const JSON_INDENT = 2;

// Inline type to avoid import issues
interface ProjectConfig {
  name: string;
  description?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
}

export interface GeneratedESLintConfig {
  filename: string;
  content: string;
  description: string;
}

/**
 * ESLint Configuration Generator
 */
export class ESLintGenerator {
  private config: ProjectConfig;

  /**
   * Create ESLint generator
   * @param config - Project configuration
   */
  constructor(config: ProjectConfig) {
    this.config = config;
  }

  /**
   * Generate ESLint configuration for a project
   * @returns Generated ESLint configuration files
   */
  generate(): GeneratedESLintConfig[] {
    const options: ESLintConfigOptions = {
      qualityLevel: this.config.qualityLevel,
      projectType: this.config.projectType,
      targetEnvironment: getTargetEnvironment(this.config.projectType),
      enableTypeScript: true,
      enableTesting: true,
    };

    const configs: GeneratedESLintConfig[] = [
      this.generateMainConfig(options),
      this.generateTypeScriptConfig(options),
      this.generateTestingConfig(options),
      this.generateIgnoreFile(),
    ];

    return configs;
  }

  /**
   * Generate main ESLint configuration
   * @param options - ESLint configuration options
   * @returns Main ESLint configuration
   */
  private generateMainConfig(options: ESLintConfigOptions): GeneratedESLintConfig {
    return {
      filename: 'eslint.config.mjs',
      content: this.buildMainConfigContent(options),
      description: 'Main ESLint configuration',
    };
  }

  /**
   * Generate TypeScript ESLint configuration
   * @param options - ESLint configuration options
   * @returns TypeScript ESLint configuration
   */
  private generateTypeScriptConfig(options: ESLintConfigOptions): GeneratedESLintConfig {
    return {
      filename: 'eslint.typescript.mjs',
      content: this.buildTypeScriptConfigContent(options),
      description: 'TypeScript ESLint configuration',
    };
  }

  /**
   * Generate testing ESLint configuration
   * @param options - ESLint configuration options
   * @returns Testing ESLint configuration
   */
  private generateTestingConfig(options: ESLintConfigOptions): GeneratedESLintConfig {
    return {
      filename: 'eslint.testing.mjs',
      content: this.buildTestingConfigContent(options),
      description: 'Testing ESLint configuration',
    };
  }

  /**
   * Generate .eslintignore file
   * @returns ESLint ignore configuration
   */
  private generateIgnoreFile(): GeneratedESLintConfig {
    const ignorePatterns = [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.config.js',
      '*.min.js',
      '*.bundle.js',
    ];

    return {
      filename: '.eslintignore',
      content: ignorePatterns.join('\n'),
      description: 'ESLint ignore patterns',
    };
  }

  /**
   * Build main ESLint configuration content
   * @param options - ESLint configuration options
   * @returns Configuration content
   */
  private buildMainConfigContent(options: ESLintConfigOptions): string {
    let targetEnvironmentText;
    if (options.targetEnvironment === 'browser') {
      targetEnvironmentText = 'browser';
    } else if (options.targetEnvironment === 'node') {
      targetEnvironmentText = 'node';
    } else {
      targetEnvironmentText = 'both';
    }

    const environmentConfig = this.buildEnvironmentConfig(options.targetEnvironment);

    return `import eslint from '@eslint/js';

/**
 * ESLint Configuration
 * Quality Level: ${options.qualityLevel}
 * Target Environment: ${targetEnvironmentText}
 */

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: ${JSON.stringify(environmentConfig, null, JSON_INDENT)},
    },
    rules: this.buildRulesConfig(options),
  },
];`;
  }

  /**
   * Build environment configuration
   * @param targetEnvironment - Target environment
   * @returns Environment configuration
   */
  private buildEnvironmentConfig(targetEnvironment: string): Record<string, unknown> {
    return {
      es2022: true,
      ...getGlobalVariables(targetEnvironment),
    };
  }

  /**
   * Build extends configuration
   * @param options - ESLint configuration options
   * @returns Extends configuration
   */
  private buildExtendsConfig(options: ESLintConfigOptions): string[] {
    return [
      'eslint:recommended',
      ...(options.enableTypeScript ? ['@typescript-eslint/recommended'] : []),
      ...(options.enableTesting ? ['plugin:testing-library/recommended'] : []),
    ];
  }

  /**
   * Get parser based on TypeScript support
   * @param enableTypeScript - Whether TypeScript is enabled
   * @returns Parser string
   */
  private getParser(enableTypeScript: boolean): string {
    return enableTypeScript ? '@typescript-eslint/parser' : 'espree';
  }

  /**
   * Build plugins configuration
   * @param options - ESLint configuration options
   * @returns Plugins configuration
   */
  private buildPluginsConfig(options: ESLintConfigOptions): string[] {
    return [
      ...(options.enableTypeScript ? ['@typescript-eslint'] : []),
      ...(options.enableTesting ? ['testing-library'] : []),
    ];
  }

  /**
   * Build rules configuration
   * @param options - ESLint configuration options
   * @returns Rules configuration
   */
  private buildRulesConfig(options: ESLintConfigOptions): Record<string, unknown> {
    return {
      ...getQualityRules(options.qualityLevel),
      ...(options.enableTypeScript ? getTypeScriptRules(options.qualityLevel) : {}),
      ...(options.enableTesting ? getTestingRules(options.qualityLevel) : {}),
      ...options.customRules,
    };
  }

  /**
   * Get ignore patterns
   * @returns Ignore patterns array
   */
  private getIgnorePatterns(): string[] {
    return ['node_modules/', 'dist/', 'build/', 'coverage/'];
  }

  /**
   * Build TypeScript ESLint configuration content
   * @param options - ESLint configuration options
   * @returns Configuration content
   */
  private buildTypeScriptConfigContent(options: ESLintConfigOptions): string {
    const projectTypeText = this.getProjectTypeText(options.projectType);
    const libraryRules = this.getLibraryRules(options.projectType);
    const typeScriptRules = this.buildTypeScriptRules(options);

    return `import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

/**
 * TypeScript ESLint Configuration
 * Quality Level: ${options.qualityLevel}
 * Project Type: ${projectTypeText}
 */

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
${typeScriptRules}${libraryRules}
    },
  },
];`;
  }

  /**
   * Get project type text for configuration
   * @param projectType - Project type
   * @returns Project type description
   */
  private getProjectTypeText(projectType: string): string {
    if (projectType === 'web') {
      return 'Web Application';
    }
    if (projectType === 'cli') {
      return 'CLI Application';
    }
    if (projectType === 'library') {
      return 'Library Package';
    }
    return 'Basic Application';
  }

  /**
   * Get library-specific rules
   * @param projectType - Project type
   * @returns Library rules string
   */
  private getLibraryRules(projectType: string): string {
    if (projectType === 'library') {
      return '\n    // Library-specific rules\n    "no-console": "warn",';
    }
    return '';
  }

  /**
   * Build TypeScript rules configuration
   * @param options - ESLint configuration options
   * @returns TypeScript rules string
   */
  private buildTypeScriptRules(options: ESLintConfigOptions): string {
    const rules: string[] = [];

    this.addUnusedVarsRule(rules, options.qualityLevel);
    this.addExplicitAnyRule(rules, options.qualityLevel);
    this.addReturnTypeRules(rules, options.qualityLevel);
    this.addStrictRules(rules, options.qualityLevel);
    this.addOptionalChainRules(rules, options.qualityLevel);
    this.addFloatingPromisesRule(rules, options.qualityLevel);

    return rules.join(',\n      ');
  }

  /**
   * Add unused variables rule
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addUnusedVarsRule(rules: string[], qualityLevel: string): void {
    const unusedVarsLevel = qualityLevel === 'light' ? 'warn' : 'error';
    rules.push(`"@typescript-eslint/no-unused-vars": "${unusedVarsLevel}"`);
  }

  /**
   * Add explicit any rule
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addExplicitAnyRule(rules: string[], qualityLevel: string): void {
    let anyLevel;
    if (qualityLevel === 'light') {
      anyLevel = 'off';
    } else if (qualityLevel === 'medium') {
      anyLevel = 'warn';
    } else {
      anyLevel = 'error';
    }
    rules.push(`"@typescript-eslint/no-explicit-any": "${anyLevel}"`);
  }

  /**
   * Add return type rules
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addReturnTypeRules(rules: string[], qualityLevel: string): void {
    if (qualityLevel === 'strict') {
      rules.push(`"@typescript-eslint/explicit-function-return-type": "error"`);
      rules.push(`"@typescript-eslint/explicit-module-boundary-types": "error"`);
    } else {
      rules.push(`"@typescript-eslint/explicit-function-return-type": "off"`);
      rules.push(`"@typescript-eslint/explicit-module-boundary-types": "off"`);
    }
  }

  /**
   * Add strict rules
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addStrictRules(rules: string[], qualityLevel: string): void {
    const nonNullLevel = qualityLevel === 'strict' ? 'error' : 'off';
    rules.push(`"@typescript-eslint/no-non-null-assertion": "${nonNullLevel}"`);
  }

  /**
   * Add optional chaining rules
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addOptionalChainRules(rules: string[], qualityLevel: string): void {
    if (qualityLevel === 'medium' || qualityLevel === 'strict') {
      rules.push(`"@typescript-eslint/prefer-nullish-coalescing": "error"`);
      rules.push(`"@typescript-eslint/prefer-optional-chain": "error"`);
    }
  }

  /**
   * Add floating promises rule
   * @param rules - Rules array to modify
   * @param qualityLevel - Quality level
   */
  private addFloatingPromisesRule(rules: string[], qualityLevel: string): void {
    const floatingPromisesLevel = qualityLevel === 'strict' ? 'error' : 'off';
    rules.push(`"@typescript-eslint/no-floating-promises": "${floatingPromisesLevel}"`);
  }

  /**
   * Build testing ESLint configuration content
   * @param options - ESLint configuration options
   * @returns Configuration content
   */
  private buildTestingConfigContent(options: ESLintConfigOptions): string {
    const testingGlobals = this.getTestingGlobals();
    const testingFiles = this.getTestingFiles();

    return `/**
 * Testing ESLint Configuration
 * Quality Level: ${options.qualityLevel}
 */

module.exports = {
  files: ${JSON.stringify(testingFiles)},
  env: {
    jest: true,
    es2022: true,
  },
  globals: ${JSON.stringify(testingGlobals, null, JSON_INDENT)},
  extends: [
    'eslint:recommended',
    'plugin:testing-library/recommended',
  ],
  rules: {
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
};`;
  }

  /**
   * Get testing file patterns
   * @returns Testing file patterns array
   */
  private getTestingFiles(): string[] {
    return ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'];
  }

  /**
   * Get testing globals configuration
   * @returns Testing globals object
   */
  private getTestingGlobals(): Record<string, string> {
    return {
      describe: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      it: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
    };
  }
}

/**
 * Factory function to create ESLint generator instance
 * @param config - Project configuration
 * @returns ESLint generator instance
 */
export function createESLintGenerator(config?: ProjectConfig): ESLintGenerator {
  const defaultConfig: ProjectConfig = {
    name: 'default-project',
    description: 'Default project',
    qualityLevel: 'medium',
    projectType: 'basic',
    aiAssistants: ['claude-code'],
  };

  return new ESLintGenerator(config || defaultConfig);
}
