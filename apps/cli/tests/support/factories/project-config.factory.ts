/**
 * Project Configuration Factories
 *
 * Factory functions for creating test data following the data-factory pattern
 * from the knowledge base. These factories create realistic project configurations
 * for testing the project generation system.
 */

import { faker } from '@faker-js/faker';

export interface ProjectConfig {
  name: string;
  description?: string;
  author?: string;
  license?: string;
  qualityLevel: 'light' | 'medium' | 'strict';
  projectType: 'basic' | 'web' | 'cli' | 'library';
  aiAssistants: Array<'claude-code' | 'copilot'>;
  template?: string;
  targetDirectory?: string;
  nonInteractive?: boolean;
}

export const createProjectConfig = (overrides: Partial<ProjectConfig> = {}): ProjectConfig => ({
  name: faker.string.alphanumeric({ length: { min: 3, max: 10 } }).toLowerCase(),
  description: faker.lorem.sentence(),
  author: faker.person.fullName(),
  license: 'MIT',
  qualityLevel: 'strict',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
  template: undefined,
  targetDirectory: undefined,
  nonInteractive: false,
  ...overrides,
});

export const createStrictQualityProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    qualityLevel: 'strict',
    aiAssistants: ['claude-code', 'copilot'],
  });

export const createLightQualityProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    qualityLevel: 'light',
    aiAssistants: ['copilot'],
  });

export const createWebProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    projectType: 'web',
    description: 'A web application project',
    aiAssistants: ['claude-code'],
  });

export const createCLIProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    projectType: 'cli',
    description: 'A CLI application project',
    aiAssistants: ['copilot'],
  });

export const createLibraryProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    projectType: 'library',
    description: 'A library package project',
    qualityLevel: 'strict',
    aiAssistants: ['claude-code', 'copilot'],
  });

export const createNonInteractiveProjectConfig = (): ProjectConfig =>
  createProjectConfig({
    nonInteractive: true,
    template: 'basic',
    qualityLevel: 'medium',
  });

export const createProjectConfigs = (count: number): ProjectConfig[] =>
  Array.from({ length: count }, () => createProjectConfig());

// Helper for creating configs with specific AI assistants
export const createProjectConfigWithAI = (
  aiAssistants: Array<'claude-code' | 'copilot'>
): ProjectConfig => createProjectConfig({ aiAssistants });

// Helper for creating configs with specific quality level
export const createProjectConfigWithQuality = (
  qualityLevel: 'light' | 'medium' | 'strict'
): ProjectConfig => createProjectConfig({ qualityLevel });

// Helper for creating configs with specific project type
export const createProjectConfigWithType = (
  projectType: 'basic' | 'web' | 'cli' | 'library'
): ProjectConfig => createProjectConfig({ projectType });
