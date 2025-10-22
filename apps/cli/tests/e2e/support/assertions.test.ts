import { describe, expect, test } from 'bun:test';
import { CliAssertions, assertCli } from './assertions.js';
import type { CliResult } from './cli-runner.js';

const createMockResult = (overrides: Partial<CliResult> = {}): CliResult => ({
  exitCode: 0,
  stdout: '',
  stderr: '',
  duration: 100,
  ...overrides,
});

describe('CliAssertions', () => {
  describe('exitCode', () => {
    test('should assert exit code', () => {
      const result = createMockResult({ exitCode: 0 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.exitCode(0)).not.toThrow();
    });

    test('should fail on wrong exit code', () => {
      const result = createMockResult({ exitCode: 1 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.exitCode(0)).toThrow();
    });
  });

  describe('success', () => {
    test('should assert exit code 0', () => {
      const result = createMockResult({ exitCode: 0 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.success()).not.toThrow();
    });

    test('should fail on non-zero exit code', () => {
      const result = createMockResult({ exitCode: 1 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.success()).toThrow();
    });
  });

  describe('failure', () => {
    test('should assert non-zero exit code', () => {
      const result = createMockResult({ exitCode: 1 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.failure()).not.toThrow();
    });

    test('should fail on zero exit code', () => {
      const result = createMockResult({ exitCode: 0 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.failure()).toThrow();
    });
  });

  describe('stdoutContains', () => {
    test('should assert stdout contains text', () => {
      const result = createMockResult({ stdout: 'Hello World' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutContains('Hello')).not.toThrow();
    });

    test('should fail when text not in stdout', () => {
      const result = createMockResult({ stdout: 'Hello World' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutContains('Goodbye')).toThrow();
    });
  });

  describe('stdoutMatches', () => {
    test('should assert stdout matches regex', () => {
      const result = createMockResult({ stdout: 'Version 1.2.3' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutMatches(/\d{1,3}\.\d{1,3}\.\d{1,3}/u)).not.toThrow();
    });

    test('should fail when regex does not match', () => {
      const result = createMockResult({ stdout: 'No version here' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutMatches(/\d{1,3}\.\d{1,3}\.\d{1,3}/u)).toThrow();
    });
  });

  describe('stderrContains', () => {
    test('should assert stderr contains text', () => {
      const result = createMockResult({ stderr: 'Error occurred' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrContains('Error')).not.toThrow();
    });

    test('should fail when text not in stderr', () => {
      const result = createMockResult({ stderr: 'Error occurred' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrContains('Warning')).toThrow();
    });
  });

  describe('stderrMatches', () => {
    test('should assert stderr matches regex', () => {
      const result = createMockResult({ stderr: 'Error: File not found' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrMatches(/Error:/)).not.toThrow();
    });

    test('should fail when regex does not match', () => {
      const result = createMockResult({ stderr: 'Warning: Something' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrMatches(/Error:/)).toThrow();
    });
  });

  describe('noStderr', () => {
    test('should assert stderr is empty', () => {
      const result = createMockResult({ stderr: '' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.noStderr()).not.toThrow();
    });

    test('should handle whitespace-only stderr as empty', () => {
      const result = createMockResult({ stderr: '   \n  ' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.noStderr()).not.toThrow();
    });

    test('should fail when stderr has content', () => {
      const result = createMockResult({ stderr: 'Error message' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.noStderr()).toThrow();
    });
  });

  describe('completedWithin', () => {
    test('should assert execution completed within time limit', () => {
      const result = createMockResult({ duration: 50 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.completedWithin(100)).not.toThrow();
    });

    test('should fail when execution took too long', () => {
      const result = createMockResult({ duration: 150 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.completedWithin(100)).toThrow();
    });
  });

  describe('stderrNotContains', () => {
    test('should assert stderr does not contain text', () => {
      const result = createMockResult({ stderr: 'Error occurred' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrNotContains('Warning')).not.toThrow();
    });

    test('should fail when text is in stderr', () => {
      const result = createMockResult({ stderr: 'Error occurred' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stderrNotContains('Error')).toThrow();
    });
  });

  describe('stdoutNotContains', () => {
    test('should assert stdout does not contain text', () => {
      const result = createMockResult({ stdout: 'Hello World' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutNotContains('Goodbye')).not.toThrow();
    });

    test('should fail when text is in stdout', () => {
      const result = createMockResult({ stdout: 'Hello World' });
      const assertions = new CliAssertions(result);

      expect(() => assertions.stdoutNotContains('Hello')).toThrow();
    });
  });

  describe('exitCodeIs', () => {
    test('should assert specific exit code', () => {
      const result = createMockResult({ exitCode: 130 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.exitCodeIs(130)).not.toThrow();
    });

    test('should fail on wrong exit code', () => {
      const result = createMockResult({ exitCode: 0 });
      const assertions = new CliAssertions(result);

      expect(() => assertions.exitCodeIs(130)).toThrow();
    });
  });

  describe('raw', () => {
    test('should return raw result', () => {
      const result = createMockResult({ exitCode: 42 });
      const assertions = new CliAssertions(result);

      expect(assertions.raw()).toBe(result);
    });
  });

  describe('chaining', () => {
    test('should support method chaining', () => {
      const result = createMockResult({
        exitCode: 0,
        stdout: 'Success message',
        stderr: '',
        duration: 50,
      });

      expect(() => {
        assertCli(result).success().stdoutContains('Success').noStderr().completedWithin(100);
      }).not.toThrow();
    });
  });

  describe('assertCli factory', () => {
    test('should create CliAssertions instance', () => {
      const result = createMockResult();
      const assertions = assertCli(result);

      expect(assertions).toBeInstanceOf(CliAssertions);
    });
  });
});
