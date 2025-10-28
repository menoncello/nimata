/**
 * Built-in Tech Stacks
 *
 * Pre-defined tech stack configurations
 */
/* eslint-disable max-lines, max-lines-per-function, sonarjs/no-identical-functions, jsdoc/require-description, jsdoc/require-returns, jsdoc/require-param-description, @typescript-eslint/no-unused-vars, sonarjs/no-duplicate-string */
import type { TemplateValidationRule } from '@nimata/core';
import type { TechStackConfig } from '../tech-stack-types.js';
import { TECH_STACK_CATEGORIES, TECH_STACK_PRIORITY } from '../tech-stack-utils.js';

// Constants to avoid string duplication
const DEPENDENCY_TYPES = {
  RUNTIME: 'runtime' as const,
  DEV: 'devDependency' as const,
  PEER: 'peerDependency' as const,
  TEMPLATE: 'template' as const,
} as const;

type DependencyType = (typeof DEPENDENCY_TYPES)[keyof typeof DEPENDENCY_TYPES];
const TYPESCRIPT_VERSION = '^5.0.0';
const NODE_TYPES_VERSION = '^20.0.0';
const REACT_TYPES_VERSION = '^18.0.0';

// Template patterns
const TS_TEMPLATE_PATTERNS = ['src/**/*.ts', 'dist/**/*.js'];
const TSX_TEMPLATE_PATTERNS = ['src/**/*.{ts,tsx}', 'public/**/*', 'dist/**/*'];

// Common tags
const TYPESCRIPT_TAGS = ['typescript', 'basic', 'minimal'];
const REACT_TAGS = ['react', 'typescript', 'frontend', 'ui'];
const NODE_TAGS = ['nodejs', 'express', 'typescript', 'api', 'backend'];

// Common validation rule names and descriptions
const TS_CONFIG_NAME = 'TypeScript Configuration';
const BASIC_TS_DESC = 'Validates TypeScript configuration for basic projects';
const TS_ERROR_MSG = 'TypeScript configuration file is required';

// Type aliases and interfaces
interface DependencyDefinition {
  name: string;
  version: string;
  required: boolean;
  type: DependencyType;
  description: string;
}

interface ValidationRuleDefinition {
  id: string;
  name: string;
  description: string;
  validator: (config: unknown) => boolean;
  severity: 'error' | 'warning' | 'info';
  category: 'structure' | 'performance' | 'security' | 'best-practice';
  message: string;
  enabled?: boolean;
}

// Adapter to convert ValidationRuleDefinition to TemplateValidationRule
/**
 *
 * @param rule
 */
function adaptValidationRule(rule: ValidationRuleDefinition): TemplateValidationRule {
  return {
    id: rule.id,
    name: rule.name,
    description: rule.description,
    validator: (template: unknown, content: string) => ({
      valid: rule.validator(template),
      errors: rule.validator(template)
        ? []
        : [
            {
              code: rule.id,
              message: rule.message,
              severity: 'error' as const,
              context: undefined,
            },
          ],
      warnings: [],
      timestamp: new Date(),
      validator: rule.id,
    }),
    severity: rule.severity as 'error' | 'warning' | 'info',
    category: rule.category as 'structure' | 'content' | 'performance' | 'security',
    enabled: rule.enabled ?? true,
  };
}

/**
 * Creates a basic TypeScript tech stack
 * @returns Tech stack configuration for basic TypeScript
 */
export function createTypeScriptBasicStack(): TechStackConfig {
  const BASIC_TYPESCRIPT_CONSTANTS = {
    ID: 'typescript-basic',
    NAME: 'TypeScript Basic',
    VERSION: '1.0.0',
    DESCRIPTION: 'Basic TypeScript setup with minimal configuration',
    CATEGORY: TECH_STACK_CATEGORIES.LIBRARY,
  } as const;

  return {
    id: BASIC_TYPESCRIPT_CONSTANTS.ID,
    name: BASIC_TYPESCRIPT_CONSTANTS.NAME,
    version: BASIC_TYPESCRIPT_CONSTANTS.VERSION,
    description: BASIC_TYPESCRIPT_CONSTANTS.DESCRIPTION,
    supportedProjectTypes: ['basic', 'library'],
    dependencies: createBasicTypeScriptDependencies(),
    templatePatterns: TS_TEMPLATE_PATTERNS,
    validationRules: createBasicTypeScriptValidationRules().map(adaptValidationRule),
    configurationSchema: createBasicTypeScriptConfigurationSchema(),
    defaultConfiguration: createBasicTypeScriptDefaults(),
    metadata: {
      category: BASIC_TYPESCRIPT_CONSTANTS.CATEGORY,
      priority: TECH_STACK_PRIORITY.NORMAL,
      tags: TYPESCRIPT_TAGS,
    },
  };
}

/**
 * Creates basic TypeScript dependencies
 * @returns Array of TypeScript dependencies
 */
function createBasicTypeScriptDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'typescript',
      version: TYPESCRIPT_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'TypeScript compiler and language features',
    },
    {
      name: '@types/node',
      version: NODE_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'Node.js type definitions',
    },
  ];
}

/**
 * Creates basic TypeScript validation rules
 * @returns Array of validation rules
 */
function createBasicTypeScriptValidationRules(): ValidationRuleDefinition[] {
  return [
    {
      id: 'basic-tsconfig',
      name: TS_CONFIG_NAME,
      description: BASIC_TS_DESC,
      validator: (config) => typeof config === 'object' && config !== null,
      severity: 'error',
      category: 'structure',
      message: TS_ERROR_MSG,
      enabled: true,
    },
  ];
}

/**
 * Creates basic TypeScript configuration schema
 * @returns Configuration schema object
 */
function createBasicTypeScriptConfigurationSchema(): Record<
  string,
  {
    type: string;
    default?: boolean | string;
    enum?: string[];
  }
> {
  return {
    strict: { type: 'boolean', default: false },
    target: { type: 'string', enum: ['ES5', 'ES6', 'ES2020', 'ES2022'], default: 'ES2020' },
    module: { type: 'string', enum: ['CommonJS', 'ESNext'], default: 'ESNext' },
  };
}

/**
 * Creates basic TypeScript default configuration
 * @returns Default configuration object
 */
function createBasicTypeScriptDefaults(): {
  strict: boolean;
  target: string;
  module: string;
} {
  return {
    strict: false,
    target: 'ES2020',
    module: 'ESNext',
  };
}

/**
 * Creates Bun-specific dependencies
 * @returns Array of Bun dependencies
 */
function createBunDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'bun-types',
      version: 'latest',
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'Bun runtime type definitions',
    },
    {
      name: 'zod',
      version: '^3.22.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'Schema validation and type safety',
    },
  ];
}

/**
 * Creates dependencies for Bun TypeScript CLI stack
 * @returns Array of dependencies
 */
function createBunTypeScriptCliDependencies(): DependencyDefinition[] {
  return [...createBasicTypeScriptDependencies(), ...createBunDependencies()];
}

/**
 * Creates validation rules for Bun TypeScript CLI stack
 * @returns Array of validation rules
 */
function createBunTypeScriptCliValidationRules(): ValidationRuleDefinition[] {
  return [
    {
      id: 'bun-cli-tsconfig',
      name: TS_CONFIG_NAME,
      description: 'Validates TypeScript configuration for CLI applications',
      validator: (config) => typeof config === 'object' && config !== null,
      severity: 'error',
      category: 'structure',
      message: 'TypeScript configuration is required for CLI applications',
      enabled: true,
    },
  ];
}

/**
 * Creates a Bun + TypeScript CLI stack
 * @returns Tech stack configuration for Bun TypeScript CLI
 */
export function createBunTypeScriptCliStack(): TechStackConfig {
  return {
    id: 'bun-typescript-cli',
    name: 'Bun TypeScript CLI',
    version: '1.0.0',
    description: 'Complete TypeScript CLI application with Bun runtime',
    supportedProjectTypes: ['cli', 'basic'],
    dependencies: createBunTypeScriptCliDependencies(),
    templatePatterns: ['src/**/*.ts', 'dist/**/*.js', 'bin/**/*.js'],
    validationRules: createBunTypeScriptCliValidationRules().map(adaptValidationRule),
    configurationSchema: {
      strict: { type: 'boolean', default: true },
      target: { type: 'string', enum: ['ES2020', 'ES2022', 'Bun'], default: 'Bun' },
      module: { type: 'string', enum: ['ESNext'], default: 'ESNext' },
      cliFramework: {
        type: 'string',
        enum: ['commander', 'yargs', 'argv', 'custom'],
        default: 'commander',
      },
    },
    defaultConfiguration: {
      strict: true,
      target: 'Bun',
      module: 'ESNext',
      cliFramework: 'commander',
    },
    metadata: {
      category: TECH_STACK_CATEGORIES.CLI,
      priority: TECH_STACK_PRIORITY.HIGH,
      tags: ['bun', 'typescript', 'cli', 'runtime'],
    },
  };
}

/**
 * Creates React core dependencies
 * @returns Array of React core dependencies
 */
function createReactCoreDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'react',
      version: '^18.0.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'React library for user interfaces',
    },
    {
      name: 'react-dom',
      version: '^18.0.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'React DOM renderer',
    },
  ];
}

/**
 * Creates React TypeScript dependencies
 * @returns Array of React TypeScript dependencies
 */
function createReactTypeScriptDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'typescript',
      version: TYPESCRIPT_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'TypeScript compiler and language features',
    },
    {
      name: '@types/react',
      version: REACT_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'React type definitions',
    },
    {
      name: '@types/react-dom',
      version: REACT_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'React DOM type definitions',
    },
  ];
}

/**
 * Creates React dependencies
 * @returns Array of React dependencies
 */
function createReactDependencies(): DependencyDefinition[] {
  return [...createReactCoreDependencies(), ...createReactTypeScriptDependencies()];
}

/**
 * Creates React validation rules
 * @returns Array of validation rules
 */
function createReactValidationRules(): ValidationRuleDefinition[] {
  return [
    {
      id: 'react-typescript-config',
      name: TS_CONFIG_NAME,
      description: 'Validates TypeScript configuration for React applications',
      validator: (config) => typeof config === 'object' && config !== null,
      severity: 'error',
      category: 'structure',
      message: 'TypeScript configuration is required for React applications',
      enabled: true,
    },
  ];
}

/**
 * Creates a React + TypeScript stack
 * @returns Tech stack configuration for React TypeScript
 */
export function createReactTypeScriptStack(): TechStackConfig {
  return {
    id: 'react-typescript',
    name: 'React TypeScript',
    version: '1.0.0',
    description: 'React application with TypeScript and modern tooling',
    supportedProjectTypes: ['web'],
    dependencies: createReactDependencies(),
    templatePatterns: TSX_TEMPLATE_PATTERNS,
    validationRules: createReactValidationRules().map(adaptValidationRule),
    configurationSchema: {
      strict: { type: 'boolean', default: true },
      target: { type: 'string', enum: ['ES2020', 'ES2022'], default: 'ES2022' },
      jsx: { type: 'string', enum: ['react-jsx', 'react'], default: 'react-jsx' },
      bundler: { type: 'string', enum: ['vite', 'webpack', 'rollup'], default: 'vite' },
    },
    defaultConfiguration: {
      strict: true,
      target: 'ES2022',
      jsx: 'react-jsx',
      bundler: 'vite',
    },
    metadata: {
      category: TECH_STACK_CATEGORIES.FRONTEND,
      priority: TECH_STACK_PRIORITY.HIGH,
      tags: REACT_TAGS,
    },
  };
}

/**
 * Creates Node.js Express core dependencies
 * @returns Array of Node.js Express core dependencies
 */
function createNodeExpressCoreDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'express',
      version: '^4.18.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'Express.js web framework',
    },
    {
      name: '@types/express',
      version: '^4.17.0',
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'Express type definitions',
    },
  ];
}

/**
 * Creates Node.js Express TypeScript dependencies
 * @returns Array of Node.js Express TypeScript dependencies
 */
function createNodeExpressTypeScriptDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'typescript',
      version: TYPESCRIPT_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'TypeScript compiler',
    },
    {
      name: '@types/node',
      version: NODE_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'Node.js type definitions',
    },
  ];
}

/**
 * Creates Node.js Express dependencies
 * @returns Array of Node.js Express dependencies
 */
function createNodeExpressDependencies(): DependencyDefinition[] {
  return [...createNodeExpressCoreDependencies(), ...createNodeExpressTypeScriptDependencies()];
}

/**
 * Creates Node.js Express validation rules
 * @returns Array of validation rules
 */
function createNodeExpressValidationRules(): ValidationRuleDefinition[] {
  return [
    {
      id: 'express-typescript-config',
      name: TS_CONFIG_NAME,
      description: 'Validates TypeScript configuration for Express applications',
      validator: (config) => typeof config === 'object' && config !== null,
      severity: 'error',
      category: 'structure',
      message: 'TypeScript configuration is required for Express applications',
      enabled: true,
    },
  ];
}

/**
 * Creates a Node.js + Express TypeScript stack
 * @returns Tech stack configuration for Node.js Express TypeScript
 */
export function createNodeExpressTypeScriptStack(): TechStackConfig {
  const defaultConfig = { strict: true, target: 'ES2022', port: 3000, cors: true, helmet: true };
  return {
    id: 'node-express-typescript',
    name: 'Node.js Express TypeScript',
    version: '1.0.0',
    description: 'Node.js REST API with Express and TypeScript',
    supportedProjectTypes: ['web'],
    dependencies: createNodeExpressDependencies(),
    templatePatterns: TS_TEMPLATE_PATTERNS,
    validationRules: createNodeExpressValidationRules().map(adaptValidationRule),
    configurationSchema: {
      strict: { type: 'boolean', default: true },
      target: { type: 'string', enum: ['ES2020', 'ES2022'], default: 'ES2022' },
      port: { type: 'number', default: 3000 },
      cors: { type: 'boolean', default: true },
      helmet: { type: 'boolean', default: true },
    },
    defaultConfiguration: defaultConfig,
    metadata: {
      category: TECH_STACK_CATEGORIES.BACKEND,
      priority: TECH_STACK_PRIORITY.HIGH,
      tags: NODE_TAGS,
    },
  };
}

/**
 * Creates Bun TypeScript CLI configuration schema
 */
function createBunTypeScriptCliSchema(): Record<string, unknown> {
  return {
    strict: { type: 'boolean', default: true },
    target: { type: 'string', enum: ['ES2020', 'ES2022', 'Bun'], default: 'Bun' },
    module: { type: 'string', enum: ['ESNext'], default: 'ESNext' },
  };
}

/**
 * Creates Bun TypeScript CLI framework configuration
 */
function createBunTypeScriptCliFramework(): Record<string, unknown> {
  return {
    type: 'string',
    enum: ['commander', 'yargs', 'argv', 'custom'],
    default: 'commander',
  };
}

/**
 * Creates Bun TypeScript CLI execution configuration
 */
function createBunTypeScriptCliExecution(): Record<string, unknown> {
  return {
    mainFile: { type: 'string', default: 'src/index.ts' },
    buildCommand: { type: 'string', default: 'bun run build' },
  };
}

/**
 * Creates Bun TypeScript CLI metadata
 */
function createBunTypeScriptCliMetadata(): Record<string, unknown> {
  return {
    category: 'cli-tool',
    priority: TECH_STACK_PRIORITY.NORMAL,
    tags: TYPESCRIPT_TAGS,
  };
}

/**
 * Creates React TypeScript configuration schema
 */
function createReactTypeScriptConfigSchema(): Record<string, unknown> {
  return {
    strict: { type: 'boolean', default: true },
    target: { type: 'string', enum: ['ES2020', 'ES2022'], default: 'ES2022' },
    jsx: { type: 'string', enum: ['react-jsx', 'react'], default: 'react-jsx' },
    module: { type: 'string', enum: ['ESNext', 'CommonJS'], default: 'ESNext' },
    bundler: { type: 'string', enum: ['vite', 'webpack', 'rollup'], default: 'vite' },
  };
}

/**
 * Creates React with TypeScript dependencies
 */
function createReactWithTypeScriptDependencies(): DependencyDefinition[] {
  return [
    {
      name: 'react',
      version: '^18.0.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'React library for user interfaces',
    },
    {
      name: 'react-dom',
      version: '^18.0.0',
      required: true,
      type: DEPENDENCY_TYPES.RUNTIME,
      description: 'React DOM renderer',
    },
    {
      name: 'typescript',
      version: TYPESCRIPT_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'TypeScript compiler and language features',
    },
    {
      name: '@types/react',
      version: REACT_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'React type definitions',
    },
    {
      name: '@types/react-dom',
      version: REACT_TYPES_VERSION,
      required: true,
      type: DEPENDENCY_TYPES.DEV,
      description: 'React DOM type definitions',
    },
  ];
}

/**
 * Creates React configuration schema
 */
function createReactConfigSchema(): Record<string, unknown> {
  return {
    strict: { type: 'boolean', default: true },
    target: { type: 'string', enum: ['ES2020', 'ES2022'], default: 'ES2022' },
    jsx: { type: 'string', enum: ['react-jsx', 'react'], default: 'react-jsx' },
    module: { type: 'string', enum: ['ESNext', 'CommonJS'], default: 'ESNext' },
    bundler: { type: 'string', enum: ['vite', 'webpack', 'rollup'], default: 'vite' },
  };
}

/**
 * Creates React bundler configuration
 */
function createReactBundlerConfig(): Record<string, unknown> {
  return {
    type: 'string',
    enum: ['vite', 'webpack', 'rollup'],
    default: 'vite',
  };
}

/**
 * Creates React default configuration
 */
function createReactDefaultConfig(): Record<string, unknown> {
  return {
    strict: true,
    target: 'ES2022',
    jsx: 'react-jsx',
    bundler: 'vite',
  };
}

/**
 * Array of all built-in tech stack creators
 */
export const BUILTIN_TECH_STACK_CREATORS = [
  createTypeScriptBasicStack,
  createBunTypeScriptCliStack,
  createReactTypeScriptStack,
  createNodeExpressTypeScriptStack,
] as const;
