#!/usr/bin/env bun
/**
 * Nìmata CLI - Entry Point
 *
 * AI-powered TypeScript project scaffolding with built-in quality validation
 *
 * This file is the CLI entry point and only handles the initial invocation.
 * All application logic is in app.ts for better testability.
 */
import 'reflect-metadata';
import { container } from 'tsyringe';
import { CliApp } from './app.js';
import { EXIT_CODES } from './constants.js';
import { configureContainer } from './container.js';

// Re-export for testing
export { EXIT_CODES };

// Run CLI only when executed directly (not when imported for testing)
if (import.meta.main) {
  // Configure DI container
  configureContainer();

  // Resolve and run CLI app
  const app = container.resolve(CliApp);
  app.run().catch((error: unknown) => {
    process.stderr.write(`Fatal error: ${error}\n`);
    process.exit(EXIT_CODES.CONFIG_ERROR);
  });
}
