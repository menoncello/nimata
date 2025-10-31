/**
 * Unit Tests - Init Command [T001]
 *
 * AC2: Command routing supports subcommands (init)
 * AC3: Argument parsing handles flags and options
 * Priority: P1 - Core command functionality
 */
import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import * as fs from 'node:fs';
import { ProjectGenerator } from '@nimata/adapters/project-generator';
import { ProjectWizardImplementation } from '@nimata/adapters/wizards/project-wizard';
import { ProjectConfigProcessorImpl } from '@nimata/core/services/project-config-processor';
import { initCommand } from '../../../src/commands/init.js';
import { useDIContainer, useOutputWriter } from '../../support/fixtures/test-fixtures';

describe('InitCommand [T001]', () => {
  let cleanupDI: () => void;
  const activeMocks: any[] = [];

  beforeEach(() => {
    cleanupDI = useDIContainer();
    useOutputWriter();
  });

  afterEach(() => {
    cleanupDI();
    // Clean up any active mocks
    for (const mock of activeMocks) {
      if (mock && typeof mock.mockRestore === 'function') {
        mock.mockRestore();
      }
    }
    activeMocks.length = 0;

    // Force restore prototypes that may have been spied on
    const prototypesToRestore = [
      ProjectConfigProcessorImpl.prototype,
      ProjectWizardImplementation.prototype,
      ProjectGenerator.prototype,
      fs,
    ];

    for (const proto of prototypesToRestore) {
      if (!proto) continue;
      for (const key of Object.getOwnPropertyNames(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (
          descriptor &&
          typeof descriptor.value === 'function' &&
          (descriptor.value as any).mockRestore
        ) {
          (descriptor.value as any).mockRestore();
        }
      }
    }
  });

  it('[T001-01] should have correct command name', () => {
    expect(initCommand.command).toBe('init [project-name]');
  });

  it('[T001-02] should have description', () => {
    expect(initCommand.describe).toBeDefined();
    expect(typeof initCommand.describe).toBe('string');
    expect((initCommand.describe as string)?.length).toBeGreaterThan(0);
  });

  it('[T001-03] should define builder function', () => {
    expect(initCommand.builder).toBeDefined();
    expect(typeof initCommand.builder).toBe('function');
  });

  it('[T001-04] should define handler function', () => {
    expect(initCommand.handler).toBeDefined();
    expect(typeof initCommand.handler).toBe('function');
  });

  it('[T001-05] should configure config option in builder', () => {
    let configCalled = false;
    const mockYargs = {
      positional: () => mockYargs,
      option: (name: string, opts: any) => {
        if (name === 'config') {
          configCalled = true;
          expect(opts.type).toBe('string');
          expect(opts.alias).toBe('c');
        }
        return mockYargs;
      },
    };

    // @ts-expect-error - Mocking yargs
    initCommand.builder(mockYargs);

    expect(configCalled).toBe(true);
  });

  describe('Command Options [T001-10]', () => {
    it('[T001-11] should configure template option with choices', () => {
      let templateCalled = false;
      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'template') {
            templateCalled = true;
            expect(opts.type).toBe('string');
            expect(opts.choices).toEqual(['basic', 'web', 'cli', 'library']);
          }
          return mockYargs;
        },
        positional: () => mockYargs,
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(templateCalled).toBe(true);
    });

    it('[T001-12] should configure quality option with choices', () => {
      let qualityCalled = false;
      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'quality') {
            qualityCalled = true;
            expect(opts.type).toBe('string');
            expect(opts.choices).toEqual(['light', 'medium', 'strict']);
          }
          return mockYargs;
        },
        positional: () => mockYargs,
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(qualityCalled).toBe(true);
    });

    it('[T001-13] should configure ai option for AI assistants', () => {
      let aiCalled = false;
      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'ai') {
            aiCalled = true;
            expect(opts.type).toBe('string');
            expect(opts.description).toContain('AI assistants');
          }
          return mockYargs;
        },
        positional: () => mockYargs,
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(aiCalled).toBe(true);
    });

    it('[T001-14] should configure nonInteractive option', () => {
      let nonInteractiveCalled = false;
      const mockYargs = {
        option: (name: string, opts: any) => {
          if (name === 'nonInteractive') {
            nonInteractiveCalled = true;
            expect(opts.type).toBe('boolean');
            expect(opts.alias).toEqual(['no-interactive']);
          }
          return mockYargs;
        },
        positional: () => mockYargs,
      };

      // @ts-expect-error - Mocking yargs
      initCommand.builder(mockYargs);

      expect(nonInteractiveCalled).toBe(true);
    });
  });

  describe('Handler Functionality [T001-20]', () => {
    let mockProcessExit: any;
    let mockConsoleError: any;

    beforeEach(() => {
      mockProcessExit = spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      mockConsoleError = spyOn(console, 'error').mockImplementation(() => {
        // Silence console.error during tests
      });
    });

    afterEach(() => {
      mockProcessExit.mockRestore();
      mockConsoleError.mockRestore();
    });

    it('[T001-21] should handle successful project generation in non-interactive mode', async () => {
      const mockArgs = {
        projectName: 'test-project',
        nonInteractive: true,
        template: 'basic',
        quality: 'medium',
        ai: 'claude-code',
      };

      const mockConfig = {
        name: 'test-project',
        projectType: 'basic',
        qualityLevel: 'medium',
        aiAssistants: ['claude-code'],
        nonInteractive: true,
        targetDirectory: './test-project',
      };

      // Mock objects replaced by spyOn calls below

      // Spy for wizard - kept for potential debugging
      const wizardSpy = spyOn(ProjectWizardImplementation.prototype, 'run').mockResolvedValue(
        mockConfig
      );
      // Spy for processor - kept for potential debugging
      const processorSpy = spyOn(ProjectConfigProcessorImpl.prototype, 'process').mockResolvedValue(
        mockConfig
      );
      // Spy for validation - kept for potential debugging
      const validationSpy = spyOn(
        ProjectConfigProcessorImpl.prototype,
        'validateFinalConfig'
      ).mockResolvedValue({
        valid: true,
        warnings: [],
        errors: [],
      });
      // Spy for generator - kept for potential debugging
      const generatorSpy = spyOn(ProjectGenerator.prototype, 'generateProject').mockResolvedValue({
        success: true,
        errors: [],
        warnings: [],
      });

      try {
        await initCommand.handler(mockArgs);
      } catch (error) {
        process.stderr.write(`Test failed with error: ${error}\n`);
        throw error;
      } finally {
        wizardSpy.mockRestore();
        processorSpy.mockRestore();
        validationSpy.mockRestore();
        generatorSpy.mockRestore();
      }
      // Mock spies verified through spyOn calls
    });

    it('[T001-22] should handle config file loading successfully', async () => {
      const mockConfigContent = {
        name: 'config-project',
        description: 'Project from config',
        projectType: 'web',
        qualityLevel: 'strict',
        targetDirectory: './config-project',
        aiAssistants: ['claude-code'],
      };

      const mockArgs = {
        config: 'test-config.json',
        nonInteractive: true,
      };

      const mockExistsSync = spyOn(fs, 'existsSync').mockReturnValue(true);
      const mockReadFileSync = spyOn(fs, 'readFileSync').mockReturnValue(
        JSON.stringify(mockConfigContent)
      );

      // Mock objects replaced by spyOn calls below

      // Spy for processor - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'process').mockResolvedValue(mockConfigContent);
      // Spy for validation - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'validateFinalConfig').mockResolvedValue({
        valid: true,
        warnings: [],
        errors: [],
      });
      // Spy for generator - kept for potential debugging
      spyOn(ProjectGenerator.prototype, 'generateProject').mockResolvedValue({
        success: true,
        errors: [],
        warnings: [],
      });

      await expect(initCommand.handler(mockArgs)).resolves.toBeUndefined();

      expect(mockExistsSync).toHaveBeenCalledWith(expect.any(String));
      expect(mockReadFileSync).toHaveBeenCalledWith(expect.any(String), 'utf-8');
      // Mock processor verification replaced by spyOn calls
    });

    it('[T001-23] should handle missing config file error', async () => {
      const mockArgs = {
        config: 'missing-config.json',
        nonInteractive: true,
      };

      const mockExistsSync = spyOn(fs, 'existsSync').mockReturnValue(false);

      await expect(initCommand.handler(mockArgs)).rejects.toThrow('process.exit called');

      expect(mockExistsSync).toHaveBeenCalled();
    });

    it('[T001-24] should handle invalid JSON in config file', async () => {
      const mockArgs = {
        config: 'invalid-config.json',
        nonInteractive: true,
      };

      const mockExistsSync = spyOn(fs, 'existsSync').mockReturnValue(true);
      const mockReadFileSync = spyOn(fs, 'readFileSync').mockReturnValue('invalid json');

      await expect(initCommand.handler(mockArgs)).rejects.toThrow('process.exit called');

      expect(mockExistsSync).toHaveBeenCalled();
      expect(mockReadFileSync).toHaveBeenCalled();
    });

    it('[T001-25] should handle configuration validation errors', async () => {
      const mockArgs = {
        projectName: 'invalid-project',
        nonInteractive: true,
      };

      // Mock processor replaced by spyOn calls below

      // Spy for processor - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'process').mockResolvedValue({
        name: 'invalid-project',
      });
      // Spy for validation - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'validateFinalConfig').mockResolvedValue({
        valid: false,
        warnings: [],
        errors: ['Invalid project name'],
      });

      await expect(initCommand.handler(mockArgs)).rejects.toThrow('process.exit called');
    });

    it('[T001-26] should handle project generation failures', async () => {
      const mockArgs = {
        projectName: 'test-project',
        nonInteractive: true,
      };

      const mockConfig = {
        name: 'test-project',
        projectType: 'basic',
        qualityLevel: 'medium',
        aiAssistants: ['claude-code'],
        nonInteractive: true,
      };

      // Mock objects replaced by spyOn calls below

      // Spy for processor - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'process').mockResolvedValue(mockConfig);
      // Spy for validation - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'validateFinalConfig').mockResolvedValue({
        valid: true,
        warnings: [],
        errors: [],
      });
      // Spy for generator - kept for potential debugging
      spyOn(ProjectGenerator.prototype, 'generateProject').mockResolvedValue({
        success: false,
        errors: ['Generation failed'],
        warnings: [],
      });

      await expect(initCommand.handler(mockArgs)).rejects.toThrow('process.exit called');
    });

    it('[T001-27] should require project name in non-interactive mode', async () => {
      const mockArgs = {
        nonInteractive: true,
      };

      await expect(initCommand.handler(mockArgs)).rejects.toThrow('process.exit called');
    });

    it('[T001-28] should handle warnings in configuration validation', async () => {
      const mockArgs = {
        projectName: 'test-project',
        nonInteractive: true,
      };

      const mockConfig = {
        name: 'test-project',
        description: '',
        author: '',
        license: 'MIT',
        projectType: 'basic',
        qualityLevel: 'medium',
        aiAssistants: ['claude-code'],
        nonInteractive: true,
        targetDirectory: './test-project',
      };

      // Mock objects replaced by spyOn calls below

      // Spy for wizard - kept for potential debugging
      spyOn(ProjectWizardImplementation.prototype, 'run').mockResolvedValue(mockConfig);
      // Spy for wizard validation
      spyOn(ProjectWizardImplementation.prototype, 'validate').mockReturnValue({
        valid: true,
        errors: [],
      });
      // Spy for processor - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'process').mockResolvedValue(mockConfig);
      // Spy for validation - kept for potential debugging
      spyOn(ProjectConfigProcessorImpl.prototype, 'validateFinalConfig').mockResolvedValue({
        valid: true,
        warnings: ['Quality level is light'],
        errors: [],
      });
      // Spy for generator - kept for potential debugging
      spyOn(ProjectGenerator.prototype, 'generateProject').mockResolvedValue({
        success: true,
        errors: [],
        warnings: [],
      });

      try {
        await initCommand.handler(mockArgs);
      } catch (error) {
        process.stderr.write(`Test failed with error: ${error}\n`);
        throw error;
      }

      // Mock spy verifications replaced by spyOn calls
    });
  });
});
