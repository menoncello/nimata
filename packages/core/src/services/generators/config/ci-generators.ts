/**
 * CI/CD Configuration Generators
 */

import { NODE_VERSIONS } from './constants.js';

/**
 * Generates CI/CD configuration content
 */
export class CIGenerators {
  /**
   * Generate CI configuration
   * @returns {string} GitHub Actions workflow
   */
  static generateCIConfig(): string {
    const workflowHeader = this.getWorkflowHeader();
    const jobs = this.getJobs();

    return `${workflowHeader}

${jobs}`;
  }

  /**
   * Get workflow header
   * @returns {string} Workflow header content
   */
  private static getWorkflowHeader(): string {
    return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]`;
  }

  /**
   * Get jobs configuration
   * @returns {string} Jobs configuration content
   */
  private static getJobs(): string {
    const matrix = this.getNodeVersionMatrix();
    const steps = this.getJobSteps();

    return `jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [${matrix}]

    steps:
${steps}`;
  }

  /**
   * Get Node.js version matrix
   * @returns {string} Node.js versions as string
   */
  private static getNodeVersionMatrix(): string {
    return NODE_VERSIONS.map((version) => `'${version}'`).join(', ');
  }

  /**
   * Get job steps
   * @returns {string} Job steps content
   */
  private static getJobSteps(): string {
    const steps = [
      this.getCheckoutStep(),
      this.getBunSetupStep(),
      this.getInstallStep(),
      this.getTypeCheckStep(),
      this.getLintStep(),
      this.getTestStep(),
      this.getMutationTestStep(),
      this.getBuildStep(),
    ];

    return steps.join('\n\n');
  }

  /**
   * Get checkout step
   * @returns {string} Checkout step content
   */
  private static getCheckoutStep(): string {
    return '    - uses: actions/checkout@v4';
  }

  /**
   * Get Bun setup step
   * @returns {string} Bun setup step content
   */
  private static getBunSetupStep(): string {
    return `    - name: Use Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest`;
  }

  /**
   * Get install step
   * @returns {string} Install step content
   */
  private static getInstallStep(): string {
    return '    - name: Install dependencies\n      run: bun install';
  }

  /**
   * Get type check step
   * @returns {string} Type check step content
   */
  private static getTypeCheckStep(): string {
    return '    - name: Type check\n      run: bun run typecheck';
  }

  /**
   * Get lint step
   * @returns {string} Lint step content
   */
  private static getLintStep(): string {
    return '    - name: Lint\n      run: bun run lint';
  }

  /**
   * Get test step
   * @returns {string} Test step content
   */
  private static getTestStep(): string {
    return '    - name: Test\n      run: bun test --coverage';
  }

  /**
   * Get mutation test step
   * @returns {string} Mutation test step content
   */
  private static getMutationTestStep(): string {
    return '    - name: Mutation test\n      run: bun run test:mutate';
  }

  /**
   * Get build step
   * @returns {string} Build step content
   */
  private static getBuildStep(): string {
    return '    - name: Build\n      run: bun run build';
  }
}
