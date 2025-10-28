module.exports = {
  // Stryker Configuration for BMAD Adapters Package
  // CRITICAL: 80%+ mutation score REQUIRED - All adapters must be thoroughly tested

  mutate: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts'
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test --cwd packages/adapters',
    commandType: 'bun'
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'packages/adapters/reports/mutation/html'
  },

  coverageAnalysis: 'perTest',

  thresholds: {
    high: 90,
    low: 80,
    break: 80  // ZERO TOLERANCE: Build will break below 80%
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

  // Adapters-specific mutator exclusions
  mutator: {
    plugins: ['typescript'],
    exclude: [
      // Type definitions only
      '**/*.d.ts'
    ]
  },

  // Adapter mutation patterns
  ignoreStatic: false,
  ignoreConstant: false,

  // Template engine specific settings
  mutatorOptions: {
    typescript: {
      // Template patterns require comprehensive testing
      excludedMutations: []  // NO EXCLUSIONS for adapter code
    }
  }
};