module.exports = {
  // Stryker Configuration for BMAD Template Engine Project
  // CRITICAL: 80%+ mutation score REQUIRED - NO EXCEPTIONS

  mutate: [
    'packages/**/*.js',
    'packages/**/*.ts',
    'apps/**/*.js',
    'apps/**/*.ts',
    '!**/*.test.js',
    '!**/*.test.ts',
    '!**/*.spec.js',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/stryker-tmp/**'
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'bun test',
    commandType: 'bun'
  },

  reporters: ['progress', 'html', 'clear-text'],

  htmlReporter: {
    baseDir: 'reports/mutation/html'
  },

  coverageAnalysis: 'perTest',

  thresholds: {
    high: 90,
    low: 80,
    break: 80  // ZERO TOLERANCE: Build will break below 80%
  },

  // Quality enforcement settings
  maxConcurrentTestRunners: 4,
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

  // Mutator exclusions - NEVER disable these for convenience
  mutator: {
    plugins: ['typescript', 'javascript'],
    exclude: [
      // Logging statements have no behavioral impact
      '**/logger.ts',
      '**/*.log.ts'
    ]
  },

  // Mandatory mutation patterns
  ignoreStatic: false,
  ignoreConstant: false
};