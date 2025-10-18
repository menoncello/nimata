/**
 * Configuration Test Fixture
 *
 * Provides common setup and teardown for configuration tests.
 * Eliminates repeated setup code across test files.
 */

import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { beforeEach, afterEach } from 'bun:test';

/**
 * Configuration test fixture interface
 */
export interface ConfigTestFixture {
  tempDir: string;
  repo: any; // YAMLConfigRepository will be injected
  globalConfigDir: string;
  projectDir: string;
  originalHome: string | undefined;
}

/**
 * Creates a configuration test fixture
 */
export function createConfigTestFixture(repoFactory: () => any): () => ConfigTestFixture {
  let fixture: ConfigTestFixture;

  beforeEach(async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'nimata-config-test-'));
    const originalHome = process.env['HOME'];

    // Set up test environment
    process.env['HOME'] = tempDir;

    const globalConfigDir = join(tempDir, '.nimata');
    await mkdir(globalConfigDir, { recursive: true });

    const projectDir = await mkdtemp(join(tempDir, 'project-'));

    fixture = {
      tempDir,
      repo: repoFactory(),
      globalConfigDir,
      projectDir,
      originalHome,
    };
  });

  afterEach(async () => {
    if (fixture?.originalHome) {
      process.env['HOME'] = fixture.originalHome;
    }
    if (fixture?.tempDir) {
      rm(fixture.tempDir, { recursive: true, force: true });
    }
  });

  return () => fixture;
}

/**
 * Helper to write global config
 */
export async function writeGlobalConfig(fixture: ConfigTestFixture, config: string): Promise<void> {
  await writeFile(join(fixture.globalConfigDir, 'config.yaml'), config);
}

/**
 * Helper to write project config
 */
export async function writeProjectConfig(
  fixture: ConfigTestFixture,
  config: string
): Promise<void> {
  await writeFile(join(fixture.projectDir, '.nimatarc'), config);
}

/**
 * Helper to create a temporary project directory
 */
export async function createTempProjectDir(baseDir: string): Promise<string> {
  return mkdtemp(join(baseDir, 'project-'));
}
