import { faker } from '@faker-js/faker';
import type {
  ProjectConfig,
  ProjectType,
  ProjectQualityLevel,
} from '../../../packages/core/src/types/project-config.js';

/**
 * Extended ProjectConfig interface for testing purposes
 */
export interface TestProjectConfig extends ProjectConfig {
  version?: string;
  generateAiContext?: boolean;
  features?: string[];
}

export interface DirectoryStructure {
  directories: string[];
  files: Record<string, string>;
  permissions: Record<string, number>;
}

/**
 * Factory for creating project configurations
 */
export const createProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig => ({
  name: faker.string.alphanumeric(8).toLowerCase(),
  projectType: 'basic',
  description: faker.lorem.sentence(),
  version: '1.0.0',
  author: faker.person.fullName(),
  license: 'MIT',
  qualityLevel: 'medium',
  aiAssistants: ['claude-code'],
  generateAiContext: true,
  features: [],
  ...overrides,
});

/**
 * Factory for creating CLI project configurations
 */
export const createCliProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    projectType: 'cli',
    description: `${faker.lorem.sentence()} CLI application`,
    features: ['command-line-interface', 'arg-parsing'],
    ...overrides,
  });

/**
 * Factory for creating web project configurations
 */
export const createWebProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    projectType: 'web',
    description: `${faker.lorem.sentence()} web application`,
    features: ['frontend', 'static-assets'],
    ...overrides,
  });

/**
 * Factory for creating library project configurations
 */
export const createLibraryProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    projectType: 'library',
    description: `${faker.lorem.sentence()} library`,
    license: 'Apache-2.0',
    features: ['npm-package', 'api'],
    ...overrides,
  });

/**
 * Factory for creating high-quality project configurations
 */
export const createHighQualityProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    qualityLevel: 'high',
    description: `${faker.lorem.sentence()} with comprehensive testing and quality gates`,
    features: ['mutation-testing', 'performance-tests', 'security-audits'],
    ...overrides,
  });

/**
 * Factory for creating light quality project configurations
 */
export const createLightQualityProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    qualityLevel: 'light',
    description: `${faker.lorem.sentence()} light setup`,
    features: [],
    ...overrides,
  });

/**
 * Factory for creating strict quality project configurations
 */
export const createStrictQualityProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    qualityLevel: 'strict',
    description: `${faker.lorem.sentence()} strict quality setup`,
    features: ['type-checking', 'comprehensive-tests'],
    ...overrides,
  });

/**
 * Factory for creating project configurations with specific features
 */
export const createProjectConfigWithFeatures = (
  features: string[],
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig =>
  createProjectConfig({
    features,
    ...overrides,
  });

/**
 * Factory for creating invalid project configurations (for error testing)
 */
export const createInvalidProjectConfig = (
  overrides: Partial<TestProjectConfig> = {}
): Partial<TestProjectConfig> => ({
  name: '', // Invalid empty name
  projectType: 'invalid' as ProjectType, // Invalid type
  version: '', // Invalid version
  qualityLevel: 'invalid' as ProjectQualityLevel, // Invalid quality
  ...overrides,
});

/**
 * Factory for creating edge case project configurations
 */
export const createEdgeCaseProjectConfig = (
  scenario: 'long-name' | 'special-chars' | 'unicode'
): TestProjectConfig => {
  const base = createProjectConfig();

  switch (scenario) {
    case 'long-name':
      return {
        ...base,
        name: faker.string.alphanumeric(100).toLowerCase(),
        description: faker.lorem.words(50),
      };

    case 'special-chars':
      return {
        ...base,
        name: faker.helpers.arrayElement([
          'test-project-with-dashes',
          'test_project_with_underscores',
          'test.project.with.dots',
        ]),
        description: `${faker.lorem.sentence()} with special-chars!`,
      };

    case 'unicode':
      return {
        ...base,
        name: `${faker.lorem.word()}-项目`,
        description: `${faker.lorem.sentence()} with émojis 🚀 and ñiño`,
        author: `${faker.person.fullName()} Müller`,
      };

    default:
      return base;
  }
};

/**
 * Factory for creating directory structure templates
 */
export const createDirectoryStructureTemplate = (projectType: ProjectType): DirectoryStructure => {
  const baseStructure: DirectoryStructure = {
    directories: [
      'src',
      'tests',
      'tests/unit',
      'tests/integration',
      'tests/e2e',
      'tests/fixtures',
      'docs',
      '.nimata',
      '.nimata/cache',
      '.nimata/config',
    ],
    files: {
      'src/index.ts': '// Main entry point\n',
      'tests/setup.ts': '// Test setup file\n',
      'tests/unit/example.test.ts': '// Example unit test\n',
      '.gitignore': '# Generated gitignore\nnode_modules/\ndist/\n.nimata/cache/\n',
      'README.md': `# Project Name\n\nGenerated by Nìmata\n`,
    },
    permissions: {
      src: 0o755,
      tests: 0o755,
      docs: 0o755,
      '.nimata': 0o755,
    },
  };

  switch (projectType) {
    case 'cli':
      return {
        ...baseStructure,
        directories: [...baseStructure.directories, 'bin', 'src/cli'],
        files: {
          ...baseStructure.files,
          'bin/cli-executable': '#!/usr/bin/env bun\nconsole.log("CLI executable");\n',
          'src/cli/commands.ts': '// CLI command implementations\n',
        },
        permissions: {
          ...baseStructure.permissions,
          bin: 0o755,
          'bin/cli-executable': 0o755,
        },
      };

    case 'web':
      return {
        ...baseStructure,
        directories: [...baseStructure.directories, 'public', 'src/components', 'src/styles'],
        files: {
          ...baseStructure.files,
          'public/index.html':
            '<!DOCTYPE html>\n<html><head><title>Web App</title></head><body></body></html>\n',
          'src/components/App.tsx': '// Main React component\n',
          'src/styles/main.css': '/* Main styles */\n',
        },
      };

    case 'library':
      return {
        ...baseStructure,
        directories: [...baseStructure.directories, 'dist', 'src/types'],
        files: {
          ...baseStructure.files,
          'src/types/index.ts': '// Library type definitions\n',
          'dist/.gitkeep': '',
        },
      };

    default:
      return baseStructure;
  }
};

/**
 * Create multiple project configurations for bulk testing
 */
export const createMultipleProjectConfigs = (
  count: number,
  overrides: Partial<TestProjectConfig> = {}
): TestProjectConfig[] =>
  Array.from({ length: count }, (_, index) =>
    createProjectConfig({
      ...overrides,
      name: `${faker.string.alphanumeric(8).toLowerCase()}-${index}`,
    })
  );

/**
 * Create project configurations covering all project types
 */
export const createAllProjectTypesConfig = (): Record<ProjectType, TestProjectConfig> => ({
  basic: createProjectConfig({ projectType: 'basic' }),
  web: createWebProjectConfig(),
  cli: createCliProjectConfig(),
  library: createLibraryProjectConfig(),
  'bun-react': createProjectConfig({ projectType: 'bun-react' }),
  'bun-vue': createProjectConfig({ projectType: 'bun-vue' }),
  'bun-express': createProjectConfig({ projectType: 'bun-express' }),
  'bun-typescript': createProjectConfig({ projectType: 'bun-typescript' }),
});

/**
 * Create project configurations covering all quality levels
 */
export const createAllQualityLevelsConfig = (): Record<ProjectQualityLevel, TestProjectConfig> => ({
  light: createLightQualityProjectConfig(),
  medium: createProjectConfig({ qualityLevel: 'medium' }),
  strict: createStrictQualityProjectConfig(),
  high: createHighQualityProjectConfig(),
});
