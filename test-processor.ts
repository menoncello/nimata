import { ProjectConfigProcessorImpl } from './packages/core/src/services/project-config-processor';

const processor = new ProjectConfigProcessorImpl();

const config = {
  name: 'test-project',
  projectType: 'basic' as any,
  qualityLevel: 'medium' as any,
  aiAssistants: ['claude-code'] as any[],
};

console.log('Testing processor.process()...');
console.log('Input config:', config);

try {
  const result = await processor.process(config);
  console.log('✅ Success!');
  console.log('Result:', result);
} catch (error) {
  console.log('❌ Error:', error instanceof Error ? error.message : error);

  // Try validation directly
  const validation = await processor.validateFinalConfig({
    ...config,
    description: '',
    author: '',
    license: 'MIT',
    targetDirectory: './test-project',
  } as any);
  console.log('Direct validation result:', validation);
}
