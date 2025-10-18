import { join } from 'path';
import { writeFile } from '../helpers/file-assertions';

/**
 * Test Project Factories
 *
 * Factory functions for creating test project structures.
 * Follows data factory pattern with overrides.
 */

export interface ProjectOptions {
  /** Project name (default: 'test-project') */
  name?: string;
  /** Project version (default: '1.0.0') */
  version?: string;
  /** Include TypeScript config (default: true) */
  includeTypeScript?: boolean;
  /** Include ESLint config (default: true) */
  includeESLint?: boolean;
  /** Include Prettier config (default: true) */
  includePrettier?: boolean;
  /** Additional package.json fields */
  packageJsonOverrides?: Record<string, unknown>;
}

/**
 * Create minimal package.json in temp directory
 *
 * @example
 * const tempDir = await createTempDirectory();
 * await createPackageJson(tempDir, { name: 'my-test-project' });
 */
export async function createPackageJson(
  targetDir: string,
  options: ProjectOptions = {}
): Promise<void> {
  const { name = 'test-project', version = '1.0.0', packageJsonOverrides = {} } = options;

  const packageJson = {
    name,
    version,
    type: 'module',
    scripts: {
      test: 'bun test',
      lint: 'eslint .',
      format: 'prettier --write .',
    },
    devDependencies: {
      '@types/bun': '^1.3.0',
      typescript: '^5.0.0',
    },
    ...packageJsonOverrides,
  };

  await writeFile(join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));
}

/**
 * Create TypeScript config in temp directory
 *
 * @example
 * await createTypeScriptConfig(tempDir);
 */
export async function createTypeScriptConfig(targetDir: string): Promise<void> {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      types: ['bun-types'],
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await writeFile(join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
}

/**
 * Create ESLint config in temp directory
 *
 * @example
 * await createESLintConfig(tempDir);
 */
export async function createESLintConfig(targetDir: string): Promise<void> {
  const eslintConfig = `
export default [
  {
    files: ['**/*.ts'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
    },
  },
];
`.trim();

  await writeFile(join(targetDir, 'eslint.config.js'), eslintConfig);
}

/**
 * Create Prettier config in temp directory
 *
 * @example
 * await createPrettierConfig(tempDir);
 */
export async function createPrettierConfig(targetDir: string): Promise<void> {
  const prettierConfig = {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 2,
  };

  await writeFile(join(targetDir, '.prettierrc.json'), JSON.stringify(prettierConfig, null, 2));
}

/**
 * Create TypeScript source file with optional errors
 *
 * @example
 * await createTypeScriptFile(join(tempDir, 'src/index.ts'), { hasErrors: true });
 */
export async function createTypeScriptFile(
  filePath: string,
  options: {
    hasErrors?: boolean;
    hasWarnings?: boolean;
    content?: string;
  } = {}
): Promise<void> {
  const { hasErrors = false, hasWarnings = false, content } = options;

  let fileContent = content;

  if (!fileContent) {
    if (hasErrors) {
      // TypeScript error: missing type annotation
      fileContent = `
export function add(a, b) {
  return a + b;
}
`.trim();
    } else if (hasWarnings) {
      // ESLint warning: console.log
      fileContent = `
export function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}
`.trim();
    } else {
      // Clean code
      fileContent = `
export function add(a: number, b: number): number {
  return a + b;
}
`.trim();
    }
  }

  await writeFile(filePath, fileContent);
}

/**
 * Factory: Create full project structure
 *
 * Generates a complete project with all config files and source.
 *
 * @example
 * const tempDir = await createTempDirectory();
 * await createFullProject(tempDir, {
 *   name: 'my-project',
 *   includeTypeScript: true,
 *   includeESLint: true,
 * });
 */
export async function createFullProject(
  targetDir: string,
  options: ProjectOptions = {}
): Promise<void> {
  const { includeTypeScript = true, includeESLint = true, includePrettier = true } = options;

  // Create package.json
  await createPackageJson(targetDir, options);

  // Create config files
  if (includeTypeScript) {
    await createTypeScriptConfig(targetDir);
  }

  if (includeESLint) {
    await createESLintConfig(targetDir);
  }

  if (includePrettier) {
    await createPrettierConfig(targetDir);
  }

  // Create source directory with sample file
  const { mkdir } = await import('fs/promises');
  await mkdir(join(targetDir, 'src'), { recursive: true });
  await createTypeScriptFile(join(targetDir, 'src/index.ts'));
}

/**
 * Factory: Create project with validation errors
 *
 * @example
 * const tempDir = await createTempDirectory();
 * await createProjectWithErrors(tempDir);
 * // Project will have TypeScript and ESLint errors
 */
export async function createProjectWithErrors(targetDir: string): Promise<void> {
  await createFullProject(targetDir, {
    name: 'project-with-errors',
  });

  // Add file with errors
  await createTypeScriptFile(join(targetDir, 'src/bad.ts'), {
    hasErrors: true,
  });

  // Add file with warnings
  await createTypeScriptFile(join(targetDir, 'src/warnings.ts'), {
    hasWarnings: true,
  });
}
