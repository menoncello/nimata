module.exports = {
  // Stryker Configuration for BMAD Core Package
  // CRITICAL: 85%+ mutation score REQUIRED - Core components MUST have highest quality

  mutate: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts'
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test --cwd packages/core',
    commandType: 'bun'
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'packages/core/reports/mutation/html'
  },

  coverageAnalysis: 'perTest',

  // Core package requires HIGHER thresholds
  thresholds: {
    high: 95,
    low: 85,
    break: 85  // ZERO TOLERANCE: Core must exceed 85% mutation score
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

  // Core-specific mutator exclusions
  mutator: {
    plugins: ['typescript'],
    exclude: [
      // Type definitions only
      '**/*.d.ts'
    ]
  },

  // Core mutation patterns - comprehensive coverage mandatory
  ignoreStatic: false,
  ignoreConstant: false,

  // Additional mutation operators for comprehensive testing
  mutatorOptions: {
    typescript: {
      excludedMutations: []  // NO EXCLUSIONS - Core must handle all edge cases
    }
  }
};