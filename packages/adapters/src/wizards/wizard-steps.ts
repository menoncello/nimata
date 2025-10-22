/**
 * Wizard Step Definitions
 *
 * Predefined wizard steps for project configuration
 */

import path from 'node:path';
import { TEXT_LIMITS, LISTS } from '../utils/constants.js';
import { WizardStep } from './wizard-prompts.js';

// Type aliases to avoid inline union types
type QualityLevelOption = 'light' | 'medium' | 'strict';
type ProjectTypeOption = 'basic' | 'web' | 'cli' | 'library';

// Validation rules for project name
const PROJECT_NAME_VALIDATION: Array<{
  type: 'required' | 'pattern' | 'length' | 'custom';
  message: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
}> = [
  {
    type: 'required',
    message: 'Project name is required',
  },
  {
    type: 'pattern',
    pattern: /^[\d_a-z-]+$/,
    message:
      'Project name must contain only lowercase letters, numbers, hyphens, and underscores',
  },
  {
    type: 'length',
    min: LISTS.INDEX_OFFSET,
    max: LISTS.MAX_NAME_LENGTH,
    message: `Project name must be between ${LISTS.INDEX_OFFSET} and ${LISTS.MAX_NAME_LENGTH} characters`,
  },
];

/**
 * Get default project name from target directory or current directory
 * @param config - Configuration object
 * @returns Default project name
 */
function getDefaultProjectName(config: Record<string, unknown>): string {
  const targetDir = config['targetDirectory'] as string | undefined;
  return targetDir ? path.basename(targetDir) : path.basename(process.cwd());
}

/**
 * Create target directory step configuration
 * @returns Target directory wizard step
 */
export function createTargetDirectoryStep(): WizardStep {
  return {
    id: 'targetDirectory',
    title: 'Target Directory',
    description: 'Enter the directory where the project will be created',
    help: 'Press Enter to use the current directory, or specify a different path',
    type: 'text',
    required: true,
    defaultValue: process.cwd(),
    validation: [
      {
        type: 'required',
        message: 'Target directory is required',
      },
      {
        type: 'length',
        min: LISTS.INDEX_OFFSET,
        max: TEXT_LIMITS.PATH_MAX,
        message: `Directory path must be between ${LISTS.INDEX_OFFSET} and ${TEXT_LIMITS.PATH_MAX} characters`,
      },
    ],
  };
}

/**
 * Create project name step configuration
 * @returns Project name wizard step
 */
export function createProjectNameStep(): WizardStep {
  return {
    id: 'name',
    title: 'Project Name',
    description: 'Enter the name of your project',
    help: 'Project names should be lowercase, contain no spaces, and be suitable for npm package naming',
    type: 'text',
    required: true,
    defaultValue: getDefaultProjectName,
    condition: (config) => !config['name'], // Skip if name already provided via argument
    validation: PROJECT_NAME_VALIDATION,
  };
}

/**
 * Create project description step configuration
 * @returns Project description wizard step
 */
export function createProjectDescriptionStep(): WizardStep {
  return {
    id: 'description',
    title: 'Project Description',
    description: 'Enter a brief description of your project',
    help: 'A good description helps others understand what your project does',
    type: 'text',
    required: false,
    defaultValue: '',
    validation: [
      {
        type: 'length',
        max: TEXT_LIMITS.DESCRIPTION_MAX,
        message: `Description must be less than ${TEXT_LIMITS.DESCRIPTION_MAX} characters`,
      },
    ],
  };
}

/**
 * Create quality level step configuration
 * @returns Quality level wizard step
 */
export function createQualityLevelStep(): WizardStep {
  return {
    id: 'qualityLevel',
    title: 'Quality Level',
    description: 'Choose the quality level for your project',
    help: 'Higher quality levels include more strict rules and tools',
    type: 'list',
    required: true,
    defaultValue: 'strict',
    options: [
      {
        label: 'Light',
        value: 'light' as QualityLevelOption,
        description: 'Basic ESLint rules, minimal restrictions',
      },
      {
        label: 'Medium',
        value: 'medium' as QualityLevelOption,
        description: 'Balanced approach with good practices enforced',
      },
      {
        label: 'Strict (Recommended)',
        value: 'strict' as QualityLevelOption,
        description: 'Maximum code quality with comprehensive rules',
      },
    ],
  };
}

/**
 * Create project type step configuration
 * @returns Project type wizard step
 */
export function createProjectTypeStep(): WizardStep {
  return {
    id: 'projectType',
    title: 'Project Type',
    description: 'Choose the type of project you want to create',
    help: 'This determines the initial project structure and configuration',
    type: 'list',
    required: true,
    defaultValue: 'basic',
    options: getProjectTypeOptions(),
  };
}

/**
 * Get project type options
 * @returns Array of project type options
 */
function getProjectTypeOptions(): Array<{
  label: string;
  value: ProjectTypeOption;
  description: string;
}> {
  return [
    {
      label: 'Basic',
      value: 'basic' as ProjectTypeOption,
      description: 'Simple TypeScript project with basic setup',
    },
    {
      label: 'CLI Application',
      value: 'cli' as ProjectTypeOption,
      description: 'Command-line interface application with argument parsing',
    },
    {
      label: 'Web Application',
      value: 'web' as ProjectTypeOption,
      description: 'Web server application with HTTP routing',
    },
    {
      label: 'Library Package',
      value: 'library' as ProjectTypeOption,
      description: 'Reusable library package for distribution',
    },
  ];
}

/**
 * Create AI assistants step configuration
 * @returns AI assistants wizard step
 */
export function createAIAssistantsStep(): WizardStep {
  return {
    id: 'aiAssistants',
    title: 'AI Assistants',
    description: 'Choose which AI assistants to configure',
    help: 'This will generate optimized context files for the selected assistants',
    type: 'checkbox',
    required: true,
    defaultValue: ['claude-code'],
    options: [
      {
        label: 'Claude Code',
        value: 'claude-code' as 'claude-code' | 'copilot',
        description: 'Generate CLAUDE.md with project context and guidelines',
      },
      {
        label: 'GitHub Copilot',
        value: 'copilot' as 'claude-code' | 'copilot',
        description: 'Generate GitHub Copilot instructions file',
      },
    ],
  };
}

/**
 * Create author step configuration
 * @returns Author wizard step
 */
export function createAuthorStep(): WizardStep {
  return {
    id: 'author',
    title: 'Author',
    description: 'Enter the author name for this project',
    help: 'This will be used in package.json and license headers',
    type: 'text',
    required: false,
    defaultValue: '',
    validation: [
      {
        type: 'length',
        max: TEXT_LIMITS.AUTHOR_NAME_MAX,
        message: `Author name must be less than ${TEXT_LIMITS.AUTHOR_NAME_MAX} characters`,
      },
    ],
  };
}

/**
 * Create license step configuration
 * @returns License wizard step
 */
export function createLicenseStep(): WizardStep {
  return {
    id: 'license',
    title: 'License',
    description: 'Choose a license for your project',
    help: 'This will be used in package.json and LICENSE file',
    type: 'list',
    required: false,
    defaultValue: 'MIT',
    options: createLicenseOptions(),
  };
}

/**
 * Create license options array
 * @returns Array of license options
 */
function createLicenseOptions(): Array<{ label: string; value: string; description: string }> {
  const permissiveLicenses = getPermissiveLicenses();
  const copyleftLicenses = getCopyleftLicenses();

  return [...permissiveLicenses, ...copyleftLicenses, getNoLicenseOption()];
}

/**
 * Get permissive license options
 * @returns Array of permissive license options
 */
function getPermissiveLicenses(): Array<{ label: string; value: string; description: string }> {
  return [
    {
      label: 'MIT',
      value: 'MIT',
      description: 'Permissive license with minimal restrictions',
    },
    {
      label: 'Apache-2.0',
      value: 'Apache-2.0',
      description: 'Permissive license with patent grant',
    },
    {
      label: 'BSD-3-Clause',
      value: 'BSD-3-Clause',
      description: 'Permissive license with advertising clause',
    },
    {
      label: 'ISC',
      value: 'ISC',
      description: 'Simple permissive license',
    },
  ];
}

/**
 * Get copyleft license options
 * @returns Array of copyleft license options
 */
function getCopyleftLicenses(): Array<{ label: string; value: string; description: string }> {
  return [
    {
      label: 'GPL-3.0-or-later',
      value: 'GPL-3.0-or-later',
      description: 'Strong copyleft license',
    },
  ];
}

/**
 * Get no license option
 * @returns No license option
 */
function getNoLicenseOption(): { label: string; value: string; description: string } {
  return {
    label: 'None',
    value: '',
    description: 'No license (unlicensed)',
  };
}
