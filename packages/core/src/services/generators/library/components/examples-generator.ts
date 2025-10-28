/**
 * Examples Generator
 *
 * Generates usage examples for libraries
 */
import type { ProjectConfig } from '../../../../types/project-config.js';
import { toPascalCase } from '../../../../utils/string-utils.js';

/**
 * Generates usage examples for libraries
 */
export class ExamplesGenerator {
  /**
   * Generates basic usage example
   * @param config - Project configuration
   * @returns Basic example code
   */
  generateBasicExample(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const header = this.generateExampleHeader(className, config, 'Basic Usage Example');
    const example1 = this.generateBasicExample1(className);
    const example2 = this.generateBasicExample2(className);
    const example3 = this.generateBasicExample3(className);
    const runFunction = this.generateRunFunction(['example1', 'example2', 'example3']);

    return [header, example1, example2, example3, runFunction].join('\n\n');
  }

  /**
   * Generates advanced usage example
   * @param config - Project configuration
   * @returns Advanced example code
   */
  generateAdvancedExample(config: ProjectConfig): string {
    const className = toPascalCase(config.name);
    const header = this.generateExampleHeader(className, config, 'Advanced Usage Example');
    const configExample = this.generateAdvancedConfig(className);
    const examples = this.generateAdvancedExamples(className);
    const runFunction = this.generateAdvancedRunFunction();

    return [header, configExample, examples, runFunction].join('\n\n');
  }

  /**
   * Generates the example file header
   * @param className - Name of the class
   * @param config - Project configuration
   * @param title - Example title
   * @returns Header code
   */
  private generateExampleHeader(className: string, config: ProjectConfig, title: string): string {
    return `/**
 * ${title}
 *
 * Demonstrates ${title.toLowerCase()} of ${config.name}
 */

import { ${className}, create${className}, quickProcess } from '../../src/lib/index.js';`;
  }

  /**
   * Generates basic example 1 - constructor usage
   * @param className - Name of the class
   * @returns Example 1 code
   */
  private generateBasicExample1(className: string): string {
    return `/**
 * Example 1: Basic usage with constructor
 */
async function example1() {
  console.log('=== Example 1: Basic Usage ===');

  // Create instance
  const instance = new ${className}({
    debug: true,
  });

  // Initialize
  await instance.initialize();

  // Process some data
  const result = await instance.process('Hello, World!');

  console.log('Result:', result);

  // Clean up
  await instance.destroy();
}`;
  }

  /**
   * Generates basic example 2 - convenience function
   * @param className - Name of the class
   * @returns Example 2 code
   */
  private generateBasicExample2(className: string): string {
    return `/**
 * Example 2: Using convenience function
 */
async function example2() {
  console.log('=== Example 2: Convenience Function ===');

  // Create and initialize in one step
  const instance = await create${className}({
    debug: true,
  });

  // Use the instance
  const result = await instance.process('Quick start example');

  console.log('Result:', result);
}`;
  }

  /**
   * Generates basic example 3 - quick processing
   * @param _className - Name of the class
   * @returns Example 3 code
   */
  private generateBasicExample3(_className: string): string {
    return `/**
 * Example 3: Quick processing
 */
async function example3() {
  console.log('=== Example 3: Quick Processing ===');

  // One-off processing
  const result = await quickProcess(
    'Quick example',
    {
      debug: true,
    },
    {
      mode: 'async',
      timeout: 5000,
    }
  );

  console.log('Result:', result);
}`;
  }

  /**
   * Generates advanced configuration example
   * @param _className - Name of the class
   * @returns Configuration example code
   */
  private generateAdvancedConfig(_className: string): string {
    return `/**
 * Custom configuration
 */
const customConfig = {
  debug: true,
  options: {
    customFeature: true,
    maxItems: 100,
    timeout: 10000,
  },
};`;
  }

  /**
   * Generates advanced examples
   * @param className - Name of the class
   * @returns Advanced examples code
   */
  private generateAdvancedExamples(className: string): string {
    const example1 = this.generateAdvancedExample1(className);
    const example2 = this.generateAdvancedExample2(className);
    const example3 = this.generateAdvancedExample3(className);

    return `${example1}

${example2}

${example3}`;
  }

  /**
   * Generates advanced example 1 - custom configuration
   * @param className - Name of the class
   * @returns Example 1 code
   */
  private generateAdvancedExample1(className: string): string {
    return `/**
 * Example 1: Custom configuration
 */
async function example1() {
  console.log('=== Example 1: Custom Configuration ===');

  const instance = new ${className}(customConfig);
  await instance.initialize();

  // Show configuration
  console.log('Config:', instance.getConfig());

  await instance.destroy();
}`;
  }

  /**
   * Generates advanced example 2 - error handling
   * @param className - Name of the class
   * @returns Example 2 code
   */
  private generateAdvancedExample2(className: string): string {
    return `/**
 * Example 2: Error handling
 */
async function example2() {
  console.log('=== Example 2: Error Handling ===');

  try {
    const instance = new ${className}({
      debug: true,
    });

    await instance.initialize();

    // Simulate an error scenario
    console.log('Error handling example completed successfully');

    await instance.destroy();
  } catch (error) {
    console.error('Caught error:', error);
  }
}`;
  }

  /**
   * Generates advanced example 3 - performance monitoring
   * @param className - Name of the class
   * @returns Example 3 code
   */
  private generateAdvancedExample3(className: string): string {
    return `/**
 * Example 3: Performance monitoring
 */
async function example3() {
  console.log('=== Example 3: Performance Monitoring ===');

  const instance = new ${className}({
    debug: true,
  });

  await instance.initialize();

  // Perform some operations
  const startTime = performance.now();

  for (let i = 0; i < 100; i++) {
    await instance.process(\`item-\${i}\`);
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(\`Processed 100 items in \${duration.toFixed(2)}ms\`);
  console.log(\`Average time per item: \${(duration / 100).toFixed(2)}ms\`);

  await instance.destroy();
}`;
  }

  /**
   * Generates run function for basic examples
   * @param exampleNames - Names of example functions
   * @returns Run function code
   */
  private generateRunFunction(exampleNames: string[]): string {
    const exampleCalls = exampleNames.map((name) => `    await ${name}();`).join('\n');
    const separators = Array(exampleNames.length - 1)
      .fill("    console.log('\\n---\\n');")
      .join('\n');

    return `/**
 * Run all examples
 */
async function runExamples() {
  try {
${exampleCalls}

${separators}
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  runExamples();
}

export { ${exampleNames.join(', ')}, runExamples };`;
  }

  /**
   * Generates run function for advanced examples
   * @returns Advanced run function code
   */
  private generateAdvancedRunFunction(): string {
    return `/**
 * Run examples
 */
async function runAdvancedExamples() {
  await example1();
  await example2();
  await example3();
}

// Export for usage
export { example1, example2, example3, runAdvancedExamples };`;
  }
}
