/**
 * Project Wizard Implementation
 *
 * Interactive CLI wizard for collecting project configuration
 */
import pc from 'picocolors';
import { DISPLAY } from '../utils/constants.js';
import {
  WizardStep,
  promptForStep,
  validateStepInput,
  createErrorMessage,
} from './wizard-prompts.js';
import {
  createTargetDirectoryStep,
  createProjectNameStep,
  createProjectDescriptionStep,
  createQualityLevelStep,
  createProjectTypeStep,
  createAIAssistantsStep,
  createAuthorStep,
  createLicenseStep,
} from './wizard-steps.js';
import {
  validateRequiredFields,
  validateOptionalFields,
  ProjectConfig,
  ValidationResult,
} from './wizard-validators.js';

// Re-export types for external use
export type { ProjectConfig, ValidationResult } from './wizard-validators.js';

export interface ProjectWizard {
  run: (config?: Partial<ProjectConfig>) => Promise<ProjectConfig>;
  addStep: (step: WizardStep) => void;
  validate: (config: Partial<ProjectConfig>) => ValidationResult;
  getSteps: () => WizardStep[];
  getStep: (stepId: string) => WizardStep | undefined;
  reset: () => void;
}

/**
 * Implementation of the project configuration wizard
 */
export class ProjectWizardImplementation implements ProjectWizard {
  private steps: WizardStep[] = [];
  private currentConfig: Partial<ProjectConfig> = {};

  /**
   * Initialize the project wizard with default steps
   */
  constructor() {
    this.initializeDefaultSteps();
  }

  /**
   * Run the wizard and collect project configuration
   * @param config - Optional initial configuration to start with
   * @returns Complete project configuration after user interaction
   */
  async run(config?: Partial<ProjectConfig>): Promise<ProjectConfig> {
    this.currentConfig = { ...config };

    console.log('\n🚀 Nìmata Project Generator\n');
    console.log("Let's create your new TypeScript project!\n");

    // Run through each step
    for (const step of this.steps) {
      // Skip step if condition is not met
      if (step.condition && !step.condition(this.currentConfig)) {
        continue;
      }

      await this.executeStep(step);
    }

    const finalConfig = this.currentConfig as ProjectConfig;

    // Display summary
    this.displaySummary(finalConfig);

    return finalConfig;
  }

  /**
   * Add a wizard step to the configuration flow
   * @param step - The wizard step configuration to add to the flow
   */
  addStep(step: WizardStep): void {
    this.steps.push(step);
  }

  /**
   * Validate the complete project configuration
   * @param config - Partial project configuration to validate
   * @returns Validation result with any errors
   */
  validate(config: Partial<ProjectConfig>): ValidationResult {
    const requiredValidation = validateRequiredFields(config);
    const optionalValidation = validateOptionalFields(config);

    const allErrors = [...requiredValidation.errors, ...optionalValidation.errors];

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Get all wizard steps
   * @returns Array of all configured wizard steps
   */
  getSteps(): WizardStep[] {
    return [...this.steps];
  }

  /**
   * Get a specific wizard step by ID
   * @param stepId - The unique identifier of the step to retrieve
   * @returns The wizard step configuration or undefined if not found
   */
  getStep(stepId: string): WizardStep | undefined {
    return this.steps.find((step) => step.id === stepId);
  }

  /**
   * Reset the wizard state and clear current configuration
   */
  reset(): void {
    this.currentConfig = {};
  }

  /**
   * Initialize default wizard steps for project configuration
   */
  private initializeDefaultSteps(): void {
    this.addStep(createTargetDirectoryStep());
    this.addStep(createProjectNameStep());
    this.addStep(createProjectDescriptionStep());
    this.addStep(createQualityLevelStep());
    this.addStep(createProjectTypeStep());
    this.addStep(createAIAssistantsStep());
    this.addStep(createAuthorStep());
    this.addStep(createLicenseStep());
  }

  /**
   * Execute a wizard step and collect user input
   * @param step - The wizard step to execute
   */
  private async executeStep(step: WizardStep): Promise<void> {
    while (true) {
      try {
        // Evaluate defaultValue if it's a function
        const evaluatedStep = { ...step };
        if (typeof step.defaultValue === 'function') {
          evaluatedStep.defaultValue = step.defaultValue(this.currentConfig);
        }

        const value = await promptForStep(evaluatedStep);
        const validationResult = validateStepInput(step, value);

        if (!validationResult.valid) {
          this.displayValidationErrors(validationResult.errors);
          continue;
        }

        // Store the value
        (this.currentConfig as Record<string, unknown>)[step.id] = value;
        break;
      } catch (error: unknown) {
        this.displayExecutionError(error);
      }
    }
  }

  /**
   * Display validation errors to user
   * @param errors - Array of validation errors
   */
  private displayValidationErrors(errors: string[]): void {
    console.log(pc.red(`\n❌ ${errors.join(', ')}`));
    console.log(pc.gray('Please try again.\n'));
  }

  /**
   * Display execution error to user
   * @param error - Error that occurred
   */
  private displayExecutionError(error: unknown): void {
    console.log(pc.red(`\n❌ Error: ${createErrorMessage(error)}`));
    console.log(pc.gray('Please try again.\n'));
  }

  /**
   * Display project configuration summary
   * @param config - The complete project configuration to display
   */
  private displaySummary(config: ProjectConfig): void {
    console.log(pc.cyan('\n✅ Project Configuration Summary:'));
    console.log(pc.gray('─'.repeat(DISPLAY.BORDER_LENGTH)));
    console.log(pc.white(`Name:        ${config.name}`));
    if (config.description) {
      console.log(pc.white(`Description: ${config.description}`));
    }
    if (config.author) {
      console.log(pc.white(`Author:      ${config.author}`));
    }
    if (config.license) {
      console.log(pc.white(`License:     ${config.license}`));
    }
    console.log(pc.white(`Quality:     ${config.qualityLevel}`));
    console.log(pc.white(`Type:        ${config.projectType}`));
    console.log(pc.white(`AI Assistants: ${config.aiAssistants.join(', ')}`));
    console.log(pc.gray('─'.repeat(DISPLAY.BORDER_LENGTH)));
    console.log(pc.green('\n🎉 Ready to generate your project!\n'));
  }
}

/**
 * Create a new project wizard instance
 * @returns New ProjectWizardImplementation instance
 */
export function createProjectWizard(): ProjectWizard {
  return new ProjectWizardImplementation();
}
