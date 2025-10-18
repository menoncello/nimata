/**
 * Example E2E CLI test
 * Demonstrates spawn-based testing with real process execution
 *
 * STATUS: PENDING EPIC 2 - Validation command implementation required
 * Tests 3-4 require Epic 2 validation logic (currently stub commands)
 */

import { describe, test, afterEach } from 'bun:test';
import { createCliRunner, createTestProject, assertCli } from '../e2e/support';

describe('CLI E2E Example', () => {
  const cli = createCliRunner();
  let testProject: Awaited<ReturnType<typeof createTestProject>> | undefined;

  afterEach(async () => {
    await testProject?.cleanup();
  });

  test('should show version', async () => {
    const result = await cli.run(['--version']);

    assertCli(result).success().stdoutContains('.').completedWithin(1000);
  });

  test('should show help', async () => {
    const result = await cli.run(['--help']);

    assertCli(result).success().stdoutContains('nimata').stdoutContains('Commands:');
  });

  test.skip('should validate in isolated project', async () => {
    testProject = await createTestProject();

    // Scaffold basic project
    await testProject.scaffold('test-validate');
    await testProject.writeFile('src/index.ts', 'export const foo = 42;');

    // Run validation
    const result = await cli.run(['validate'], {
      cwd: testProject.path,
      timeout: 10_000,
    });

    assertCli(result).success().stdoutContains('validation');
  });

  test.skip('should fail validation with errors', async () => {
    testProject = await createTestProject();

    // Write invalid TypeScript
    await testProject.writeFile('src/bad.ts', 'const x: any = 123;');
    await testProject.writePackageJson({
      name: 'test',
      version: '1.0.0',
      type: 'module',
    });

    const result = await cli.run(['validate'], {
      cwd: testProject.path,
      timeout: 10_000,
    });

    // Expect failure
    assertCli(result).failure();
  });
});
