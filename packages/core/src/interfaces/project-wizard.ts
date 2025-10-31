/**
 * Project Wizard Interface
 *
 * Interface for interactive project configuration collection
 */
import type { ProjectConfig, WizardStep, ValidationResult } from '../types/project-config.js';

export interface ProjectWizard {
  /**
   * Run the interactive wizard
   * @param {string} config - Optional partial configuration to start with
   * @returns {string} Complete project configuration
   */
  run: (config?: Partial<ProjectConfig>) => Promise<ProjectConfig>;

  /**
   * Add a step to the wizard
   * @param {string} step - Wizard step definition
   */
  addStep: (step: WizardStep) => void;

  /**
   * Validate configuration
   * @param {string} config - Project configuration to validate
   * @returns {string} Validation result
   */
  validate: (config: Partial<ProjectConfig>) => ValidationResult;

  /**
   * Get all wizard steps
   * @returns {string} Array of wizard steps
   */
  getSteps: () => WizardStep[];

  /**
   * Get step by ID
   * @param {string} stepId - Step identifier
   * @returns {string} Wizard step or undefined
   */
  getStep: (stepId: string) => WizardStep | undefined;

  /**
   * Reset wizard to initial state
   */
  reset: () => void;
}
