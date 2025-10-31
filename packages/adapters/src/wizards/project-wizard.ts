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

/**
 * Simple output writer to avoid console statements
 */
class OutputWriter {
  /**
   * Write message to stdout
   * @param {string} message - Message to write
   */
  static write(message: string): void {
    process.stdout.write(message);
  }

  /**
   * Write error message to stderr
   * @param {string} message - Error message to write
   */
  static writeError(message: string): void {
    process.stderr.write(message);
  }

  /**
   * Write message with newline
   * @param {string} message - Message to write
   */
  static writeln(message = ''): void {
    process.stdout.write(`${message}\n`);
  }

  /**
   * Write error message with newline
   * @param {string} message - Error message to write
   */
  static writelnError(message: string): void {
    process.stderr.write(`${message}\n`);
  }
}

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
   * @param {unknown} config - Optional initial configuration to start with
   * @returns {void} Complete project configuration after user interaction
   */
  async run(config?: Partial<ProjectConfig>): Promise<ProjectConfig> {
    this.currentConfig = { ...config };

    OutputWriter.writeln('\n🚀 Nìmata Project Generator\n');
    OutputWriter.writeln("Let's create your new TypeScript project!\n");

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
   * @param {WizardStep} step - The wizard step configuration to add to the flow
   */
  addStep(step: WizardStep): void {
    this.steps.push(step);
  }

  /**
   * Validate the complete project configuration
   * @param {Partial<ProjectConfig>} config - Partial project configuration to validate
   * @returns {ValidationResult} Validation result with any errors
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
   * @returns {WizardStep[]} Array of all configured wizard steps
   */
  getSteps(): WizardStep[] {
    return [...this.steps];
  }

  /**
   * Get a specific wizard step by ID
   * @param {string} stepId - The unique identifier of the step to retrieve
   * @returns {string): WizardStep | undefined} The wizard step configuration or undefined if not found
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
   * @param {WizardStep} step - The wizard step to execute
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
   * @param {string[]} errors - Array of validation errors
   */
  private displayValidationErrors(errors: string[]): void {
    OutputWriter.writeln(pc.red(`\n❌ ${errors.join(', ')}`));
    OutputWriter.writeln(pc.gray('Please try again.\n'));
  }

  /**
   * Display execution error to user
   * @param {unknown} error - Error that occurred
   */
  private displayExecutionError(error: unknown): void {
    OutputWriter.writeln(pc.red(`\n❌ Error: ${createErrorMessage(error)}`));
    OutputWriter.writeln(pc.gray('Please try again.\n'));
  }

  /**
   * Display project configuration summary
   * @param {ProjectConfig} config - The complete project configuration to display
   */
  private displaySummary(config: ProjectConfig): void {
    OutputWriter.writeln(pc.cyan('\n✅ Project Configuration Summary:'));
    OutputWriter.writeln(pc.gray('─'.repeat(DISPLAY.BORDER_LENGTH)));
    OutputWriter.writeln(pc.white(`Name:        ${config.name}`));
    if (config.description) {
      OutputWriter.writeln(pc.white(`Description: ${config.description}`));
    }
    if (config.author) {
      OutputWriter.writeln(pc.white(`Author:      ${config.author}`));
    }
    if (config.license) {
      OutputWriter.writeln(pc.white(`License:     ${config.license}`));
    }
    OutputWriter.writeln(pc.white(`Quality:     ${config.qualityLevel}`));
    OutputWriter.writeln(pc.white(`Type:        ${config.projectType}`));
    OutputWriter.writeln(pc.white(`AI Assistants: ${config.aiAssistants.join(', ')}`));
    OutputWriter.writeln(pc.gray('─'.repeat(DISPLAY.BORDER_LENGTH)));
    OutputWriter.writeln(pc.green('\n🎉 Ready to generate your project!\n'));
  }
}

/**
 * Create a new project wizard instance
 * @returns {ProjectWizard} New ProjectWizardImplementation instance
 */
export function createProjectWizard(): ProjectWizard {
  return new ProjectWizardImplementation();
}
