/**
 * Help System Constants
 *
 * Constants and templates used by the help system
 */

// Magic numbers to constants
export const PADDING_LENGTH = 15;
export const FLAG_PADDING = 20;
export const CHOICE_PADDING = 23;

// Common messages
export const UNKNOWN_COMMAND_MESSAGE = 'Unknown command: {{command}}';
export const UNKNOWN_TOPIC_MESSAGE = 'Unknown topic: {{topic}}';
export const AVAILABLE_COMMANDS_MESSAGE = 'Available commands: {{commands}}';
export const AVAILABLE_TOPICS_MESSAGE = 'Available topics: {{topics}}';

// Help templates
export const GENERAL_HELP_TEMPLATE = `
🚀 Nìmata CLI - TypeScript Project Generator

USAGE:
  nimata [COMMAND] [OPTIONS]

COMMANDS:
  init         Initialize a new TypeScript project
  help         Show this help message
  version      Show version information

Get help for specific command:
  nimata help [COMMAND]
  nimata [COMMAND] --help

EXAMPLES:
  nimata init my-project
  nimata init my-web-app --template web --quality strict
  nimata init my-cli --template cli --ai claude-code,copilot

OPTIONS:
  --help, -h     Show help information
  --version, -v  Show version information

For more information, visit: https://github.com/nimata/cli
`;

export const COMMAND_HELP_TEMPLATE = `
🚀 {{COMMAND_NAME}} - {{DESCRIPTION}}

USAGE:
  nimata {{USAGE}}

EXAMPLES:
{{EXAMPLES}}

OPTIONS:
{{OPTIONS}}
`;

export const TOPIC_HELP_HEADER = '📚 {{TOPIC_NAME}} - {{DESCRIPTION}}';
export const TOPICS_LIST_HEADER = '\n📚 Available Help Topics:\n';
export const GET_HELP_MESSAGE = '\nGet help: nimata help [TOPIC]';

export const SUBCOMMANDS_HEADER = '\nSUBCOMMANDS:\n  ';
export const USAGE_HEADER = '\nUSAGE:\n  ';
export const EXAMPLES_HEADER = '\nEXAMPLES:\n';
export const OPTIONS_HEADER = '\nOPTIONS:\n';
export const SEE_ALSO_HEADER = '\nSEE ALSO:\n  ';
