/**
 * Test Data Factories
 *
 * Provides factory functions for creating test data with realistic defaults.
 * Eliminates hardcoded test data and reduces maintenance overhead.
 */

/**
 * Creates a configuration object with optional overrides
 */
export function createConfigObject(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    qualityLevel: 'strict',
    aiAssistants: ['claude-code'],
    tools: {
      eslint: { enabled: true, configPath: '.eslintrc.json' },
      typescript: { enabled: true, strict: true, target: 'ES2022' },
      prettier: { enabled: true, configPath: '.prettierrc.json' },
      bunTest: { enabled: true, coverage: true, coverageThreshold: 80 },
    },
    scaffolding: {
      templateDirectory: 'templates',
      includeExamples: true,
      initializeGit: true,
      installDependencies: true,
    },
    validation: {
      cache: true,
      parallel: true,
    },
    refactoring: {
      preview: true,
    },
    logging: {
      level: 'info',
      destination: '~/.nimata/logs/nimata.log',
    },
    ...overrides,
  };
}

/**
 * Creates a tools configuration object
 */
export function createToolsConfig(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    eslint: { enabled: true, configPath: '.eslintrc.json' },
    typescript: { enabled: true, strict: true, target: 'ES2022' },
    prettier: { enabled: true, configPath: '.prettierrc.json' },
    bunTest: { enabled: true, coverage: true, coverageThreshold: 80 },
    ...overrides,
  };
}

/**
 * Creates a simple object for deep merge testing
 */
export function createSimpleObject(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    ...overrides,
  };
}

/**
 * Creates a nested object for deep merge testing
 */
export function createNestedObject(
  depth = 3,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  let current = result;
  for (let i = 1; i < depth; i++) {
    current[`level${i}`] = {};
    current = current[`level${i}`] as Record<string, unknown>;
  }

  // Add final level with test data
  current[`level${depth}`] = { value: 'base', keep: true };

  return { ...result, ...overrides };
}

/**
 * Creates an array for testing array replacement behavior
 */
export function createArray(length = 3, prefix = 'item'): string[] {
  return Array.from({ length }, (_, i) => `${prefix}${i + 1}`);
}

/**
 * Creates a project configuration for testing
 */
export function createProjectConfig(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    qualityLevel: 'strict',
    tools: {
      eslint: { enabled: true, configPath: '.eslintrc.json' },
      typescript: { enabled: true, strict: true },
    },
    ...overrides,
  };
}

/**
 * Creates a global configuration for testing
 */
export function createGlobalConfig(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    qualityLevel: 'medium',
    aiAssistants: ['copilot'],
    logging: { level: 'debug' },
    ...overrides,
  };
}

/**
 * Creates a default configuration for testing
 */
export function createDefaultConfig(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    qualityLevel: 'strict',
    tools: {
      eslint: { enabled: true, configPath: '.eslintrc.json' },
      typescript: { enabled: true, strict: true },
    },
    logging: { level: 'info' },
    ...overrides,
  };
}
