// Prettier configuration for test-strict

export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: [],
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
  ],
};