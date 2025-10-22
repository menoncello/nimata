/**
 * Test Fixtures [T910]
 *
 * Reusable test fixtures with auto-cleanup and composable capabilities.
 * Reduces setup duplication and ensures test isolation.
 * Priority: P2 - Test infrastructure improvement
 */
import { container } from 'tsyringe';
import type { OutputWriter } from '../../../src/output.js';
import { MockOutputWriter } from '../../unit/test-helpers.js';
import { createTempDirectoryPath, cleanupTempDirectory } from '../helpers/file-assertions';

/**
 * DI Container fixture with automatic cleanup
 */
export function useDIContainer() {
  // Setup
  container.clearInstances();

  // Teardown function
  return (): void => {
    container.clearInstances();
  };
}

/**
 * Output Writer fixture with MockOutputWriter
 */
export function useOutputWriter(): MockOutputWriter {
  const mockOutputWriter = new MockOutputWriter();

  // Register instance in container
  container.registerInstance<OutputWriter>('OutputWriter', mockOutputWriter);

  return mockOutputWriter;
}

/**
 * Temporary directory fixture with auto-cleanup
 */
export async function useTempDirectory(): Promise<{
  tempDir: string;
  cleanup: () => Promise<void>;
}> {
  // Setup
  const tempDir = createTempDirectoryPath();

  // Teardown function
  const cleanup = async (): Promise<void> => {
    await cleanupTempDirectory(tempDir);
  };

  return { tempDir, cleanup };
}

/**
 * Combined fixture for standard CLI command testing
 */
export async function useCLICommandFixture(): Promise<{
  mockOutput: MockOutputWriter;
  tempDir: string;
  cleanup: () => Promise<void>;
}> {
  const cleanupDI = useDIContainer();
  const mockOutput = useOutputWriter();
  const { tempDir, cleanup: cleanupTemp } = await useTempDirectory();

  // Combined cleanup
  const cleanupAll = async (): Promise<void> => {
    cleanupDI();
    await cleanupTemp();
  };

  return {
    mockOutput,
    tempDir,
    cleanup: cleanupAll,
  };
}

/**
 * Pure helper functions (framework-agnostic)
 */
export async function setupDIContainer(): Promise<{ mockOutputWriter: MockOutputWriter }> {
  container.clearInstances();
  const mockOutputWriter = new MockOutputWriter();
  container.registerInstance<OutputWriter>('OutputWriter', mockOutputWriter);
  return { mockOutputWriter };
}

export async function setupTempDirectory(): Promise<{
  tempDir: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = createTempDirectoryPath();
  return {
    tempDir,
    cleanup: () => cleanupTempDirectory(tempDir),
  };
}
