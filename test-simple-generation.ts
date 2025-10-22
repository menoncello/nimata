import { ProjectGenerator } from './packages/adapters/src/project-generator';
import type { ProjectConfig } from './packages/adapters/src/wizards/wizard-validators';

const config: ProjectConfig = {
  name: 'test-project',
  description: 'Test description',
  author: 'Test Author',
  license: 'MIT',
  qualityLevel: 'medium',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
};

console.log('Testing ProjectGenerator with config:', config);

const generator = new ProjectGenerator();
const result = await generator.generateProject(config);

console.log('Result:', JSON.stringify(result, null, 2));

if (result.success) {
  console.log('✅ Generation succeeded!');
  console.log('Files generated:', result.files.length);
} else {
  console.error('❌ Generation failed!');
  console.error('Errors:', result.errors);
}
