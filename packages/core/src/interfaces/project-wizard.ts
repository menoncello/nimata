/**
 * Project Wizard Interface
 *
 * Interface for interactive project configuration collection
 */
import type { ProjectConfig, WizardStep, ValidationResult } from '../types/project-config.js';

export interface ProjectWizard {
  /**
   * Run the interactive wizard
   * @param config - Optional partial configuration to start with
   * @returns Complete project configuration
   */
  run: (config?: Partial<ProjectConfig>) => Promise<ProjectConfig>;

  /**
   * Add a step to the wizard
   * @param step - Wizard step definition
   */
  addStep: (step: WizardStep) => void;

  /**
   * Validate configuration
   * @param config - Project configuration to validate
   * @returns Validation result
   */
  validate: (config: Partial<ProjectConfig>) => ValidationResult;

  /**
   * Get all wizard steps
   * @returns Array of wizard steps
   */
  getSteps: () => WizardStep[];

  /**
   * Get step by ID
   * @param stepId - Step identifier
   * @returns Wizard step or undefined
   */
  getStep: (stepId: string) => WizardStep | undefined;

  /**
   * Reset wizard to initial state
   */
  reset: () => void;
}
