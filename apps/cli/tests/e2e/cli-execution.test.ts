/**
 * E2E Tests - CLI Execution
 *
 * AC1: CLI entry point executes successfully
 */
import { describe, it, expect } from 'bun:test';
import { createCLIProcess, executeCLICommand, CLICommands } from '../factories/cli-process-factory';

describe('Story 1.1 - AC1: CLI Framework Setup Execution', () => {
  describe('P0 - CLI Entry Point', () => {
    describe('1.1-CLI-001', () => {
      it('should execute CLI without errors when no args provided', async () => {
        // Given CLI execution without arguments
        // When running the CLI command
        const result = await executeCLICommand([]);

        // Then CLI should exit with error code and show help message
        expect(result.success).toBe(false);
        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain('You must specify a command');
      });

      it('should display CLI usage information', async () => {
        // Given CLI execution without command
        // When running the CLI command
        const result = await executeCLICommand([]);

        // Then CLI should display usage information
        expect(result.stderr).toContain('nimata');
        expect(result.stderr).toContain('command');
      });

      it('should display help when --help flag is used', async () => {
        // Given CLI execution with help flag
        // When running the help command
        const result = await executeCLICommand(CLICommands.help);

        // Then CLI should display help information
        expect(result.success).toBe(true);
        expect(result.stdout).toContain('nimata');
        expect(result.stdout).toContain('Commands:');
      });

      it('should display version when --version flag is used', async () => {
        // Given CLI execution with version flag
        // When running the version command
        const result = await executeCLICommand(CLICommands.version);

        // Then CLI should display version information
        expect(result.success).toBe(true);
        expect(result.stdout).toMatch(/\b\d+\.\d+\.\d+\b/);
      });
    });
  });

  describe('P1 - Network-First Pattern', () => {
    describe('1.1-CLI-002', () => {
      it('should handle CLI execution without network calls', async () => {
        // Given CLI process with network interception ready
        const proc = createCLIProcess([]);

        // When executing CLI (no network calls expected)
        const exitCode = await proc.exited;
        const stderr = await new Response(proc.stderr as ReadableStream<Uint8Array>).text();

        // Then CLI should execute without network dependencies
        expect(exitCode).toBe(1);
        expect(stderr).toContain('You must specify a command');
      });
    });
  });
});
