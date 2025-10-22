#!/usr/bin/env bun

import { TemplateEngine } from './packages/adapters/src/template-engine.js';
import { getNestedValue } from './packages/adapters/src/template-engine/argument-processor.js';

async function debugLoop() {
  // Test getNestedValue with 'this.properties'
  const currentInterface = {
    name: 'Props',
    properties: [
      { name: 'title', type: 'string' },
      { name: 'children?', type: 'React.ReactNode' },
    ],
  };

  console.log('Current interface:', JSON.stringify(currentInterface, null, 2));
  console.log(
    'getNestedValue(currentInterface, "this.properties"):',
    getNestedValue(currentInterface, 'this.properties')
  );
  console.log(
    'getNestedValue({this: currentInterface}, "this.properties"):',
    getNestedValue({ this: currentInterface }, 'this.properties')
  );

  // Test what the context should look like for nested loop
  const itemContext = {
    ...{}, // baseContext
    this: currentInterface,
    '@index': '0',
    '@first': true,
    '@last': true,
    '@key': '',
  };

  console.log('\nItem context for nested loop:', JSON.stringify(itemContext, null, 2));
  console.log(
    'getNestedValue(itemContext, "this.properties"):',
    getNestedValue(itemContext, 'this.properties')
  );
}

debugLoop().catch(console.error);
