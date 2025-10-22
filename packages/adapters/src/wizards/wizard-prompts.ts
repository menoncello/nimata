/**
 * Wizard Prompt Helpers
 *
 * User input prompt logic and utilities for project wizard
 */

import { promptText, promptList, promptCheckbox, promptConfirm } from './prompt-handlers.js';
import type { WizardStep } from './validation-rules.js';

// Constants
const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

/**
 * Handle text input prompt
 * @param title - Step title
 * @param defaultValue - Default value
 * @param help - Optional help text
 * @returns User input
 */
async function handleTextStep(
  title: string,
  defaultValue?: unknown,
  help?: string
): Promise<string> {
  // Display help separately if provided, then just use title for the prompt
  if (help) {
    console.log(help);
  }
  return promptText(title, defaultValue as string);
}

/**
 * Handle list selection prompt
 * @param title - Step title
 * @param step - Wizard step with options
 * @returns Selected value
 */
async function handleListStep(title: string, step: WizardStep): Promise<unknown> {
  if (!step.options) {
    throw new Error(`List step "${step.id}" requires options`);
  }
  return promptList(title, step.options, step.defaultValue);
}

/**
 * Handle checkbox selection prompt
 * @param title - Step title
 * @param step - Wizard step with options
 * @returns Array of selected values
 */
async function handleCheckboxStep(title: string, step: WizardStep): Promise<unknown[]> {
  if (!step.options) {
    throw new Error(`Checkbox step "${step.id}" requires options`);
  }
  return promptCheckbox(title, step.options, step.defaultValue as string[]);
}

/**
 * Handle confirmation prompt
 * @param title - Step title
 * @param defaultValue - Default value
 * @returns Boolean confirmation
 */
async function handleConfirmStep(title: string, defaultValue?: unknown): Promise<boolean> {
  return promptConfirm(title, defaultValue as boolean);
}

/**
 * Prompt user for input based on step type
 * @param step - The wizard step to prompt for
 * @returns User input value
 */
export async function promptForStep(step: WizardStep): Promise<unknown> {
  switch (step.type) {
    case 'text':
      return handleTextStep(step.title, step.defaultValue, step.help);
    case 'list':
      return handleListStep(step.title, step);
    case 'checkbox':
      return handleCheckboxStep(step.title, step);
    case 'confirm':
      return handleConfirmStep(step.title, step.defaultValue);
    default:
      throw new Error(`Unsupported step type: ${step.type}`);
  }
}

// Re-export validation functions and types for backward compatibility
export { validateStepInput } from './validation-rules.js';
export type { ValidationResult, WizardStep } from './validation-rules.js';

/**
 * Create error message from error object
 * @param error - Error object
 * @returns Error message string
 */
export function createErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE;
}
