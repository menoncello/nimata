/**
 * Project Generation Constants
 *
 * Constants and validation values for project generation
 */

// Constants to avoid magic numbers
export const PROJECT_GENERATION_CONSTANTS = {
  // Text limits
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_AUTHOR_NAME_LENGTH: 100,

  // Validation
  MAX_NAME_LENGTH: 50,

  // Project types
  VALID_PROJECT_TYPES: [
    'basic',
    'web',
    'cli',
    'library',
    'bun-react',
    'bun-vue',
    'bun-express',
    'bun-typescript',
  ] as const,

  // Quality levels
  VALID_QUALITY_LEVELS: ['light', 'medium', 'strict', 'high'] as const,

  // AI assistants
  VALID_AI_ASSISTANTS: [
    'claude-code',
    'copilot',
    'github-copilot',
    'ai-context',
    'cursor',
  ] as const,

  // Error messages
  ERROR_MESSAGES: {
    PROJECT_NAME_REQUIRED: 'Project name is required',
    QUALITY_LEVEL_REQUIRED: 'Quality level is required',
    PROJECT_TYPE_REQUIRED: 'Project type is required',
    AI_ASSISTANT_REQUIRED: 'At least one AI assistant must be selected',
    INVALID_QUALITY_LEVEL: 'Invalid quality level. Must be: light, medium, strict, or high',
    INVALID_PROJECT_TYPE:
      'Invalid project type. Must be: basic, web, cli, library, bun-react, bun-vue, bun-express, or bun-typescript',
    INVALID_AI_ASSISTANTS: (invalid: string[]) =>
      `Invalid AI assistants: ${invalid.join(', ')}. Valid options: claude-code, copilot, github-copilot, ai-context, cursor`,
    DESCRIPTION_TOO_LONG: (max: number) => `Description must be less than ${max} characters`,
    AUTHOR_NAME_TOO_LONG: (max: number) => `Author name must be less than ${max} characters`,
    INVALID_LICENSE: 'Invalid license. Use a valid SPDX license identifier or leave empty',
  },

  // Validation patterns
  PROJECT_NAME_PATTERN: /^[\d_a-z-]+$/,
  PROJECT_NAME_START_PATTERN: /^[\d.]/,
} as const;
