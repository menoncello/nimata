/**
 * Prompt command - Generate AI assistant prompt files
 *
 * Story 1.1: Stub implementation
 * Full implementation in Story 1.9: AI Rules Library & CLAUDE.md Generator
 */
import pc from 'picocolors';
import { container } from 'tsyringe';
import type { CommandModule } from 'yargs';
import type { OutputWriter } from '../output.js';

interface PromptCommandArgs {
  config?: string;
  output?: string;
}

export const promptCommand: CommandModule<Record<string, never>, PromptCommandArgs> = {
  command: 'prompt',
  describe: 'Generate AI assistant prompt files (CLAUDE.md, etc.)',
  builder: (yargs) => {
    return yargs
      .option('config', {
        type: 'string',
        description: 'Path to custom configuration file',
        alias: 'c',
      })
      .option('output', {
        type: 'string',
        description: 'Output directory for generated prompt files',
        alias: 'o',
      });
  },
  handler: (argv) => {
    const output = container.resolve<OutputWriter>('OutputWriter');
    output.log(pc.yellow('prompt command: Not implemented yet'));
    output.log(pc.dim('This command will be implemented in Story 1.9: AI Rules Library'));

    if (argv.config) {
      output.log(pc.dim(`Config file: ${argv.config}`));
    }

    if (argv.output) {
      output.log(pc.dim(`Output directory: ${argv.output}`));
    }

    // Exit code 0 (success) - stub execution is successful
    process.exit(0);
  },
};
