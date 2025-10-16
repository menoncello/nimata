/**
 * Init command - Interactive scaffolding wizard
 *
 * Story 1.1: Stub implementation
 * Full implementation in later stories (Story 1.3: Interactive Wizard)
 */
import pc from 'picocolors';
import { container } from 'tsyringe';
import type { CommandModule } from 'yargs';
import type { OutputWriter } from '../output.js';

interface InitCommandArgs {
  config?: string;
}

export const initCommand: CommandModule<Record<string, never>, InitCommandArgs> = {
  command: 'init',
  describe: 'Initialize a new TypeScript project with opinionated scaffolding',
  builder: (yargs) => {
    return yargs.option('config', {
      type: 'string',
      description: 'Path to custom configuration file',
      alias: 'c',
    });
  },
  handler: (argv) => {
    const output = container.resolve<OutputWriter>('OutputWriter');
    output.log(pc.yellow('init command: Not implemented yet'));
    output.log(pc.dim('This command will be implemented in Story 1.3: Interactive Wizard'));

    if (argv.config) {
      output.log(pc.dim(`Config file: ${argv.config}`));
    }

    // Exit code 0 (success) - stub execution is successful
    process.exit(0);
  },
};
