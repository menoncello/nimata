/**
 * Directory Structure Generator Test Factories
 *
 * Factory functions for creating test data following the data-factory pattern
 * from the knowledge base. These factories create realistic directory
 * structure configurations for testing the directory structure generator functionality.
 */

import { faker } from '@faker-js/faker';

// Extend the existing ProjectConfig interface with directory structure specific fields
export interface DirectoryStructureConfig {
  name: string;
  description?: string;
  author?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
  template?: string;
  targetDirectory?: string;
  nonInteractive?: boolean;

  // Directory structure specific options
  includeTests?: boolean;
  includeDocs?: boolean;
  includeBin?: boolean;
  includePublic?: boolean;
  includeNimata?: boolean;
  includeGitkeep?: boolean;
  customDirectories?: string[];
  customFiles?: Record<string, string>;
}

// Directory item interface matching the DirectoryStructureGenerator output
export interface DirectoryItem {
  path: string;
  type: 'directory' | 'file';
  content?: string;
  mode?: number;
  permissions?: string;
}

/**
 * Create a directory structure configuration with default values
 */
export const createDirectoryStructureConfig = (
  overrides: Partial<DirectoryStructureConfig> = {}
): DirectoryStructureConfig => ({
  name: faker.string.alphanumeric({ length: { min: 3, max: 10 } }).toLowerCase(),
  description: faker.lorem.sentence(),
  author: faker.person.fullName(),
  license: 'MIT',
  qualityLevel: 'strict',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
  template: undefined,
  targetDirectory: undefined,
  nonInteractive: false,

  // Directory structure defaults
  includeTests: true,
  includeDocs: true,
  includeBin: true,
  includePublic: false,
  includeNimata: true,
  includeGitkeep: true,
  customDirectories: [],
  customFiles: {},
  ...overrides,
});

/**
 * Factory functions for different project types
 */
export const createBasicDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    projectType: 'basic',
    qualityLevel: 'strict',
    includeBin: false,
    includePublic: false,
  });

export const createWebDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    projectType: 'web',
    qualityLevel: 'strict',
    includePublic: true,
    includeBin: false,
  });

export const createCliDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    projectType: 'cli',
    qualityLevel: 'strict',
    includeBin: true,
    includePublic: false,
  });

export const createLibraryDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    projectType: 'library',
    qualityLevel: 'strict',
    includeBin: false,
    includePublic: false,
  });

/**
 * Factory functions for different quality levels
 */
export const createLightQualityDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    qualityLevel: 'light',
    includeTests: true,
    includeDocs: true,
    includeNimata: true,
  });

export const createMediumQualityDirectoryConfig = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    qualityLevel: 'medium',
    includeTests: true,
    includeDocs: true,
    includeNimata: true,
  });

/**
 * Factory functions for specific test scenarios
 */
export const createDirectoryConfigWithoutTests = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    includeTests: false,
    includeDocs: true,
    includeNimata: true,
  });

export const createDirectoryConfigWithoutDocs = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    includeTests: true,
    includeDocs: false,
    includeNimata: true,
  });

export const createDirectoryConfigWithCustomStructure = (): DirectoryStructureConfig =>
  createDirectoryStructureConfig({
    customDirectories: ['src/components', 'src/hooks', 'src/utils', 'src/types'],
    customFiles: {
      'src/custom.ts': '// Custom generated file\nexport const CUSTOM_CONSTANT = true;',
      'config.json': '{ "custom": "configuration" }',
    },
  });

/**
 * Create multiple directory structure configurations
 */
export const createDirectoryStructureConfigs = (count: number): DirectoryStructureConfig[] =>
  Array.from({ length: count }, () => createDirectoryStructureConfig());

/**
 * Create directory structure configurations with specific AI assistants
 */
export const createDirectoryConfigWithAI = (
  aiAssistants: Array<'claude-code' | 'copilot'>
): DirectoryStructureConfig => createDirectoryStructureConfig({ aiAssistants });

/**
 * Create directory structure configurations with specific quality level
 */
export const createDirectoryConfigWithQuality = (
  qualityLevel: 'light' | 'medium' | 'strict'
): DirectoryStructureConfig => createDirectoryStructureConfig({ qualityLevel });

/**
 * Create directory structure configurations with specific project type
 */
export const createDirectoryConfigWithType = (
  projectType: 'basic' | 'web' | 'cli' | 'library'
): DirectoryStructureConfig => createDirectoryStructureConfig({ projectType });

/**
 * Create test directory items for mocking directory structure output
 */
export const createTestDirectoryItems = (config: DirectoryStructureConfig): DirectoryItem[] => {
  const items: DirectoryItem[] = [];

  // Basic directories
  items.push({ path: 'src', type: 'directory' });

  if (config.includeTests) {
    items.push(
      { path: 'tests', type: 'directory' },
      { path: 'tests/unit', type: 'directory' },
      { path: 'tests/integration', type: 'directory' },
      { path: 'tests/e2e', type: 'directory' }
    );
  }

  if (config.includeDocs) {
    items.push({ path: 'docs', type: 'directory' });
  }

  if (config.includeBin) {
    items.push({ path: 'bin', type: 'directory' });
  }

  if (config.includePublic) {
    items.push({ path: 'public', type: 'directory' });
  }

  if (config.includeNimata) {
    items.push(
      { path: '.nimata', type: 'directory' },
      { path: '.nimata/cache', type: 'directory' }
    );
  }

  // Custom directories
  config.customDirectories?.forEach((dir) => {
    items.push({ path: dir, type: 'directory' });
  });

  // Add .gitkeep files to empty directories
  if (config.includeGitkeep) {
    const potentiallyEmptyDirs = [
      'bin',
      'docs',
      'docs/examples',
      'tests/fixtures',
      'tests/fixtures/data',
      '.nimata/cache',
      config.includePublic ? 'public' : null,
    ].filter(Boolean);

    potentiallyEmptyDirs.forEach((dir) => {
      if (dir) {
        items.push({
          path: `${dir}/.gitkeep`,
          type: 'file',
          content: '',
        });
      }
    });
  }

  // Custom files
  Object.entries(config.customFiles).forEach(([path, content]) => {
    items.push({
      path,
      type: 'file',
      content,
    });
  });

  return items;
};

/**
 * Create test configuration file content
 */
export const createTestPackageJson = (config: DirectoryStructureConfig): string => {
  const packageJson = {
    name: config.name,
    version: '0.1.0',
    description: config.description,
    author: config.author,
    license: config.license || 'MIT',
    type: 'module',
    engines: {
      bun: '>=1.3.0',
    },
    scripts: {
      build: 'tsc',
      dev: 'bun --watch src/index.ts',
      test: 'bun test',
      'test:coverage': 'bun test --coverage',
      lint: 'bun run lint',
      'lint:fix': 'bun run lint:fix',
    },
    devDependencies: {
      typescript: '^5.0.0',
      '@types/bun': '^1.3.0',
      eslint: '^9.0.0',
      prettier: '^3.0.0',
    },
  };

  if (config.projectType === 'cli') {
    packageJson.bin = {
      [config.name]: `./bin/${config.name}`,
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      commander: '^12.0.0',
      chalk: '^5.0.0',
    };
  }

  if (config.projectType === 'web') {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      vite: '^5.0.0',
      '@vitejs/plugin-react': '^4.0.0',
      react: '^18.0.0',
      '@types/react': '^18.0.0',
    };
  }

  if (config.projectType === 'library') {
    packageJson.main = './dist/index.js';
    packageJson.module = './dist/index.esm.js';
    packageJson.types = './dist/index.d.ts';
    packageJson.exports = {
      '.': {
        import: './dist/index.esm.js',
        require: './dist/index.js',
        types: './dist/index.d.ts',
      },
    };
  }

  return JSON.stringify(packageJson, null, 2);
};

/**
 * Create test TypeScript configuration
 */
export const createTestTsConfig = (config: DirectoryStructureConfig): string => {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      allowJs: true,
      strict: true,
      noEmit: false,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      verbatimModuleSyntax: false,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', 'tests', '**/*.test.ts', '**/*.spec.ts'],
  };

  return JSON.stringify(tsConfig, null, 2);
};

/**
 * Create test ESLint configuration
 */
export const createTestEslintConfig = (config: DirectoryStructureConfig): string => {
  const eslintConfig = {
    root: true,
    env: {
      node: true,
      es2022: true,
    },
    extends: ['eslint:recommended', '@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'import', 'jsdoc'],
    rules: {
      // Basic rules for all quality levels
      'no-console': config.qualityLevel === 'strict' ? 'error' : 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',

      // Strict quality level adds more rules
      ...(config.qualityLevel === 'strict' && {
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',
      }),
    },
  };

  return `export default ${JSON.stringify(eslintConfig, null, 2)}`;
};
