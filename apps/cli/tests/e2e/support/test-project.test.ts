import { existsSync } from 'node:fs';
import { describe, expect, test, afterEach } from 'bun:test';
import { TestProject, createTestProject } from './test-project.js';

describe('TestProject', () => {
  let testProject: TestProject | null = null;

  afterEach(async () => {
    if (testProject) {
      await testProject.cleanup();
      testProject = null;
    }
  });

  describe('create', () => {
    test('should create a new test project with default prefix', async () => {
      testProject = await TestProject.create();

      expect(testProject.path).toContain('nimata-test-');
      expect(existsSync(testProject.path)).toBe(true);
    });

    test('should create a new test project with custom prefix', async () => {
      testProject = await TestProject.create('custom-prefix-');

      expect(testProject.path).toContain('custom-prefix-');
      expect(existsSync(testProject.path)).toBe(true);
    });
  });

  describe('writeFile', () => {
    test('should write a file to the project directory', async () => {
      testProject = await TestProject.create();
      await testProject.writeFile('test.txt', 'test content');

      const content = await testProject.readFile('test.txt');
      expect(content).toBe('test content');
    });

    test('should create nested directories when writing', async () => {
      testProject = await TestProject.create();
      await testProject.writeFile('nested/dir/file.txt', 'nested content');

      const content = await testProject.readFile('nested/dir/file.txt');
      expect(content).toBe('nested content');
    });
  });

  describe('readFile', () => {
    test('should read a file from the project directory', async () => {
      testProject = await TestProject.create();
      await testProject.writeFile('read-test.txt', 'read content');

      const content = await testProject.readFile('read-test.txt');
      expect(content).toBe('read content');
    });

    test('should throw error if file does not exist', async () => {
      testProject = await TestProject.create();

      expect(async () => {
        if (!testProject) throw new Error('Test project not initialized');
        await testProject.readFile('non-existent.txt');
      }).toThrow();
    });
  });

  describe('fileExists', () => {
    test('should return true for existing file', async () => {
      testProject = await TestProject.create();
      await testProject.writeFile('exists.txt', 'content');

      expect(testProject.fileExists('exists.txt')).toBe(true);
    });

    test('should return false for non-existent file', async () => {
      testProject = await TestProject.create();

      expect(testProject.fileExists('does-not-exist.txt')).toBe(false);
    });
  });

  describe('resolve', () => {
    test('should resolve relative path to absolute path', async () => {
      testProject = await TestProject.create();
      const resolved = testProject.resolve('some/file.txt');

      expect(resolved).toContain(testProject.path);
      expect(resolved).toContain('some/file.txt');
    });
  });

  describe('writePackageJson', () => {
    test('should write package.json with proper formatting', async () => {
      testProject = await TestProject.create();
      const pkg = { name: 'test-pkg', version: '1.0.0' };
      await testProject.writePackageJson(pkg);

      const content = await testProject.readFile('package.json');
      expect(JSON.parse(content)).toEqual(pkg);
    });
  });

  describe('writeTsConfig', () => {
    test('should write tsconfig.json with proper formatting', async () => {
      testProject = await TestProject.create();
      const tsconfig = { compilerOptions: { strict: true } };
      await testProject.writeTsConfig(tsconfig);

      const content = await testProject.readFile('tsconfig.json');
      expect(JSON.parse(content)).toEqual(tsconfig);
    });
  });

  describe('scaffold', () => {
    test('should create basic TypeScript project structure with default name', async () => {
      testProject = await TestProject.create();
      await testProject.scaffold();

      expect(testProject.fileExists('package.json')).toBe(true);
      expect(testProject.fileExists('tsconfig.json')).toBe(true);
      expect(testProject.fileExists('src/index.ts')).toBe(true);

      const pkgContent = await testProject.readFile('package.json');
      const pkg = JSON.parse(pkgContent);
      expect(pkg.name).toBe('test-project');
    });

    test('should create basic TypeScript project structure with custom name', async () => {
      testProject = await TestProject.create();
      await testProject.scaffold('my-custom-project');

      const pkgContent = await testProject.readFile('package.json');
      const pkg = JSON.parse(pkgContent);
      expect(pkg.name).toBe('my-custom-project');
    });

    test('should create package.json with correct scripts', async () => {
      testProject = await TestProject.create();
      await testProject.scaffold();

      const pkgContent = await testProject.readFile('package.json');
      const pkg = JSON.parse(pkgContent);
      expect(pkg.scripts.build).toBe('tsc');
      expect(pkg.scripts.test).toBe('bun test');
    });

    test('should create tsconfig.json with correct compiler options', async () => {
      testProject = await TestProject.create();
      await testProject.scaffold();

      const tsconfigContent = await testProject.readFile('tsconfig.json');
      const tsconfig = JSON.parse(tsconfigContent);
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.target).toBe('ES2022');
    });
  });

  describe('cleanup', () => {
    test('should remove project directory', async () => {
      testProject = await TestProject.create();
      const projectPath = testProject.path;

      await testProject.cleanup();

      expect(existsSync(projectPath)).toBe(false);
    });

    test('should not throw error on double cleanup', async () => {
      testProject = await TestProject.create();

      await testProject.cleanup();
      await testProject.cleanup(); // Should not throw

      expect(true).toBe(true); // Test passes if no error thrown
    });

    test('should handle cleanup errors gracefully', async () => {
      testProject = await TestProject.create();
      // Mock a cleanup scenario by manually removing the directory
      await testProject.cleanup();

      // Second cleanup should handle missing directory gracefully
      await testProject.cleanup();

      expect(true).toBe(true); // Test passes if no error thrown
    });
  });

  describe('createTestProject helper', () => {
    test('should create test project with default prefix', async () => {
      testProject = await createTestProject();

      expect(testProject.path).toContain('nimata-test-');
      expect(existsSync(testProject.path)).toBe(true);
    });

    test('should create test project with custom prefix', async () => {
      testProject = await createTestProject('helper-test-');

      expect(testProject.path).toContain('helper-test-');
      expect(existsSync(testProject.path)).toBe(true);
    });
  });
});
