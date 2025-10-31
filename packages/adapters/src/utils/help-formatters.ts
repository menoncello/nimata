/**
 * Help System Formatters
 *
 * Formatting utilities for help system output
 */

import {
  PADDING_LENGTH,
  FLAG_PADDING,
  CHOICE_PADDING,
  UNKNOWN_COMMAND_MESSAGE,
  UNKNOWN_TOPIC_MESSAGE,
  AVAILABLE_COMMANDS_MESSAGE,
  AVAILABLE_TOPICS_MESSAGE,
  COMMAND_HELP_TEMPLATE,
  TOPIC_HELP_HEADER,
  SUBCOMMANDS_HEADER,
  USAGE_HEADER,
  EXAMPLES_HEADER,
  OPTIONS_HEADER,
  SEE_ALSO_HEADER,
} from './help-constants.js';
import { HelpOption } from './help-system.js';

/**
 * Format options for display
 * @param {HelpOption[]} options - Array of help options to format
 * @returns {HelpOption[]): string} Formatted options string
 */
export function formatOptions(options: HelpOption[]): string {
  return options
    .map((option) => {
      let line = `  ${option.flags.padEnd(FLAG_PADDING)} ${option.description}`;

      if (option.defaultValue !== undefined) {
        line += ` (default: ${option.defaultValue})`;
      }

      if (option.choices) {
        line += `\n${' '.repeat(CHOICE_PADDING)}Choices: ${option.choices.join(', ')}`;
      }

      return line;
    })
    .join('\n');
}

/**
 * Format unknown command error message
 * @param {unknown} commandName - Name of the unknown command
 * @param {unknown} availableCommands - Array of available command names
 * @returns {string} Formatted error message
 */
export function formatUnknownCommandError(
  commandName: string,
  availableCommands: string[]
): string {
  const message = UNKNOWN_COMMAND_MESSAGE.replace('{{command}}', commandName);
  const available = AVAILABLE_COMMANDS_MESSAGE.replace(
    '{{commands}}',
    availableCommands.join(', ')
  );
  return `${message}\n${available}`;
}

/**
 * Format unknown topic error message
 * @param {string} topicName - Name of the unknown topic
 * @param {string[]} availableTopics - Array of available topic names
 * @returns { string} Formatted error message
 */
export function formatUnknownTopicError(topicName: string, availableTopics: string[]): string {
  const message = UNKNOWN_TOPIC_MESSAGE.replace('{{topic}}', topicName);
  const available = AVAILABLE_TOPICS_MESSAGE.replace('{{topics}}', availableTopics.join(', '));
  return `${message}\n${available}`;
}

/**
 * Format command help output
 * @param {{ name: string; description: string; usage: string; examples: string[]; options: Array<{ name: string; description: string; type: string; required?: boolean }>; subcommands: Array<{ name: string; description: string }> }} command - Command object to format
 * @param {string} command.name - Command name
 * @param {string} command.description - Command description
 * @param {string} command.usage - Command usage string
 * @param {string[]} command.examples - Command examples
 * @param {Array<{ name: string; description: string; type: string; required?: boolean }>} command.options - Command options
 * @param {Array<{ name: string; description: string }>} command.subcommands - Command subcommands
 * @returns {string} Formatted command help string
 */
export function formatCommandHelp(command: {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  options: HelpOption[];
  subcommands?: string[];
}): string {
  let output = COMMAND_HELP_TEMPLATE.replace('{{COMMAND_NAME}}', command.name.toUpperCase())
    .replace('{{DESCRIPTION}}', command.description)
    .replace('{{USAGE}}', command.usage)
    .replace('{{EXAMPLES}}', command.examples.map((example) => `  ${example}`).join('\n'))
    .replace('{{OPTIONS}}', formatOptions(command.options));

  if (command.subcommands && command.subcommands.length > 0) {
    output += `${SUBCOMMANDS_HEADER}${command.subcommands.join(', ')}`;
  }

  return output.trim();
}

/**
 * Format topic help output
 * @param {{ name: string; description: string; usage?: string; examples?: string[]; options?: HelpOption[]; seeAlso?: string[] }} topic - Topic object to format
 * @param {string} topic.name - Topic name
 * @param {string} topic.description - Topic description
 * @param {string} topic.usage - Topic usage string
 * @param {string[]} topic.examples - Topic examples
 * @param {HelpOption[]} topic.options - Topic options
 * @param {string[]} topic.seeAlso - Related topics
 * @returns {string} Formatted topic help string
 */
export function formatTopicHelp(topic: {
  name: string;
  description: string;
  usage?: string;
  examples?: string[];
  options?: HelpOption[];
  seeAlso?: string[];
}): string {
  let output = TOPIC_HELP_HEADER.replace('{{TOPIC_NAME}}', topic.name.toUpperCase()).replace(
    '{{DESCRIPTION}}',
    topic.description
  );

  if (topic.usage) {
    output += `${USAGE_HEADER}${topic.usage}`;
  }

  if (topic.examples && topic.examples.length > 0) {
    const formattedExamples = topic.examples.map((example) => `  ${example}`).join('\n');
    output += `${EXAMPLES_HEADER}${formattedExamples}`;
  }

  if (topic.options && topic.options.length > 0) {
    output += `${OPTIONS_HEADER}${formatOptions(topic.options)}`;
  }

  if (topic.seeAlso && topic.seeAlso.length > 0) {
    output += `${SEE_ALSO_HEADER}${topic.seeAlso.join(', ')}`;
  }

  return output;
}

/**
 * Format topics list for display
 * @param {Map<string} topics - Map of topics to format
 * @returns {Map<string,} Formatted topics list string
 */
export function formatTopicsList(topics: Map<string, { description: string }>): string {
  const sortedTopics = Array.from(topics.entries()).sort(([a], [b]) => a.localeCompare(b));

  let output = '\n📚 Available Help Topics:\n';

  for (const [name, topic] of sortedTopics) {
    output += `  ${name.padEnd(PADDING_LENGTH)} - ${topic.description}\n`;
  }

  output += '\nGet help: nimata help [TOPIC]';

  return output;
}
