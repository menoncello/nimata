/**
 * Help Topics Data
 *
 * Predefined help topics and commands for the help system
 */

import { HelpTopic, CommandHelp, type HelpOption } from './help-system.js';

// Constants to avoid string duplication
const TEMPLATE_FLAG = '--template, -t';
const QUALITY_FLAG = '--quality, -q';
const AI_FLAG = '--ai, -a';
const BASIC_TEMPLATE = 'basic';
const MEDIUM_QUALITY = 'medium';
const PROJECT_TYPES_TOPIC = 'project-types';
const QUALITY_LEVELS_TOPIC = 'quality-levels';
const AI_ASSISTANTS_TOPIC = 'ai-assistants';
const CONFIGURATION_TOPIC = 'configuration';
const TEMPLATES_TOPIC = 'templates';
const CLAUDE_CODE = 'claude-code';
const HELP_DESCRIPTION = 'Show help information';
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
const SEE_ALSO_FIELD = 'seeAlso';
const NAME_FIELD = 'name';

/**
 * Create project types help topic
 * @returns {HelpTopic} Help topic for project types
 */
function createProjectTypesTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Project Types',
    [DESCRIPTION_FIELD]: 'Different project templates available',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --template basic',
      'nimata init my-web-app --template web',
      'nimata init my-cli-tool --template cli',
      'nimata init my-library --template library',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: TEMPLATE_FLAG,
        [DESCRIPTION_FIELD]: 'Project template to use',
        choices: ['basic', 'web', 'cli', 'library'],
        defaultValue: BASIC_TEMPLATE,
      },
    ],
    [SEE_ALSO_FIELD]: [QUALITY_LEVELS_TOPIC, AI_ASSISTANTS_TOPIC],
  };
}

/**
 * Create quality levels help topic
 * @returns {HelpTopic} Help topic for quality levels
 */
function createQualityLevelsTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Quality Levels',
    [DESCRIPTION_FIELD]: 'Code quality configurations available',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --quality light',
      'nimata init my-app --quality medium',
      'nimata init my-app --quality strict',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: QUALITY_FLAG,
        [DESCRIPTION_FIELD]: 'Code quality level',
        choices: ['light', 'medium', 'strict'],
        defaultValue: MEDIUM_QUALITY,
      },
    ],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, AI_ASSISTANTS_TOPIC],
  };
}

/**
 * Create AI assistants help topic
 * @returns {HelpTopic} Help topic for AI assistants
 */
function createAIAssistantsTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'AI Assistants',
    [DESCRIPTION_FIELD]: 'AI assistant configurations available',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --ai claude-code',
      'nimata init my-app --ai copilot',
      'nimata init my-app --ai claude-code,copilot',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: AI_FLAG,
        [DESCRIPTION_FIELD]: 'AI assistants to configure',
        choices: [CLAUDE_CODE, COPILOT],
        defaultValue: CLAUDE_CODE,
      },
    ],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, QUALITY_LEVELS_TOPIC],
  };
}

/**
 * Create configuration help topic
 * @returns {HelpTopic} Configuration help topic
 */
function createConfigurationTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Configuration',
    [DESCRIPTION_FIELD]: 'Configuration options and files',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --config custom.json',
      'nimata config show',
      'nimata config set quality strict',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: CONFIG_FLAG,
        [DESCRIPTION_FIELD]: 'Configuration file to use',
      },
    ],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, QUALITY_LEVELS_TOPIC],
  };
}

/**
 * Create templates help topic
 * @returns {HelpTopic} Templates help topic
 */
function createTemplatesTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Templates',
    [DESCRIPTION_FIELD]: 'Custom templates and template management',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --template @myorg/custom-template',
      'nimata template list',
      'nimata template create my-template',
    ],
    [OPTIONS_FIELD]: [
      {
        flags: TEMPLATE_FLAG,
        [DESCRIPTION_FIELD]: 'Template name or package to use',
      },
    ],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, CONFIGURATION_TOPIC],
  };
}

/**
 * Create interactive mode help topic
 * @returns {HelpTopic} Interactive mode help topic
 */
function createInteractiveModeTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Interactive Mode',
    [DESCRIPTION_FIELD]: 'Interactive project setup with guided prompts',
    [EXAMPLES_FIELD]: ['nimata init my-app --interactive', 'nimata init -i'],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, QUALITY_LEVELS_TOPIC],
  };
}

/**
 * Create advanced options help topic
 * @returns {HelpTopic} Advanced options help topic
 */
function createAdvancedOptionsTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Advanced Options',
    [DESCRIPTION_FIELD]: 'Advanced configuration and customization options',
    [EXAMPLES_FIELD]: [
      'nimata init my-app --template web --quality strict --ai claude-code,copilot',
      'nimata init my-app --config custom.json --verbose',
    ],
    [SEE_ALSO_FIELD]: [PROJECT_TYPES_TOPIC, QUALITY_LEVELS_TOPIC, AI_ASSISTANTS_TOPIC],
  };
}

/**
 * Create troubleshooting help topic
 * @returns {HelpTopic} Troubleshooting help topic
 */
function createTroubleshootingTopic(): HelpTopic {
  return {
    [NAME_FIELD]: 'Troubleshooting',
    [DESCRIPTION_FIELD]: 'Common issues and solutions',
    [EXAMPLES_FIELD]: [
      'Check logs: ~/.nimata/logs/',
      'Verify installation: nimata --version',
      'Get help: nimata help',
    ],
    [SEE_ALSO_FIELD]: [CONFIGURATION_TOPIC],
  };
}

/**
 * Create help topics map
 * @returns {void} Map of help topics
 */
export function createHelpTopics(): Map<string, HelpTopic> {
  const topics = new Map<string, HelpTopic>();

  topics.set(PROJECT_TYPES_TOPIC, createProjectTypesTopic());
  topics.set(QUALITY_LEVELS_TOPIC, createQualityLevelsTopic());
  topics.set(AI_ASSISTANTS_TOPIC, createAIAssistantsTopic());
  topics.set(CONFIGURATION_TOPIC, createConfigurationTopic());
  topics.set(TEMPLATES_TOPIC, createTemplatesTopic());
  topics.set('interactive-mode', createInteractiveModeTopic());
  topics.set('advanced-options', createAdvancedOptionsTopic());
  topics.set('troubleshooting', createTroubleshootingTopic());

  return topics;
}

/**
 * Create command help data
 * @returns {CommandHelp} Map of command help
 */
function createInitCommandHelp(): CommandHelp {
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
 * Get init command options
 * @returns {HelpOption[]} Array of command options
 */
function getInitCommandOptions(): HelpOption[] {
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
      flags: HELP_FLAG,
      [DESCRIPTION_FIELD]: HELP_DESCRIPTION,
    },
  ];
}

/**
 * Create help command help
 * @returns {CommandHelp} Help command help
 */
function createHelpCommandHelp(): CommandHelp {
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
 * @returns {CommandHelp} Version command help
 */
function createVersionCommandHelp(): CommandHelp {
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
 * Create command help data
 * @returns {void} Map of command help
 */
export function createCommandHelp(): Map<string, CommandHelp> {
  const commands = new Map<string, CommandHelp>();

  commands.set(INIT_COMMAND, createInitCommandHelp());
  commands.set(HELP_COMMAND, createHelpCommandHelp());
  commands.set(VERSION_COMMAND, createVersionCommandHelp());

  return commands;
}
