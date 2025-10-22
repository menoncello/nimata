/**
 * Help System for CLI
 *
 * Provides comprehensive help documentation and usage examples
 */

import { GENERAL_HELP_TEMPLATE } from './help-constants.js';
import { formatCommandHelp, formatTopicHelp, formatTopicsList } from './help-formatters.js';
import { createCommandHelp, createHelpTopics } from './help-topics.js';

export interface HelpTopic {
  name: string;
  description: string;
  usage?: string;
  examples?: string[];
  options?: HelpOption[];
  seeAlso?: string[];
}

export interface HelpOption {
  flags: string;
  description: string;
  defaultValue?: string;
  choices?: string[];
}

export interface CommandHelp {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  options: HelpOption[];
  subcommands?: string[];
}

/**
 * Help System Class
 */
export class HelpSystem {
  private topics: Map<string, HelpTopic>;
  private commands: Map<string, CommandHelp>;

  /**
   * Initialize HelpSystem with default topics and commands
   */
  constructor() {
    this.topics = createHelpTopics();
    this.commands = createCommandHelp();
  }

  /**
   * Show general help information
   */
  showGeneralHelp(): void {
    console.log(GENERAL_HELP_TEMPLATE.trim());
  }

  /**
   * Show help for a specific command
   * @param commandName - Name of the command to show help for
   */
  showCommandHelp(commandName: string): void {
    const command = this.commands.get(commandName);

    if (!command) {
      const availableCommands = Array.from(this.commands.keys());
      console.error(`Unknown command: ${commandName}`);
      console.log(`Available commands: ${availableCommands.join(', ')}`);
      return;
    }

    console.log(formatCommandHelp(command));
  }

  /**
   * Show help for a specific topic
   * @param topicName - Name of the topic to show help for
   */
  showTopicHelp(topicName: string): void {
    const topic = this.topics.get(topicName);

    if (!topic) {
      const availableTopics = Array.from(this.topics.keys());
      console.error(`Unknown topic: ${topicName}`);
      console.log(`Available topics: ${availableTopics.join(', ')}`);
      return;
    }

    console.log(formatTopicHelp(topic));
  }

  /**
   * Show list of available topics
   */
  showTopicsList(): void {
    console.log(formatTopicsList(this.topics));
  }

  /**
   * Show list of available commands
   */
  showCommandsList(): void {
    const commands = Array.from(this.commands.values());
    console.log('Available commands:\n');
    const COMMAND_PADDING = 12;
    for (const command of commands) {
      console.log(`  ${command.name.padEnd(COMMAND_PADDING)} ${command.description}`);
    }
    console.log('\nUse "nimata help <command>" for more information on a specific command.');
  }

  /**
   * Get all available topics
   * @returns Array of topic names
   */
  getAvailableTopics(): string[] {
    return Array.from(this.topics.keys());
  }

  /**
   * Get all available commands
   * @returns Array of command names
   */
  getAvailableCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Check if a topic exists
   * @param topicName - Name of the topic to check
   * @returns True if topic exists
   */
  hasTopic(topicName: string): boolean {
    return this.topics.has(topicName);
  }

  /**
   * Check if a command exists
   * @param commandName - Name of the command to check
   * @returns True if command exists
   */
  hasCommand(commandName: string): boolean {
    return this.commands.has(commandName);
  }

  /**
   * Alias for showTopicsList for backward compatibility
   */
  listTopics(): void {
    this.showTopicsList();
  }

  /**
   * Alias for showGeneralHelp for backward compatibility
   */
  show(): void {
    this.showGeneralHelp();
  }

  /**
   * Alias for getAvailableTopics for backward compatibility
   * @returns Array of available topic names
   */
  getTopics(): string[] {
    return this.getAvailableTopics();
  }

  /**
   * Alias for getAvailableCommands for backward compatibility
   * @returns Array of available command names
   */
  getCommands(): string[] {
    return this.getAvailableCommands();
  }
}

// Export singleton instance
export const helpSystem = new HelpSystem();

// Export convenience functions
export const Help = {
  show: (): void => helpSystem.showGeneralHelp(),
  command: (name: string): void => helpSystem.showCommandHelp(name),
  topic: (name: string): void => helpSystem.showTopicHelp(name),
  topics: (): void => helpSystem.showTopicsList(),
  getTopics: (): string[] => helpSystem.getAvailableTopics(),
  getCommands: (): string[] => helpSystem.getAvailableCommands(),
};
