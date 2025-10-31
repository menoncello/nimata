/**
 * Wizard prompt handlers using @inquirer/prompts
 */

import checkbox from '@inquirer/checkbox';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';
import select from '@inquirer/select';

/** Exit code for SIGINT (Ctrl+C) */
const SIGINT_EXIT_CODE = 130;

/**
 * Handle SIGINT gracefully for prompts
 * @param {...any} promptFunction - The prompt function to wrap
 * @returns {Function} Wrapped prompt function with SIGINT handling
 */
function withSigIntHandling<T extends unknown[], R>(
  promptFunction: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await promptFunction(...args);
    } catch (error) {
      // Check if error is from SIGINT
      if (
        error instanceof Error &&
        (error.message.includes('SIGINT') ||
          error.message.includes('User force closed') ||
          error.name === 'ExitPromptError')
      ) {
        process.exit(SIGINT_EXIT_CODE);
      }
      throw error;
    }
  };
}

/**
 * Prompt user for text input
 * @param {string} message - The prompt message to display
 * @param {string} defaultValue - Default value if user provides empty input
 * @returns {Promise<string>} User input text
 */
export const promptText = withSigIntHandling(
  async (message: string, defaultValue?: string): Promise<string> => {
    return input({
      message,
      default: defaultValue,
    });
  }
);

/**
 * Prompt user to select from a list of options
 * @param {string} message - The prompt message to display
 * @param {Array<{label: string}>} options - Array of options with labels and values
 * @param {unknown} defaultValue - Default selected option
 * @returns {Promise<unknown>} Selected option value
 */
export const promptList = withSigIntHandling(
  async (
    message: string,
    options: Array<{ label: string; value: unknown; description?: string }>,
    defaultValue?: unknown
  ): Promise<unknown> => {
    return select({
      message,
      choices: options.map((opt) => ({
        name: opt.label,
        value: opt.value,
        description: opt.description,
      })),
      default: defaultValue,
    });
  }
);

/**
 * Prompt user to select multiple options from a list
 * @param {string} message - The prompt message to display
 * @param {Array<{label: string}>} options - Array of options with labels and values
 * @param {string[]} defaultValues - Default selected values
 * @returns {Promise<unknown[]>} Array of selected option values
 */
export const promptCheckbox = withSigIntHandling(
  async (
    message: string,
    options: Array<{ label: string; value: unknown; description?: string }>,
    defaultValues: string[] = []
  ): Promise<unknown[]> => {
    return checkbox({
      message,
      choices: options.map((opt) => ({
        name: opt.label,
        value: opt.value,
        description: opt.description,
        checked: defaultValues.includes(opt.value as string),
      })),
    });
  }
);

/**
 * Prompt user for yes/no confirmation
 * @param {string} message - The confirmation prompt message
 * @param {boolean} defaultValue - Default value if user provides empty input
 * @returns {Promise<boolean>} True if user confirms, false otherwise
 */
export const promptConfirm = withSigIntHandling(
  async (message: string, defaultValue = true): Promise<boolean> => {
    return confirm({
      message,
      default: defaultValue as boolean,
    });
  }
);
