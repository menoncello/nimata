/**
 * Data factories with overrides pattern
 * Generates parallel-safe test data
 */

import { createTestId } from '../helpers';

/**
 * Factory for package.json with overrides
 */
export function createPackageJson(
  overrides: Partial<{
    name: string;
    version: string;
    type: 'module' | 'commonjs';
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  }> = {}
): Record<string, unknown> {
  return {
    name: overrides.name ?? createTestId('project'),
    version: overrides.version ?? '0.1.0',
    type: overrides.type ?? 'module',
    scripts: overrides.scripts ?? {},
    dependencies: overrides.dependencies ?? {},
    devDependencies: overrides.devDependencies ?? {},
  };
}

/**
 * Factory for tsconfig.json with overrides
 */
export function createTsConfig(
  overrides: Partial<{
    target: string;
    module: string;
    strict: boolean;
    compilerOptions: Record<string, unknown>;
  }> = {}
): Record<string, unknown> {
  const defaultCompilerOptions = {
    target: overrides.target ?? 'ES2022',
    module: overrides.module ?? 'ESNext',
    moduleResolution: 'bundler',
    strict: overrides.strict ?? true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  };

  return {
    compilerOptions: {
      ...defaultCompilerOptions,
      ...overrides.compilerOptions,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * Factory for CLI validation result
 */
export function createValidationResult(
  overrides: Partial<{
    passed: boolean;
    errors: string[];
    warnings: string[];
    duration: number;
    tool: string;
  }> = {}
): {
  passed: boolean;
  errors: string[];
  warnings: string[];
  duration: number;
  tool: string;
} {
  return {
    passed: overrides.passed ?? true,
    errors: overrides.errors ?? [],
    warnings: overrides.warnings ?? [],
    duration: overrides.duration ?? crypto.getRandomValues(new Uint32Array(1))[0] % 1000,
    tool: overrides.tool ?? 'eslint',
  };
}

/**
 * Factory for file metadata
 */
export function createFileMetadata(
  overrides: Partial<{
    path: string;
    hash: string;
    size: number;
    modified: Date;
  }> = {}
): {
  path: string;
  hash: string;
  size: number;
  modified: Date;
} {
  return {
    path: overrides.path ?? `src/${createTestId('file')}.ts`,
    hash: overrides.hash ?? createTestId('hash'),
    size: overrides.size ?? crypto.getRandomValues(new Uint32Array(1))[0] % 10_000,
    modified: overrides.modified ?? new Date(),
  };
}

/**
 * Factory for CLI command arguments
 */
export function createCliArgs(
  command: string,
  options: Record<string, string | boolean> = {}
): string[] {
  const args = [command];

  for (const [key, value] of Object.entries(options)) {
    if (typeof value === 'boolean') {
      if (value) args.push(`--${key}`);
    } else {
      args.push(`--${key}`, value);
    }
  }

  return args;
}

/**
 * Factory for TypeScript source code with configurable issues
 */
export function createSourceFile(
  overrides: Partial<{
    hasUnusedVariable: boolean;
    hasMutableVariable: boolean;
    hasAnyType: boolean;
    complexity: number;
  }> = {}
): string {
  const parts: string[] = [];

  if (overrides.hasAnyType) {
    parts.push('export function process(data: any): any {');
  } else {
    parts.push('export function process(data: string): string {');
  }

  if (overrides.hasUnusedVariable) {
    parts.push('  const unused = "never used";');
  }

  if (overrides.hasMutableVariable) {
    parts.push('  let config = { value: 42 };');
  } else {
    parts.push('  const config = { value: 42 } as const;');
  }

  // Add complexity
  const complexity = overrides.complexity ?? 1;
  for (let i = 0; i < complexity; i++) {
    parts.push(`  if (data.length > ${i}) {`);
    parts.push(`    return data.slice(${i});`);
    parts.push('  }');
  }

  parts.push('  return data;');
  parts.push('}');

  return parts.join('\n');
}

/**
 * Factory for test file content
 */
export function createTestFile(
  overrides: Partial<{
    importPath: string;
    functionName: string;
    testCount: number;
  }> = {}
): string {
  const importPath = overrides.importPath ?? './module';
  const functionName = overrides.functionName ?? 'process';
  const testCount = overrides.testCount ?? 1;

  const lines: string[] = [
    "import { describe, expect, test } from 'bun:test';",
    `import { ${functionName} } from '${importPath}';`,
    '',
    `describe('${functionName}', () => {`,
  ];

  for (let i = 0; i < testCount; i++) {
    lines.push(`  test('test case ${i + 1}', () => {`);
    lines.push(`    expect(${functionName}('input')).toBeDefined();`);
    lines.push('  });');
    lines.push('');
  }

  lines.push('});');

  return lines.join('\n');
}
