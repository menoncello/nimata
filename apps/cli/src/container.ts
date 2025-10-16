/**
 * Dependency Injection Container
 *
 * Manual TSyringe registration (no decorators)
 * Story 1.1: Container setup with placeholder - services will be registered in future stories
 */
import 'reflect-metadata';
import { container } from 'tsyringe';
import { YargsCliBuilder, type CliBuilder } from './cli-builder.js';
import { ConsoleOutputWriter, type OutputWriter } from './output.js';

/**
 * Initialize and configure the DI container
 *
 * Story 1.1: Output writer registration
 * Future registrations will include:
 * - IScaffoldingService -> ScaffoldingService
 * - IFileSystem -> BunFileSystemAdapter
 * - IConfigService -> JsonConfigAdapter
 * - ITemplateEngine -> TemplateEngineAdapter
 */
export function configureContainer(): void {
  // Register output writer as singleton
  container.register<OutputWriter>('OutputWriter', {
    useClass: ConsoleOutputWriter,
  });

  // Register CLI builder
  container.register<CliBuilder>('CliBuilder', {
    useClass: YargsCliBuilder,
  });

  // CliApp will be registered automatically via @injectable decorator
  // Future service registrations will go here as they are implemented
}

/**
 * Get the configured DI container instance
 * @returns The TSyringe DI container
 */
export function getContainer(): typeof container {
  return container;
}

/**
 * Clear all container registrations (primarily for testing)
 */
export function clearContainer(): void {
  container.clearInstances();
}
