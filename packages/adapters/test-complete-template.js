// Test complete template from failing test
const { TemplateEngine } = await import('./src/template-engine.js');

const template = `import React, { useState } from 'react';

{{#if interfaces}}
{{#each interfaces}}
interface {{this.name}} {
  {{#each properties}}
  {{name}}: {{type}};
  {{/each}}
}
{{/each}}
{{/if}}

export function {{componentName}}({{#if props}}{{props}}{{/if}}): JSX.Element {
  {{#if useState}}
  const [state, setState] = useState<{{stateType}}>({{initialState}});
  {{/if}}

  return (
    <div className="{{helper:lowercase componentName}}">
      <h1>{{title}}</h1>
      {{#if children}}
      <div className="content">
        {{children}}
      </div>
      {{/if}}
    </div>
  );
}

export default {{componentName}};`;

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
  componentName: 'MyComponent',
  props: '{ title, children }: Props',
  useState: true,
  stateType: 'number',
  initialState: '0',
  title: 'Hello Title',
  children: 'Hello Children',
};

const engine = new TemplateEngine();

try {
  const result = await engine.renderTemplate(template, context);
  console.log('Result:', result);
  console.log('\n--- Checks ---');
  console.log('Contains interface Props:', result.includes('interface Props'));
  console.log('Contains title: string;', result.includes('title: string;'));
  console.log('Contains Hello Title:', result.includes('Hello Title'));
  console.log('Contains Hello Children:', result.includes('Hello Children'));
  console.log('Contains mycomponent:', result.includes('mycomponent'));
} catch (error) {
  console.error('Error:', error);
}
