/**
 * Configuration Files Generators
 *
 * Generates configuration files like package.json, tsconfig.json, etc.
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import type { ProjectConfig } from '../../../types/project-config.js';
import { DirectoryItem, CoreFileOperations } from './core-file-operations.js';

// Constants
const JSON_INDENTATION = 2;

// File name constants
const GITIGNORE_FILE = '.gitignore';
const PACKAGE_JSON_FILE = 'package.json';
const TSCONFIG_JSON_FILE = 'tsconfig.json';

// File permission constants
const DEFAULT_FILE_PERMISSIONS = 0o644;

export interface PackageMetadata {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  license?: string;
  projectType?: string;
}

/**
 * Handles configuration file generation
 */
export class ConfigurationGenerators {
  /**
   * Generate package.json file
   * @param basePath - Base project path
   * @param metadata - Package metadata
   * @throws Error if file creation fails or path validation fails
   */
  static async generatePackageJson(basePath: string, metadata: PackageMetadata): Promise<void> {
    const filePath = join(basePath, PACKAGE_JSON_FILE);
    CoreFileOperations.validatePath(basePath, PACKAGE_JSON_FILE);

    const packageJson = ConfigurationGenerators.createPackageJsonContent(metadata);

    try {
      await fs.writeFile(filePath, JSON.stringify(packageJson, null, JSON_INDENTATION), {
        mode: DEFAULT_FILE_PERMISSIONS,
      });
    } catch (error) {
      throw ConfigurationGenerators.createFileError('package.json', error);
    }
  }

  /**
   * Generate .gitignore file
   * @param basePath - Base project path
   * @param config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  static async generateGitignore(basePath: string, config: ProjectConfig): Promise<void> {
    const filePath = join(basePath, GITIGNORE_FILE);
    CoreFileOperations.validatePath(basePath, GITIGNORE_FILE);

    const content = ConfigurationGenerators.generateGitignoreContent(config);

    try {
      await fs.writeFile(filePath, content, { mode: DEFAULT_FILE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate .gitignore: ${error.message}`);
      }
      throw new Error(`Failed to generate .gitignore: Unknown error`);
    }
  }

  /**
   * Generate TypeScript configuration file
   * @param basePath - Base project path
   * @param config - Project configuration
   * @throws Error if file creation fails or path validation fails
   */
  static async generateTsConfig(basePath: string, config: ProjectConfig): Promise<void> {
    const filePath = join(basePath, TSCONFIG_JSON_FILE);
    CoreFileOperations.validatePath(basePath, TSCONFIG_JSON_FILE);

    const content = ConfigurationGenerators.generateTsConfigContent(config);

    try {
      await fs.writeFile(filePath, content, { mode: DEFAULT_FILE_PERMISSIONS });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate tsconfig.json: ${error.message}`);
      }
      throw new Error(`Failed to generate tsconfig.json: Unknown error`);
    }
  }

  /**
   * Generate configuration files as DirectoryItems
   * @param config - Project configuration
   * @returns Configuration files as DirectoryItems
   */
  static generateConfigurationFiles(config: ProjectConfig): DirectoryItem[] {
    return [
      {
        path: GITIGNORE_FILE,
        type: 'file',
        content: ConfigurationGenerators.generateGitignoreContent(config),
      },
      {
        path: PACKAGE_JSON_FILE,
        type: 'file',
        content: JSON.stringify(
          ConfigurationGenerators.createPackageJsonContent({
            name: config.name,
            description: config.description,
            author: config.author,
            license: config.license,
            projectType: config.projectType,
          }),
          null,
          JSON_INDENTATION
        ),
      },
      {
        path: TSCONFIG_JSON_FILE,
        type: 'file',
        content: ConfigurationGenerators.generateTsConfigContent(config),
      },
      {
        path: 'eslint.config.mjs',
        type: 'file',
        content: ConfigurationGenerators.generateEslintContent(config),
      },
    ];
  }

  /**
   * Generate ESLint configuration content
   * @param config - Project configuration
   * @returns ESLint configuration content
   */
  private static generateEslintContent(config: ProjectConfig): string {
    const isStrict = config.qualityLevel === 'strict';
    const isLight = config.qualityLevel === 'light';

    return `// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint:recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    rules: {
      ${
        isStrict
          ? `
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-const': 'error',
      'prefer-const': 'error',
      'no-var': 'error',`
          : (isLight
            ? `
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',`
            : `
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',`)
      }
    }
  }
);`;
  }

  /**
   * Create package.json content object
   * @param metadata - Package metadata
   * @returns Package.json content object
   */
  static createPackageJsonContent(metadata: PackageMetadata): object {
    const packageJson: any = {
      name: metadata.name || 'new-project',
      version: metadata.version || '1.0.0',
      description: metadata.description || 'A new project',
      main: 'src/index.ts',
      type: 'module',
      scripts: ConfigurationGenerators.createPackageScripts(),
      keywords: metadata.keywords || [],
      author: metadata.author || 'Your Name',
      license: metadata.license || 'MIT',
      dependencies: {},
      devDependencies: ConfigurationGenerators.createPackageDevDependencies(),
      engines: ConfigurationGenerators.createPackageEngines(),
    };

    // Add bin property and CLI dependencies for CLI projects
    if (metadata.projectType === 'cli') {
      packageJson.bin = {
        [metadata.name || 'cli-app']: './bin/cli.js',
      };
      // Add CLI-specific dependencies
      packageJson.dependencies = {
        commander: '^12.0.0',
        chalk: '^5.0.0',
      };
    }

    return packageJson;
  }

  /**
   * Create package.json scripts
   * @returns Package scripts object
   */
  private static createPackageScripts(): object {
    return {
      dev: `bun --watch src/index.ts`,
      build: `bun build src/index.ts --outdir dist --target node`,
      test: 'bun test',
      lint: 'eslint . --ext .ts,.js',
      'lint:fix': 'eslint . --ext .ts,.js --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
    };
  }

  /**
   * Create package.json devDependencies
   * @returns Dev dependencies object
   */
  private static createPackageDevDependencies(): object {
    return {
      '@types/node': '^20.0.0',
      '@types/bun': '^1.0.0',
      '@typescript-eslint/eslint-plugin': '^8.0.0',
      '@typescript-eslint/parser': '^8.0.0',
      'bun-types': '^1.0.0',
      eslint: '^9.0.0',
      prettier: '^3.0.0',
      typescript: '^5.0.0',
      vitest: '^1.0.0',
    };
  }

  /**
   * Create package.json engines
   * @returns Engines object
   */
  private static createPackageEngines(): object {
    return {
      node: '>=18.0.0',
      bun: '>=1.3.0',
    };
  }

  /**
   * Generate .gitignore content
   * @param config - Project configuration
   * @returns .gitignore content
   */
  private static generateGitignoreContent(config: ProjectConfig): string {
    return [
      ConfigurationGenerators.generateDependencyIgnores(),
      ConfigurationGenerators.generateBuildIgnores(),
      ConfigurationGenerators.generateEnvironmentIgnores(),
      ConfigurationGenerators.generateEditorIgnores(),
      ConfigurationGenerators.generateOSIgnores(),
      ConfigurationGenerators.generateLogIgnores(),
      ConfigurationGenerators.generateRuntimeIgnores(),
      ConfigurationGenerators.generateCoverageIgnores(),
      ConfigurationGenerators.generateCacheIgnores(),
      ConfigurationGenerators.generateTempIgnores(),
      ConfigurationGenerators.generateProjectSpecificIgnores(config),
    ].join('\n');
  }

  /**
   * Generate dependency ignore patterns
   * @returns Dependency ignore patterns
   */
  private static generateDependencyIgnores(): string {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun.lockb`;
  }

  /**
   * Generate build output ignore patterns
   * @returns Build output ignore patterns
   */
  private static generateBuildIgnores(): string {
    return `# Build outputs
dist/
build/
*.tsbuildinfo
*.d.ts`;
  }

  /**
   * Generate environment file ignore patterns
   * @returns Environment file ignore patterns
   */
  private static generateEnvironmentIgnores(): string {
    return `# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;
  }

  /**
   * Generate editor file ignore patterns
   * @returns Editor file ignore patterns
   */
  private static generateEditorIgnores(): string {
    return `# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~`;
  }

  /**
   * Generate OS file ignore patterns
   * @returns OS file ignore patterns
   */
  private static generateOSIgnores(): string {
    return `# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  }

  /**
   * Generate log file ignore patterns
   * @returns Log file ignore patterns
   */
  private static generateLogIgnores(): string {
    return `# Logs
logs
*.log`;
  }

  /**
   * Generate runtime data ignore patterns
   * @returns Runtime data ignore patterns
   */
  private static generateRuntimeIgnores(): string {
    return `# Runtime data
pids
*.pid
*.seed
*.pid.lock`;
  }

  /**
   * Generate coverage ignore patterns
   * @returns Coverage ignore patterns
   */
  private static generateCoverageIgnores(): string {
    return `# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output`;
  }

  /**
   * Generate cache ignore patterns
   * @returns Cache ignore patterns
   */
  private static generateCacheIgnores(): string {
    return `# Cache directories
.cache/
.parcel-cache/
.eslintcache`;
  }

  /**
   * Generate temporary folder ignore patterns
   * @returns Temporary folder ignore patterns
   */
  private static generateTempIgnores(): string {
    return `# Temporary folders
tmp/
temp/
*.tmp`;
  }

  /**
   * Generate project-specific ignore patterns
   * @param config - Project configuration
   * @returns Project-specific ignore patterns
   */
  private static generateProjectSpecificIgnores(config: ProjectConfig): string {
    return `# ${config.name} specific
.nimata/cache/
.turbo/`;
  }

  /**
   * Generate TypeScript configuration content
   * @param config - Project configuration
   * @returns TypeScript configuration content
   */
  private static generateTsConfigContent(config: ProjectConfig): string {
    const baseConfig = ConfigurationGenerators.createBaseTsConfig();
    ConfigurationGenerators.applyProjectSpecificConfig(baseConfig, config.projectType);
    return JSON.stringify(baseConfig, null, JSON_INDENTATION);
  }

  /**
   * Create base TypeScript configuration
   * @returns Base TypeScript configuration
   */
  private static createBaseTsConfig(): {
    compilerOptions: Record<string, unknown>;
    include: string[];
    exclude: string[];
  } {
    return {
      compilerOptions: ConfigurationGenerators.createTsCompilerOptions(),
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
    };
  }

  /**
   * Create TypeScript compiler options
   * @returns Compiler options configuration
   */
  private static createTsCompilerOptions(): Record<string, unknown> {
    return {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      strict: true,
      noEmit: true,
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      verbatimModuleSyntax: true,
    };
  }

  /**
   * Apply project-specific TypeScript configuration
   * @param config - Base configuration to modify
   * @param config.compilerOptions - Compiler options to modify
   * @param projectType - Project type
   */
  private static applyProjectSpecificConfig(
    config: { compilerOptions: Record<string, unknown> },
    projectType: string
  ): void {
    if (projectType === 'web') {
      config.compilerOptions.lib = ['ES2022', 'DOM', 'DOM.Iterable'];
      config.compilerOptions.jsx = 'react-jsx';
    } else if (projectType === 'cli') {
      config.compilerOptions.lib = ['ES2022'];
    }
  }

  /**
   * Create a standardized file creation error
   * @param fileName - Name of the file being created
   * @param originalError - Original error that occurred
   * @returns Error with standardized message
   */
  private static createFileError(fileName: string, originalError: unknown): Error {
    if (originalError instanceof Error) {
      return new Error(`Failed to generate ${fileName}: ${originalError.message}`);
    }
    return new Error(`Failed to generate ${fileName}: Unknown error`);
  }
}
