// Test debug do contexto do loop
const { processLoops } = await import('./src/template-engine/loop-processor.js');

const nestedTemplate = `{{#each interfaces}}
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

console.log('Context original:', JSON.stringify(context, null, 2));

// Simular createLoopItemContext para o primeiro item
const item = context.interfaces[0];
console.log('\nItem atual:', JSON.stringify(item, null, 2));

const simulatedContext = {
  ...context,
  this: item,
  '@index': '0',
  '@first': true,
  '@last': true,
  '@key': '0',
  interfaces: item,
  ...item,
};

console.log('\nContext simulado no loop:', JSON.stringify(simulatedContext, null, 2));
console.log('\nthis.properties existe?', 'this.properties' in simulatedContext);
console.log('this.properties:', simulatedContext.this.properties);

try {
  const result = await processLoops(nestedTemplate, context);
  console.log('\nTemplate:', nestedTemplate);
  console.log('Result:', result);
} catch (error) {
  console.error('Error:', error);
}
