/**
 * AI Context Generator Constants
 *
 * Magic numbers and configuration values for AI context generation
 */

export const DEFAULT_DEV_COMMAND = 'bun run dev';

export const AI_CONTEXT_CONSTANTS = {
  DEV_COMMAND: {
    WEB: DEFAULT_DEV_COMMAND,
    CLI: DEFAULT_DEV_COMMAND,
    LIBRARY: DEFAULT_DEV_COMMAND,
    DEFAULT: DEFAULT_DEV_COMMAND,
  },
  KEY_COMMANDS:
    'test: `bun test`, lint: `bun run lint`, typecheck: `bun run typecheck`, format: `bun run format`',
} as const;
