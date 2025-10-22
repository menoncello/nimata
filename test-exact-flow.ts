import { ProjectConfigProcessorImpl } from './packages/core/src/services/project-config-processor';
import type { ProjectConfig as CoreProjectConfig } from './packages/core/src/types/project-config';

const processor = new ProjectConfigProcessorImpl();

// Simulate exactly what happens in CLI
const config = {
  name: 'test-project',
  projectType: 'basic',
  qualityLevel: 'medium',
  aiAssistants: ['claude-code'],
  description: '',
  targetDirectory: process.cwd(),
};

console.log('Config before cast:', config);

// This is exactly what processConfiguration does
const finalConfig = await processor.process(config as unknown as CoreProjectConfig);

console.log('✅ Success!');
console.log('Result:', finalConfig);
