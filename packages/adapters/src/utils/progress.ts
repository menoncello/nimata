/**
 * Progress Indicator Utility
 *
 * Provides visual progress feedback for CLI operations
 */

import { FORMATTING } from './constants.js';

// Constants for progress timing and display
const UPDATE_THROTTLE_MS = 50;
const DEFAULT_WIDTH = 40;
const SPINNER_INTERVAL_MS = 100;
const MILLISECOND_IN_SECOND = 1000;
const SECOND_IN_MINUTE = 60;
const MILLISECOND_IN_MINUTE = MILLISECOND_IN_SECOND * SECOND_IN_MINUTE;
const DEFAULT_TERMINAL_WIDTH = 80;
const PERCENTAGE_MULTIPLIER = 100;

export interface ProgressOptions {
  total: number;
  width?: number;
  showPercentage?: boolean;
  showTime?: boolean;
  label?: string;
}

export interface ProgressStep {
  name: string;
  weight?: number;
}

/**
 * Progress Indicator Class
 */
export class ProgressIndicator {
  private current = 0;
  private total: number;
  private width: number;
  private showPercentage: boolean;
  private showTime: boolean;
  private label: string;
  private startTime: number;
  private lastUpdate = 0;
  private isActive = false;

  /**
   * Create a new progress indicator
   * @param options - Progress configuration options
   */
  constructor(options: ProgressOptions) {
    this.total = options.total;
    this.width = options.width || DEFAULT_WIDTH;
    this.showPercentage = options.showPercentage !== false;
    this.showTime = options.showTime !== false;
    this.label = options.label || '';
    this.startTime = Date.now();
  }

  /**
   * Start the progress indicator
   */
  start(): void {
    this.isActive = true;
    this.render();
  }

  /**
   * Update progress
   * @param value - Current progress value
   * @param message - Optional progress message
   */
  update(value: number, message?: string): void {
    if (!this.isActive) return;

    this.current = Math.min(value, this.total);
    this.render(message);
  }

  /**
   * Increment progress by 1
   * @param message - Optional progress message
   */
  increment(message?: string): void {
    if (!this.isActive) return;

    this.current = Math.min(this.current + 1, this.total);
    this.render(message);
  }

  /**
   * Complete the progress indicator
   * @param message - Optional completion message
   */
  complete(message?: string): void {
    if (!this.isActive) return;

    this.current = this.total;
    this.render(message);
    console.log(); // New line after completion
    this.isActive = false;
  }

  /**
   * Stop the progress indicator
   */
  stop(): void {
    if (!this.isActive) return;

    this.isActive = false;
    console.log(); // Clear the line
  }

  /**
   * Render the progress bar
   * @param message - Optional progress message
   */
  private render(message?: string): void {
    const now = Date.now();

    if (this.shouldSkipUpdate(now)) {
      return;
    }

    this.lastUpdate = now;
    const display = this.buildDisplayString(now, message);
    this.renderToTerminal(display);
  }

  /**
   * Check if render should be skipped based on throttling
   * @param now - Current timestamp
   * @returns Whether to skip the update
   */
  private shouldSkipUpdate(now: number): boolean {
    return now - this.lastUpdate < UPDATE_THROTTLE_MS && this.current < this.total;
  }

  /**
   * Build the complete display string
   * @param now - Current timestamp
   * @param message - Optional progress message
   * @returns Complete display string
   */
  private buildDisplayString(now: number, message?: string): string {
    const progressData = this.calculateProgress();
    const bar = this.buildProgressBar(progressData.filled, progressData.empty);
    let display = this.buildLabelString();

    display += `[${bar}]`;
    display += this.buildPercentageString(progressData.percentage);
    display += this.buildTimeString(now);
    display += this.buildMessageString(message);

    return display;
  }

  /**
   * Calculate progress metrics
   * @returns Progress data object
   */
  private calculateProgress(): { percentage: number; filled: number; empty: number } {
    const percentage = Math.round((this.current / this.total) * PERCENTAGE_MULTIPLIER);
    const filled = Math.round((this.current / this.total) * this.width);
    const empty = this.width - filled;

    return { percentage, filled, empty };
  }

  /**
   * Build progress bar string
   * @param filled - Number of filled characters
   * @param empty - Number of empty characters
   * @returns Progress bar string
   */
  private buildProgressBar(filled: number, empty: number): string {
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * Build label string if label exists
   * @returns Label string or empty string
   */
  private buildLabelString(): string {
    return this.label ? `${this.label} ` : '';
  }

  /**
   * Build percentage string if enabled
   * @param percentage - Progress percentage
   * @returns Percentage string or empty string
   */
  private buildPercentageString(percentage: number): string {
    return this.showPercentage ? ` ${percentage}%` : '';
  }

  /**
   * Build time string if enabled
   * @param now - Current timestamp
   * @returns Time string or empty string
   */
  private buildTimeString(now: number): string {
    if (!this.showTime) return '';
    const elapsed = now - this.startTime;
    return ` (${this.formatTime(elapsed)})`;
  }

  /**
   * Build message string if provided
   * @param message - Optional message
   * @returns Message string or empty string
   */
  private buildMessageString(message?: string): string {
    return message ? ` - ${message}` : '';
  }

  /**
   * Render display string to terminal
   * @param display - Display string to render
   */
  private renderToTerminal(display: string): void {
    process.stdout.write(`\r${' '.repeat(process.stdout.columns || DEFAULT_TERMINAL_WIDTH)}\r`);
    process.stdout.write(display);
  }

  /**
   * Format time in human readable format
   * @param ms - Time in milliseconds
   * @returns Formatted time string
   */
  private formatTime(ms: number): string {
    if (ms < MILLISECOND_IN_SECOND) {
      return `${ms}ms`;
    } else if (ms < MILLISECOND_IN_MINUTE) {
      return `${(ms / MILLISECOND_IN_SECOND).toFixed(1)}s`;
    }
    const minutes = Math.floor(ms / MILLISECOND_IN_MINUTE);
    const seconds = Math.floor((ms % MILLISECOND_IN_MINUTE) / MILLISECOND_IN_SECOND);
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Multi-step Progress Indicator
 */
export class StepProgressIndicator {
  private steps: ProgressStep[];
  private currentStep = 0;
  private currentProgress: ProgressIndicator | null = null;
  private label: string;

  /**
   * Create a new multi-step progress indicator
   * @param steps - Array of progress steps
   * @param label - Optional label for the progress
   */
  constructor(steps: ProgressStep[], label?: string) {
    this.steps = steps;
    this.label = label || 'Progress';
  }

  /**
   * Start the step progress
   * @param steps - Optional steps array to override default
   * @param label - Optional label to override default
   */
  start(steps?: unknown[], label?: string): void {
    if (steps) {
      this.steps = steps as ProgressStep[];
    }
    if (label) {
      this.label = label;
    }
    this.currentStep = 0;
    this.nextStep();
  }

  /**
   * Move to next step
   */
  nextStep(): void {
    if (this.currentProgress) {
      this.currentProgress.complete();
    }

    if (this.currentStep >= this.steps.length) {
      return;
    }

    const step = this.steps[this.currentStep];
    if (!step) return;
    const weight = step.weight || 1;

    this.currentProgress = new ProgressIndicator({
      total: weight,
      label: `(${this.currentStep + 1}/${this.steps.length}) ${step.name}`,
      showPercentage: true,
      showTime: true,
    });

    this.currentProgress.start();
    this.currentStep++;
  }

  /**
   * Update current step progress
   * @param value - Progress value
   * @param message - Optional progress message
   */
  update(value: number, message?: string): void {
    if (this.currentProgress) {
      this.currentProgress.update(value, message);
    }
  }

  /**
   * Increment current step progress
   * @param message - Optional progress message
   */
  increment(message?: string): void {
    if (this.currentProgress) {
      this.currentProgress.increment(message);
    }
  }

  /**
   * Complete all steps
   * @param message - Optional completion message
   */
  complete(message?: string): void {
    if (this.currentProgress) {
      this.currentProgress.complete();
    }
    if (message) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`✅ ${this.label} completed!`);
    }
  }

  /**
   * Show error and stop
   * @param message - Optional error message
   */
  error(message?: string): void {
    if (this.currentProgress) {
      this.currentProgress.stop();
    }
    if (message) {
      console.log(`❌ ${message}`);
    } else {
      console.log(`❌ ${this.label} failed!`);
    }
  }

  /**
   * Show failure and stop (alias for error)
   * @param message - Optional error message
   */
  fail(message?: string): void {
    this.error(message);
  }

  /**
   * Show next step message
   * @param message - Optional next step message
   */
  next(message?: string): void {
    if (message && this.currentProgress) {
      this.currentProgress.update(1, message);
    }
  }

  /**
   * Stop the progress indicator
   */
  stop(): void {
    if (this.currentProgress) {
      this.currentProgress.stop();
    }
  }
}

/**
 * Spinner for indeterminate progress
 */
export class Spinner {
  private frames: string[] = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval: NodeJS.Timeout | null = null;
  private message: string;
  private isActive = false;

  /**
   * Create a new spinner
   * @param message - Optional spinner message
   */
  constructor(message = 'Working...') {
    this.message = message;
  }

  /**
   * Start the spinner
   */
  start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.interval = setInterval(() => {
      this.render();
    }, SPINNER_INTERVAL_MS);
  }

  /**
   * Stop the spinner
   * @param finalMessage - Optional final message to display
   */
  stop(finalMessage?: string): void {
    if (!this.isActive) return;

    this.isActive = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Clear the spinner line
    process.stdout.write(`\r${' '.repeat(process.stdout.columns || DEFAULT_TERMINAL_WIDTH)}\r`);

    if (finalMessage) {
      console.log(finalMessage);
    }
  }

  /**
   * Update spinner message
   * @param message - New spinner message
   */
  updateMessage(message: string): void {
    this.message = message;
  }

  /**
   * Render the spinner
   */
  private render(): void {
    const frame = this.frames[this.currentFrame];
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;

    process.stdout.write(`\r${frame} ${this.message}`);
  }
}

/**
 * Utility functions
 */
export const Progress = {
  /**
   * Create a simple progress indicator
   * @param options - Progress configuration options
   * @returns New progress indicator instance
   */
  create: (options: ProgressOptions): ProgressIndicator => {
    return new ProgressIndicator(options);
  },

  /**
   * Create a multi-step progress indicator
   * @param steps - Array of progress steps
   * @param label - Optional label for the progress
   * @returns New step progress indicator instance
   */
  steps: (steps: ProgressStep[], label?: string): StepProgressIndicator => {
    return new StepProgressIndicator(steps, label);
  },

  /**
   * Create a spinner
   * @param message - Optional spinner message
   * @returns New spinner instance
   */
  spinner: (message?: string): Spinner => {
    return new Spinner(message);
  },
};

/**
 * Default step definitions for project generation
 */
export const PROJECT_GENERATION_STEPS: ProgressStep[] = [
  { name: 'Validating configuration', weight: 1 },
  { name: 'Creating directory structure', weight: FORMATTING.JSON_INDENT_SIZE },
  { name: 'Generating package.json', weight: 1 },
  { name: 'Setting up TypeScript', weight: FORMATTING.JSON_INDENT_SIZE },
  { name: 'Configuring ESLint', weight: 1 },
  { name: 'Adding Prettier', weight: 1 },
  { name: 'Setting up tests', weight: 1 },
  { name: 'Configuring AI assistants', weight: FORMATTING.JSON_INDENT_SIZE },
  { name: 'Creating source files', weight: FORMATTING.JSON_INDENT_SIZE },
  { name: 'Validating project', weight: 1 },
];
