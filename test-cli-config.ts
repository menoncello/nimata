import { ProjectWizardImplementation } from './packages/adapters/src/wizards/project-wizard';
import type { ProjectConfig } from './packages/adapters/src/wizards/wizard-validators';
import { ProjectConfigProcessorImpl } from './packages/core/src/services/project-config-processor';

// Simulate exactly the CLI flow
const partialConfig: Partial<ProjectConfig> = {
  name: 'test-project',
  projectType: 'basic',
  qualityLevel: 'medium',
  aiAssistants: ['claude-code'],
};

console.log('1. Partial config:', partialConfig);

// Wizard validation
const wizard = new ProjectWizardImplementation();
const validation = wizard.validate(partialConfig);
console.log('2. Wizard validation:', validation);

// Apply defaults (simulating runNonInteractive)
const defaults: Partial<ProjectConfig> = {
  description: '',
  qualityLevel: 'medium',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
};

const finalConfig = {
  ...defaults,
  ...partialConfig,
} as ProjectConfig;

console.log('3. Config after defaults:', finalConfig);

// Process (simulating processConfiguration)
const processor = new ProjectConfigProcessorImpl();
try {
  const processed = await processor.process(finalConfig as any);
  console.log('4. ✅ Processed successfully:', processed);
} catch (error) {
  console.log('4. ❌ Error:', error instanceof Error ? error.message : error);
}
