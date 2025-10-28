/**
 * Validation constants for project configuration processing
 */

/** Individual constants */
export const BASIC = 'basic';
export const WEB = 'web';
export const CLI = 'cli';
export const LIBRARY = 'library';
export const BUN_REACT = 'bun-react';
export const BUN_VUE = 'bun-vue';
export const BUN_EXPRESS = 'bun-express';
export const BUN_TYPESCRIPT = 'bun-typescript';
export const LIGHT = 'light';
export const MEDIUM = 'medium';
export const STRICT = 'strict';
export const HIGH = 'high';
export const CLAUDE_CODE = 'claude-code';
export const COPILOT = 'copilot';
export const GITHUB_COPILOT = 'github-copilot';
export const AI_CONTEXT = 'ai-context';
export const CURSOR = 'cursor';
export const MIT = 'MIT';
export const APACHE_2_0 = 'Apache-2.0';
export const GPL_3_0 = 'GPL-3.0';
export const BSD_3_CLAUSE = 'BSD-3-Clause';
export const ISC = 'ISC';

/** Validation limits */
export const MAX_PROJECT_NAME_LENGTH = 214;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_AUTHOR_LENGTH = 100;
export const MAX_AI_ASSISTANTS = 5;

/** Common numeric constants */
export const DEFAULT_DEV_PORT = 3000;
export const DEFAULT_TIMEOUT_MS = 5000;
export const DEFAULT_INTERVAL_MS = 1000;
export const NOTIFICATION_TIMEOUT_MS = 5000;
export const BYTES_IN_KB = 1024;
export const DIRECTORY_PERMISSIONS = 0o755;
export const FILE_PERMISSIONS = 0o644;
export const Z_INDEX_DROPDOWN = 1000;
export const MAX_PATH_LENGTH = 1024;

/** Validation arrays */
export const VALID_PROJECT_TYPES = [
  BASIC,
  WEB,
  CLI,
  LIBRARY,
  BUN_REACT,
  BUN_VUE,
  BUN_EXPRESS,
  BUN_TYPESCRIPT,
] as const;

export const VALID_QUALITY_LEVELS = [LIGHT, MEDIUM, STRICT, HIGH] as const;
export const VALID_AI_ASSISTANTS = [
  CLAUDE_CODE,
  COPILOT,
  GITHUB_COPILOT,
  AI_CONTEXT,
  CURSOR,
] as const;
export const COMMON_LICENSES = [MIT, APACHE_2_0, GPL_3_0, BSD_3_CLAUSE, ISC] as const;

/** Type definitions */
export type ValidProjectType = (typeof VALID_PROJECT_TYPES)[number];
export type ValidQualityLevel = (typeof VALID_QUALITY_LEVELS)[number];
export type ValidAIAssistant = (typeof VALID_AI_ASSISTANTS)[number];
export type CommonLicense = (typeof COMMON_LICENSES)[number];

/** Validation patterns */
export const PROJECT_NAME_PATTERN = /^[\d_a-z-]+$/;

/** Reserved names */
export const RESERVED_PROJECT_NAMES = [
  'node',
  'npm',
  'bun',
  'deno',
  'yarn',
  'pnpm',
  'test',
  'spec',
  'mock',
  'stub',
  'fixture',
  'lib',
  'bin',
  'src',
  'dist',
  'build',
  'out',
  'package',
  'module',
  'index',
  'main',
  'app',
];

/** Dangerous patterns for security validation */
export const DANGEROUS_NAME_PATTERNS = [
  /^\.+\//, // Directory traversal attempts
  /["*:<>?\\|]/, // Invalid filename characters
  /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Reserved Windows names
  /^[A-Za-z]:/, // Windows drive letters
  /\s/, // Spaces (not allowed in npm package names)
];

export const DANGEROUS_AUTHOR_PATTERNS = [/<\/?script>/i, /javascript:/i, /on\w+\s*=/i];

export const XSS_PATTERNS = [/<script/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i];

export const DANGEROUS_DIRECTORIES = ['etc', 'bin', 'usr', 'var', 'sys', 'proc', 'dev'];

/** Error messages */
export const ERROR_MESSAGES = {
  PROJECT_NAME_REQUIRED: 'Project name is required',
  PROJECT_NAME_FORMAT:
    'Project name should contain only lowercase letters, numbers, hyphens, and underscores',
  INVALID_PROJECT_TYPE: (type: string) =>
    `Invalid project type: ${type}. Valid types: ${VALID_PROJECT_TYPES.join(', ')}`,
  INVALID_QUALITY_LEVEL: (level: string) =>
    `Invalid quality level: ${level}. Valid levels: ${VALID_QUALITY_LEVELS.join(', ')}`,
  INVALID_AI_ASSISTANT: (assistant: string) =>
    `Invalid AI assistant: ${assistant}. Valid assistants: ${VALID_AI_ASSISTANTS.join(', ')}`,
  INVALID_LICENSE: (license: string) =>
    `License '${license}' is not a common open source license. Consider using: ${COMMON_LICENSES.join(', ')}`,
  TEMPLATE_INCOMPATIBLE: (template: string, projectType: string) =>
    `Template '${template}' may not be compatible with project type '${projectType}'`,
} as const;
