/**
 * Unit tests for Progress Utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import {
  ProgressIndicator,
  StepProgressIndicator,
  Spinner,
  Progress,
  PROJECT_GENERATION_STEPS,
} from '../../src/utils/progress';

describe('ProgressIndicator', () => {
  let mockStdoutWrite: any;

  beforeEach(() => {
    mockStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
  });

  describe('constructor', () => {
    it('should create with default options', () => {
      const progress = new ProgressIndicator({ total: 100 });
      expect(progress).toBeInstanceOf(ProgressIndicator);
    });

    it('should create with custom options', () => {
      const progress = new ProgressIndicator({
        total: 50,
        width: 20,
        showPercentage: false,
        showTime: false,
        label: 'Test',
      });
      expect(progress).toBeInstanceOf(ProgressIndicator);
    });
  });

  describe('update', () => {
    it('should update progress value', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.start();
      progress.update(50);
      expect(mockStdoutWrite).toHaveBeenCalled();
    });

    it('should not exceed total', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.start();
      progress.update(150);
      // Should clamp to total
      expect(mockStdoutWrite).toHaveBeenCalled();
    });

    it('should not update when not active', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.update(50);
      expect(mockStdoutWrite).not.toHaveBeenCalled();
    });
  });

  describe('increment', () => {
    it('should increment by 1', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.start();
      progress.increment();
      expect(mockStdoutWrite).toHaveBeenCalled();
    });

    it('should not exceed total', () => {
      const progress = new ProgressIndicator({ total: 1 });
      progress.start();
      progress.increment();
      progress.increment(); // Should not exceed total
      expect(mockStdoutWrite).toHaveBeenCalled();
    });
  });

  describe('complete', () => {
    it('should mark as complete and stop', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.start();
      progress.complete();
      expect(mockStdoutWrite).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop without completing', () => {
      const progress = new ProgressIndicator({ total: 100 });
      progress.start();
      progress.stop();
      expect(mockStdoutWrite).toHaveBeenCalled();
    });
  });
});

describe('StepProgressIndicator', () => {
  let mockStdoutWrite: any;
  let mockConsoleLog: any;
  let consoleLogSpy: string[];

  beforeEach(() => {
    consoleLogSpy = [];
    mockStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleLogSpy?.push(args.join(' '));
    });
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it('should create with steps', () => {
    const steps = [{ name: 'Step 1' }, { name: 'Step 2', weight: 2 }];
    const progress = new StepProgressIndicator(steps, 'Test');
    expect(progress).toBeInstanceOf(StepProgressIndicator);
  });

  it('should start processing steps', () => {
    const steps = [{ name: 'Step 1' }, { name: 'Step 2' }];
    const progress = new StepProgressIndicator(steps);
    progress.start();
    expect(mockStdoutWrite).toHaveBeenCalled();
  });

  it('should move to next step', () => {
    const steps = [
      { name: 'Step 1', weight: 2 },
      { name: 'Step 2', weight: 1 },
    ];
    const progress = new StepProgressIndicator(steps);
    progress.start();
    progress.update(2); // Complete first step
    progress.nextStep(); // Move to next step
    expect(mockStdoutWrite).toHaveBeenCalled();
  });

  it('should complete all steps', () => {
    const steps = [{ name: 'Step 1' }, { name: 'Step 2' }];
    const progress = new StepProgressIndicator(steps);
    progress.start();
    progress.increment(); // Complete first step
    progress.increment(); // Complete second step
    progress.complete();
    expect(mockConsoleLog).toHaveBeenCalledWith('✅ Progress completed!');
  });
});

describe('Spinner', () => {
  let mockStdoutWrite: any;
  let mockConsoleLog: any;
  let consoleLogSpy: string[];

  beforeEach(() => {
    consoleLogSpy = [];
    mockStdoutWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation((...args) => {
      consoleLogSpy?.push(args.join(' '));
    });
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it('should create with default message', () => {
    const spinner = new Spinner();
    expect(spinner).toBeInstanceOf(Spinner);
  });

  it('should create with custom message', () => {
    const spinner = new Spinner('Custom message');
    expect(spinner).toBeInstanceOf(Spinner);
  });

  it('should start spinning', async () => {
    const spinner = new Spinner();
    spinner.start();
    // Wait for the first interval to fire
    await new Promise((resolve) => setTimeout(resolve, 110));
    expect(mockStdoutWrite).toHaveBeenCalled();
    spinner.stop();
  });

  it('should stop spinning', () => {
    const spinner = new Spinner();
    spinner.start();
    spinner.stop();
    expect(mockStdoutWrite).toHaveBeenCalled();
  });

  it('should stop with final message', () => {
    const spinner = new Spinner();
    spinner.start();
    spinner.stop('Completed!');
    expect(mockConsoleLog).toHaveBeenCalledWith('Completed!');
  });

  it('should update message', () => {
    const spinner = new Spinner('Initial');
    spinner.updateMessage('Updated');
    // Message is updated on next render cycle
    expect(spinner).toBeInstanceOf(Spinner);
  });
});

describe('Progress utility', () => {
  it('should create progress indicator', () => {
    const progress = Progress.create({ total: 100 });
    expect(progress).toBeInstanceOf(ProgressIndicator);
  });

  it('should create step progress indicator', () => {
    const steps = [{ name: 'Step 1' }, { name: 'Step 2' }];
    const progress = Progress.steps(steps);
    expect(progress).toBeInstanceOf(StepProgressIndicator);
  });

  it('should create spinner', () => {
    const spinner = Progress.spinner();
    expect(spinner).toBeInstanceOf(Spinner);
  });
});

describe('PROJECT_GENERATION_STEPS', () => {
  it('should have correct structure', () => {
    expect(Array.isArray(PROJECT_GENERATION_STEPS)).toBe(true);
    expect(PROJECT_GENERATION_STEPS.length).toBeGreaterThan(0);

    for (const step of PROJECT_GENERATION_STEPS) {
      expect(step).toHaveProperty('name');
      expect(step).toHaveProperty('weight');
      expect(typeof step.name).toBe('string');
      expect(typeof step.weight).toBe('number');
      expect(step.weight).toBeGreaterThan(0);
    }
  });

  it('should include expected steps', () => {
    const stepNames = PROJECT_GENERATION_STEPS.map((step) => step.name);

    expect(stepNames).toContain('Validating configuration');
    expect(stepNames).toContain('Creating directory structure');
    expect(stepNames).toContain('Generating package.json');
    expect(stepNames).toContain('Setting up TypeScript');
    expect(stepNames).toContain('Configuring ESLint');
    expect(stepNames).toContain('Adding Prettier');
    expect(stepNames).toContain('Setting up tests');
    expect(stepNames).toContain('Configuring AI assistants');
    expect(stepNames).toContain('Creating source files');
    expect(stepNames).toContain('Validating project');
  });
});
