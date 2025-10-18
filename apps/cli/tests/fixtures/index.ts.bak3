/**
 * Test fixtures for unit and integration tests
 * Pure functions that return test data
 */

/**
 * Sample package.json configurations
 */
export const packageJsonFixtures = {
  minimal: {
    name: 'test-project',
    version: '0.1.0',
    type: 'module' as const,
  },

  withScripts: {
    name: 'test-project',
    version: '0.1.0',
    type: 'module' as const,
    scripts: {
      build: 'tsc',
      test: 'bun test',
      lint: 'eslint .',
    },
  },

  withDependencies: {
    name: 'test-project',
    version: '0.1.0',
    type: 'module' as const,
    dependencies: {
      yargs: '^17.7.2',
    },
    devDependencies: {
      typescript: '^5.3.3',
      '@types/node': '^24.8.0',
    },
  },
};

/**
 * Sample tsconfig.json configurations
 */
export const tsconfigFixtures = {
  minimal: {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
    },
  },

  strict: {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      noImplicitAny: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
    },
  },

  withPaths: {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
      },
    },
  },
};

/**
 * Sample TypeScript source files
 */
export const sourceFixtures = {
  simpleFunction: `export function add(a: number, b: number): number {
  return a + b;
}`,

  classWithMethods: `export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}`,

  asyncFunction: `export async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}`,

  withUnusedVariable: `export function process(data: string): string {
  const unused = 'never used';
  return data.toUpperCase();
}`,

  needsReadonly: `export function getConfig() {
  const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
  };
  return config;
}`,
};

/**
 * Sample test files
 */
export const testFixtures = {
  basic: `import { expect, test } from 'bun:test';
import { add } from './calculator';

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});`,

  withDescribe: `import { describe, expect, test } from 'bun:test';
import { Calculator } from './calculator';

describe('Calculator', () => {
  test('adds two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });

  test('subtracts two numbers', () => {
    const calc = new Calculator();
    expect(calc.subtract(5, 3)).toBe(2);
  });
});`,
};

/**
 * Sample CLI output messages
 */
export const outputFixtures = {
  success: '✓ All checks passed',
  failure: '✗ Validation failed',
  warning: '⚠ Warning: potential issues detected',
  info: 'ℹ Running validation...',
};
