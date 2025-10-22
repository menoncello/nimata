import { ProjectWizardImplementation } from './packages/adapters/src/wizards/project-wizard';
import { ProjectConfigProcessorImpl } from './packages/core/src/project-config-processor';
import { ProjectGenerator } from './packages/adapters/src/project-generator';
import type { ProjectConfig } from './packages/adapters/src/wizards/wizard-validators';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync } from 'node:fs';

const tempDir = await mkdtemp(join(tmpdir(), 'nimata-test-'));
console.log('Temp dir:', tempDir);

// Simulate non-interactive mode (like the failing tests)
const partialConfig: Partial<ProjectConfig> = {
  name: 'test-project',
  projectType: 'basic',
  qualityLevel: 'medium',
  aiAssistants: ['claude-code'],
};

console.log('1. Initial config:', partialConfig);

// Step 1: Process config (simulating runNonInteractive)
const wizard = new ProjectWizardImplementation();
const validation = wizard.validate(partialConfig);
console.log('\n2. Validation:', validation);

const defaults: Partial<ProjectConfig> = {
  description: '',
  qualityLevel: 'medium',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
};

const mergedConfig = {
  ...defaults,
  ...partialConfig,
} as ProjectConfig;

console.log('\n3. Merged config:', mergedConfig);

// Step 2: Process with ProjectConfigProcessorImpl
const processor = new ProjectConfigProcessorImpl();
const finalConfig = await processor.process(mergedConfig as any);

console.log('\n4. Final config after processor:', finalConfig);
console.log('   Has targetDirectory?', 'targetDirectory' in finalConfig);

// Step 3: Generate project
console.log('\n5. Generating project...');

// CRITICAL: Set target directory (this might be missing!)
if (!finalConfig.targetDirectory) {
  console.log('⚠️  WARNING: targetDirectory not set! Setting it now...');
  finalConfig.targetDirectory = tempDir;
}

const generator = new ProjectGenerator();
const result = await generator.generateProject(finalConfig as any);

console.log('\n6. Generation result:');
console.log('   Success:', result.success);
console.log('   Files:', result.files.length);
console.log('   Errors:', result.errors);

// Step 4: Check disk
const projectDir = join(tempDir, 'test-project');
console.log('\n7. Checking disk:');
console.log('   Project dir:', projectDir);
console.log('   Exists:', existsSync(projectDir));

if (existsSync(projectDir)) {
  console.log('   ✅ Files created successfully!');
} else {
  console.log('   ❌ Files NOT created!');
}

// Cleanup
await rm(tempDir, { recursive: true, force: true });
