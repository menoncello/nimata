/**
 * Project Generator Workflow Functions
 *
 * Extracted workflow orchestration methods to reduce project-generator.ts file size
 */

import fs from 'node:fs/promises';
import type { TemplateEngine } from '../template-engine.js';
import {
  checkDirectoryExists,
  writeFilesToDisk,
  type ProjectConfig,
  type GenerationResult,
} from '../utils/project-generation-helpers.js';
import { getProjectDirectory, createTemplateContext } from '../utils/project-utilities.js';
import { ClaudeMdGenerator } from './claude-md-generator.js';
import { CopilotGenerator } from './copilot-generator.js';
import {
  createErrorResult,
  createSuccessResult,
  normalizeConfigForGenerators,
} from './project-generator-helpers.js';

const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

/**
 * Prepare project setup and validate prerequisites
 * @param config - Project configuration
 * @param templateEngine - Template engine instance
 * @param startTime - Start time for duration calculation
 * @returns Setup result
 */
export async function prepareProjectSetup(
  config: ProjectConfig,
  templateEngine: TemplateEngine,
  startTime: number
): Promise<GenerationResult> {
  const result: GenerationResult = {
    success: false,
    files: [],
    errors: [],
    warnings: [],
    duration: 0,
  };

  try {
    const projectDir = getProjectDirectory(config);
    const templateName = config.template || config.projectType;

    // Check if directory already exists
    await checkDirectoryExists(projectDir);

    // Load template
    await templateEngine.loadTemplate(templateName);

    result.success = true;
    result.files = [{ path: '', content: '', permissions: '' }]; // Placeholder
    result.duration = Date.now() - startTime;
  } catch (error) {
    return createErrorResult(
      result,
      error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE,
      [],
      startTime
    );
  }

  return result;
}

/**
 * Load and process template
 * @param config - Project configuration
 * @param templateEngine - Template engine instance
 * @returns Generated files from template
 */
export async function loadAndProcessTemplate(
  config: ProjectConfig,
  templateEngine: TemplateEngine
): Promise<Array<{ path: string; content: string; permissions?: string }>> {
  const templateName = config.template || config.projectType;
  const template = await templateEngine.loadTemplate(templateName);
  const context = createTemplateContext(config);
  return templateEngine.processProjectTemplate(template, context);
}

/**
 * Generate files from template
 * @param config - Project configuration
 * @param templateEngine - Template engine instance
 * @param files - Generated files array
 * @param startTime - Start time for duration calculation
 * @returns Generation result
 */
export async function generateFilesFromTemplate(
  config: ProjectConfig,
  templateEngine: TemplateEngine,
  files: Array<{ path: string; content: string; permissions?: string }>,
  startTime: number
): Promise<GenerationResult> {
  const result: GenerationResult = {
    success: false,
    files: [],
    errors: [],
    warnings: [],
    duration: 0,
  };

  try {
    const generatedFiles = await loadAndProcessTemplate(config, templateEngine);
    const aiContextFiles = generateAIContextFiles(config);

    result.files = [...generatedFiles, ...aiContextFiles];
    result.success = true;
    result.duration = Date.now() - startTime;
  } catch (error) {
    return createErrorResult(
      result,
      `Failed to process template: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE}`,
      [],
      startTime
    );
  }

  return result;
}

/**
 * Generate AI context files based on selected AI assistants
 * @param config - Project configuration
 * @returns Array of generated AI context files
 */
export function generateAIContextFiles(
  config: ProjectConfig
): Array<{ path: string; content: string; permissions?: string }> {
  const aiFiles: Array<{ path: string; content: string; permissions?: string }> = [];

  // Normalize config for generators (map 'high' to 'strict')
  const normalizedConfig = normalizeConfigForGenerators(config);

  // Generate CLAUDE.md if claude-code is selected
  if (config.aiAssistants.includes('claude-code')) {
    const claudeGenerator = new ClaudeMdGenerator();
    const claudeConfigs = claudeGenerator.generate(normalizedConfig);

    for (const claudeConfig of claudeConfigs) {
      aiFiles.push({
        path: claudeConfig.filename,
        content: claudeConfig.content,
      });
    }
  }

  // Generate GitHub Copilot instructions if copilot is selected
  if (config.aiAssistants.includes('copilot')) {
    const copilotGenerator = new CopilotGenerator();
    const copilotConfigs = copilotGenerator.generate(normalizedConfig);

    for (const copilotConfig of copilotConfigs) {
      aiFiles.push({
        path: copilotConfig.filename,
        content: copilotConfig.content,
      });
    }
  }

  return aiFiles;
}

/**
 * Create project directory and write files
 * @param config - Project configuration
 * @param files - Files to write
 * @returns Project directory or error
 */
export async function createProjectAndWriteFiles(
  config: ProjectConfig,
  files: Array<{ path: string; content: string; permissions?: string }>
): Promise<{ projectDir: string; writeErrors: string[] }> {
  const projectDir = getProjectDirectory(config);
  await fs.mkdir(projectDir, { recursive: true });

  const writeErrors = await writeFilesToDisk(files, projectDir);
  return { projectDir, writeErrors };
}

/**
 * Finalize project by writing files and validating
 * @param config - Project configuration
 * @param files - Files to write
 * @param startTime - Start time for duration calculation
 * @param addValidationWarnings - Function to add validation warnings
 * @returns Final result
 */
export async function finalizeProject(
  config: ProjectConfig,
  files: Array<{ path: string; content: string; permissions?: string }>,
  startTime: number,
  addValidationWarnings: (result: GenerationResult, projectDir: string) => Promise<void>
): Promise<GenerationResult> {
  const result: GenerationResult = {
    success: false,
    files,
    errors: [],
    warnings: [],
    duration: 0,
  };

  try {
    const { projectDir, writeErrors } = await createProjectAndWriteFiles(config, files);

    if (writeErrors.length > 0) {
      return createErrorResult(result, 'File writing errors:', writeErrors, startTime);
    }

    return await createSuccessResult(files, projectDir, startTime, addValidationWarnings);
  } catch (error) {
    return createErrorResult(
      result,
      `Failed to create project directory: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE}`,
      [],
      startTime
    );
  }
}
