module.exports = {
  // Stryker Configuration for BMAD CLI Application
  // CRITICAL: 80%+ mutation score REQUIRED - CLI must be robust

  mutate: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts'
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test --cwd apps/cli',
    commandType: 'bun'
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'apps/cli/reports/mutation/html'
  },

  coverageAnalysis: 'perTest',

  thresholds: {
    high: 90,
    low: 80,
    break: 80  // ZERO TOLERANCE: CLI must exceed 80% mutation score
  },

  // Quality enforcement settings
  maxConcurrentTestRunners: 2,
  timeout: 60000,
  timeoutFactor: 3,

  // Plugin configuration
  plugins: [
    '@stryker-mutator/core',
    '@stryker-mutator/bun-runner',
    '@stryker-mutator/typescript',
    '@stryker-mutator/javascript-mutator'
  ],

  // TypeScript configuration
  tsconfigFile: 'tsconfig.json',

  // CLI-specific mutator exclusions
  mutator: {
    plugins: ['typescript'],
    exclude: [
      // Type definitions only
      '**/*.d.ts'
    ]
  },

  // CLI mutation patterns
  ignoreStatic: false,
  ignoreConstant: false,

  // CLI specific settings - comprehensive error handling mandatory
  mutatorOptions: {
    typescript: {
      // CLI commands require thorough testing
      excludedMutations: []  // NO EXCLUSIONS for CLI code
    }
  }
};