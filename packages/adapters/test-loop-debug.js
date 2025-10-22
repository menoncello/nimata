// Test debug para loops aninhados
const { processLoops } = await import('./src/template-engine/loop-processor.js');

const simpleTemplate = `{{#each this.properties}}
{{name}}: {{type}};
{{/each}}`;

const context = {
  this: {
    properties: [
      { name: 'title', type: 'string' },
      { name: 'children?', type: 'React.ReactNode' },
    ],
  },
};

try {
  const result = await processLoops(simpleTemplate, context);
  console.log('Template:', JSON.stringify(simpleTemplate));
  console.log('Context:', JSON.stringify(context));
  console.log('Result:', JSON.stringify(result));
  console.log('Contains title: string;', result.includes('title: string;'));
} catch (error) {
  console.error('Error:', error);
}
