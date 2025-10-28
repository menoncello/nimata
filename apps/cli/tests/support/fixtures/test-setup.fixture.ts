/**
 * Test Setup Fixture
 *
 * Provides common test setup and teardown functionality
 * with proper resource management and cleanup
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { createTempDirectory, cleanupTempDirectory } from '../helpers/file-assertions.js';

export interface TestFixture {
  tempDir: string;
  projectPath: string;
  cleanup: () => Promise<void>;
}

export interface ProjectTestFixture extends TestFixture {
  projectName: string;
}

/**
 * Create a basic test fixture with temporary directory
 */
export async function createTestFixture(prefix = 'nimata-test-'): Promise<TestFixture> {
  const tempDir = await createTempDirectory(prefix);
  const projectPath = tempDir;

  return {
    tempDir,
    projectPath,
    cleanup: async () => {
      await cleanupTempDirectory(tempDir);
    },
  };
}

/**
 * Create a project-specific test fixture
 */
export async function createProjectTestFixture(
  projectName: string,
  prefix = 'project-test-'
): Promise<ProjectTestFixture> {
  const tempDir = await createTempDirectory(prefix);
  const projectPath = `${tempDir}/${projectName}`;

  return {
    tempDir,
    projectPath,
    projectName,
    cleanup: async () => {
      await cleanupTempDirectory(tempDir);
    },
  };
}

/**
 * Test fixture manager for handling multiple test fixtures
 */
export class TestFixtureManager {
  private fixtures: TestFixture[] = [];

  /**
   * Create and register a new test fixture
   */
  async createFixture(prefix?: string): Promise<TestFixture> {
    const fixture = await createTestFixture(prefix);
    this.fixtures.push(fixture);
    return fixture;
  }

  /**
   * Create and register a new project test fixture
   */
  async createProjectFixture(projectName: string, prefix?: string): Promise<ProjectTestFixture> {
    const fixture = await createProjectTestFixture(projectName, prefix);
    this.fixtures.push(fixture);
    return fixture;
  }

  /**
   * Clean up all registered fixtures
   */
  async cleanupAll(): Promise<void> {
    const cleanupPromises = this.fixtures.map((fixture) => fixture.cleanup());
    await Promise.allSettled(cleanupPromises);
    this.fixtures = [];
  }

  /**
   * Get the number of active fixtures
   */
  get fixtureCount(): number {
    return this.fixtures.length;
  }
}

/**
 * Helper function to run tests with automatic fixture management
 */
export function withTestFixture<T>(testFn: (fixture: TestFixture) => Promise<T>): () => Promise<T> {
  return async (): Promise<T> => {
    const fixture = await createTestFixture();
    try {
      return await testFn(fixture);
    } finally {
      await fixture.cleanup();
    }
  };
}

/**
 * Helper function to run tests with project fixture management
 */
export function withProjectTestFixture<T>(
  projectName: string,
  testFn: (fixture: ProjectTestFixture) => Promise<T>
): () => Promise<T> {
  return async (): Promise<T> => {
    const fixture = await createProjectTestFixture(projectName);
    try {
      return await testFn(fixture);
    } finally {
      await fixture.cleanup();
    }
  };
}

/**
 * Test runner with built-in fixture management
 */
export class FixtureTestRunner {
  private fixtureManager: TestFixtureManager;

  constructor() {
    this.fixtureManager = new TestFixtureManager();
  }

  /**
   * Run a test with a temporary fixture
   */
  async withFixture<T>(testFn: (fixture: TestFixture) => Promise<T>, prefix?: string): Promise<T> {
    const fixture = await this.fixtureManager.createFixture(prefix);
    try {
      return await testFn(fixture);
    } finally {
      // Fixture is automatically managed by the manager
    }
  }

  /**
   * Run a test with a project fixture
   */
  async withProjectFixture<T>(
    projectName: string,
    testFn: (fixture: ProjectTestFixture) => Promise<T>,
    prefix?: string
  ): Promise<T> {
    const fixture = await this.fixtureManager.createProjectFixture(projectName, prefix);
    try {
      return await testFn(fixture);
    } finally {
      // Fixture is automatically managed by the manager
    }
  }

  /**
   * Clean up all fixtures
   */
  async cleanup(): Promise<void> {
    await this.fixtureManager.cleanupAll();
  }
}

/**
 * Global test setup with fixture management
 */
export function setupTestFixtureTests(): TestFixtureManager {
  const fixtureManager = new TestFixtureManager();

  beforeEach(() => {
    // Reset fixture manager before each test
    fixtureManager.cleanupAll();
  });

  afterEach(async () => {
    // Clean up any remaining fixtures after each test
    await fixtureManager.cleanupAll();
  });

  return fixtureManager;
}
