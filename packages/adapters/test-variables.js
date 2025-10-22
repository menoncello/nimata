// Test simple variable substitution
const { TemplateEngine } = await import('./src/template-engine.js');

const template = `<h1>{{title}}</h1>\n<div>{{children}}</div>`;
const context = { title: 'Hello World', children: 'Content here' };

const engine = new TemplateEngine();

try {
  const result = await engine.renderTemplate(template, context);
  console.log('Template:', JSON.stringify(template));
  console.log('Context:', JSON.stringify(context));
  console.log('Result:', JSON.stringify(result));
  console.log('Contains Hello World:', result.includes('Hello World'));
  console.log('Contains Content here:', result.includes('Content here'));
} catch (error) {
  console.error('Error:', error);
}
