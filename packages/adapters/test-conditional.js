// Test simples para debug do conditional processor
const { processConditionals } = await import('./src/template-engine/conditional-processor.js');

const template = `{{#if hasAuth && isOAuth}}
// OAuth authentication setup
{{else}}
{{#if hasAuth}}
// Basic authentication setup
{{else}}
// No authentication setup
{{/if}}
{{/if}}`;

// Test all contexts
const contexts = [
  { name: 'noAuth', context: { hasAuth: false, isOAuth: false } },
  { name: 'basicAuth', context: { hasAuth: true, isOAuth: false } },
  { name: 'oauth', context: { hasAuth: true, isOAuth: true } },
];

for (const { name, context } of contexts) {
  console.log(`\n=== Testing ${name} ===`);
  try {
    const result = await processConditionals(template, context);
    console.log('Context:', JSON.stringify(context));
    console.log('Result:', JSON.stringify(result));
    console.log('Contains "Basic":', result.includes('Basic authentication setup'));
    console.log('Contains "OAuth":', result.includes('OAuth authentication setup'));
    console.log('Contains "No":', result.includes('No authentication setup'));
  } catch (error) {
    console.error('Error:', error);
  }
}
