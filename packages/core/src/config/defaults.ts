import type { Config } from '../types/config';

/**
 * Default Nìmata configuration
 *
 * These values are used when no configuration file is present,
 * or to fill in missing values in partial configurations.
 *
 * Configuration cascade priority:
 * 1. Defaults (lowest priority) - this file
 * 2. Global config (~/.nimata/config.yaml)
 * 3. Project config (.nimatarc) - highest priority
 */
export const DEFAULT_CONFIG: Config = {
  version: 1,
  qualityLevel: 'strict',
  aiAssistants: ['claude-code'],
  tools: {
    eslint: {
      enabled: true,
      configPath: '.eslintrc.json',
    },
    typescript: {
      enabled: true,
      configPath: 'tsconfig.json',
      strict: true,
      target: 'ES2022',
    },
    prettier: {
      enabled: true,
      configPath: '.prettierrc.json',
    },
    bunTest: {
      enabled: true,
      coverage: true,
      coverageThreshold: 80,
    },
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
};
