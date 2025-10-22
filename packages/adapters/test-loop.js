// Test loop processor
const { processLoops } = await import('./src/template-engine/loop-processor.js');

const template = `{{#each interfaces}}
interface {{this.name}} {
  {{#each this.properties}}
  {{name}}: {{type}};
  {{/each}}
}
{{/each}}`;

const context = {
  interfaces: [
    {
      name: 'Props',
      properties: [
        { name: 'title', type: 'string' },
        { name: 'children?', type: 'React.ReactNode' },
      ],
    },
  ],
};

try {
  const result = await processLoops(template, context);
  console.log('Template:', JSON.stringify(template));
  console.log('Context:', JSON.stringify(context));
  console.log('Result:', JSON.stringify(result));
  console.log('Contains title: string;', result.includes('title: string;'));
} catch (error) {
  console.error('Error:', error);
}
