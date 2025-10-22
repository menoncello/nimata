const config = {
  name: 'test-project',
  description: '',
  author: '',
  license: 'MIT',
  qualityLevel: 'medium',
  projectType: 'basic',
  aiAssistants: ['claude-code'],
  template: undefined,
  targetDirectory: './test-project',
  nonInteractive: false,
};

function convertQualityLevel(qualityLevel: string): 'light' | 'medium' | 'strict' {
  if (qualityLevel === 'basic') return 'light';
  if (qualityLevel === 'strict') return 'strict';
  return 'medium';
}

function convertToCoreConfig(finalConfig: typeof config) {
  return {
    ...finalConfig,
    qualityLevel: convertQualityLevel(finalConfig.qualityLevel),
    projectType: finalConfig.projectType as 'basic' | 'web' | 'cli' | 'library',
    aiAssistants: finalConfig.aiAssistants as Array<string>,
  };
}

console.log('Original:', config);
console.log('Converted:', convertToCoreConfig(config));
console.log(
  'targetDirectory preserved?',
  convertToCoreConfig(config).targetDirectory === config.targetDirectory
);
