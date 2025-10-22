/**
 * Help Commands Data
 *
 * Predefined command help data for the help system
 */

import type { CommandHelp, HelpOption } from './help-system.js';

// Constants to avoid string duplication
const TEMPLATE_FLAG = '--template, -t';
const QUALITY_FLAG = '--quality, -q';
const AI_FLAG = '--ai, -a';
const BASIC_TEMPLATE = 'basic';
const MEDIUM_QUALITY = 'medium';
const CLAUDE_CODE = 'claude-code';
const COPILOT = 'copilot';
const INIT_COMMAND = 'init';
const HELP_COMMAND = 'help';
const VERSION_COMMAND = 'version';
const HELP_FLAG = '--help, -h';
const CONFIG_FLAG = '--config, -c';
const VERSION_FLAG = '--version, -v';
const DESCRIPTION_FIELD = 'description';
const EXAMPLES_FIELD = 'examples';
const OPTIONS_FIELD = 'options';
const HELP_DESCRIPTION = 'Show help information';

/**
 * Get basic init command options
 * @returns Basic init options array
 */
function getBasicInitOptions(): HelpOption[] {
  return [
    {
      flags: `${TEMPLATE_FLAG} <name>`,
      [DESCRIPTION_FIELD]: 'Project template to use',
      choices: ['basic', 'web', 'cli', 'library'],
      defaultValue: BASIC_TEMPLATE,
    },
    {
      flags: `${QUALITY_FLAG} <level>`,
      [DESCRIPTION_FIELD]: 'Code quality level',
      choices: ['light', 'medium', 'strict'],
      defaultValue: MEDIUM_QUALITY,
    },
    {
      flags: HELP_FLAG,
      [DESCRIPTION_FIELD]: HELP_DESCRIPTION,
    },
  ];
}

/**
 * Get advanced init command options
 * @returns Advanced init options array
 */
function getAdvancedInitOptions(): HelpOption[] {
  return [
    {
      flags: `${AI_FLAG} <assistants>`,
      [DESCRIPTION_FIELD]: 'AI assistants to configure',
      choices: [CLAUDE_CODE, COPILOT],
      defaultValue: CLAUDE_CODE,
    },
    {
      flags: `${CONFIG_FLAG} <file>`,
      [DESCRIPTION_FIELD]: 'Configuration file to use',
    },
    {
      flags: '--verbose',
      [DESCRIPTION_FIELD]: 'Enable verbose output',
    },
    {
      flags: '--force',
      [DESCRIPTION_FIELD]: 'Force overwrite existing files',
    },
    {
      flags: '--dry-run',
      [DESCRIPTION_FIELD]: 'Show what would be done without actually doing it',
    },
    {
      flags: '--no-color',
      [DESCRIPTION_FIELD]: 'Disable colored output',
    },
  ];
}

/**
 * Get all init command options
 * @returns All init options array
 */
function getInitCommandOptions(): HelpOption[] {
  return [...getBasicInitOptions(), ...getAdvancedInitOptions()];
}

/**
 * Create init command help
 * @returns Init command help
 */
export function createInitCommand(): CommandHelp {
  return {
    name: INIT_COMMAND,
    [DESCRIPTION_FIELD]: 'Initialize a new TypeScript project',
    usage: 'init [PROJECT_NAME] [OPTIONS]',
    [EXAMPLES_FIELD]: [
      'nimata init my-project',
      'nimata init my-web-app --template web',
      'nimata init my-cli --template cli --ai claude-code',
      'nimata init my-lib --template library --quality strict',
    ],
    [OPTIONS_FIELD]: getInitCommandOptions(),
  };
}

/**
 * Create help command help
 * @returns Help command help
 */
export function createHelpCommand(): CommandHelp {
  return {
    name: HELP_COMMAND,
    [DESCRIPTION_FIELD]: HELP_DESCRIPTION,
    usage: 'help [COMMAND|TOPIC]',
    [EXAMPLES_FIELD]: [
      'nimata help',
      'nimata help init',
      'nimata help project-types',
      'nimata init --help',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: HELP_FLAG,
        [DESCRIPTION_FIELD]: HELP_DESCRIPTION,
      },
    ],
  };
}

/**
 * Create version command help
 * @returns Version command help
 */
export function createVersionCommand(): CommandHelp {
  return {
    name: VERSION_COMMAND,
    [DESCRIPTION_FIELD]: 'Show version information',
    usage: 'version',
    [EXAMPLES_FIELD]: ['nimata version', 'nimata --version', 'nimata -v'],
    [OPTIONS_FIELD]: [
      {
        flags: VERSION_FLAG,
        [DESCRIPTION_FIELD]: 'Show version information',
      },
    ],
  };
}

/**
 * Get all command help data
 * @returns Map of all command help
 */
export function getAllCommandHelp(): Map<string, CommandHelp> {
  const commands = new Map<string, CommandHelp>();

  commands.set(INIT_COMMAND, createInitCommand());
  commands.set(HELP_COMMAND, createHelpCommand());
  commands.set(VERSION_COMMAND, createVersionCommand());

  return commands;
}
