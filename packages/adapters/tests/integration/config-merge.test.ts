import { describe, it, expect } from 'bun:test';
import {
  createConfigTestFixture,
  writeGlobalConfig,
  writeProjectConfig,
} from '../../../core/tests/fixtures/config-test-fixture';
import { YAMLConfigRepository } from '../../src/repositories/yaml-config-repository';

describe('Story 1.2 - AC3: Configuration System Deep Merge Integration', () => {
  const useConfigFixture = createConfigTestFixture(() => new YAMLConfigRepository());

  describe('P0 - Configuration Cascade', () => {
    it('should merge defaults with global config', async () => {
      // Given a global configuration file
      const fixture = useConfigFixture();
      await writeGlobalConfig(
        fixture,
        `
qualityLevel: medium
aiAssistants:
  - copilot
`
      );

      // When loading configuration
      const config = await fixture.repo.load(fixture.projectDir);

      // Then global config should be merged with defaults
      expect(config.qualityLevel).toBe('medium');
      expect(config.aiAssistants).toContain('copilot');
      expect(config.tools?.eslint?.enabled).toBe(true);
    });

    it('should merge project config over global config', async () => {
      // Given both global and project configuration files
      const fixture = useConfigFixture();
      await writeGlobalConfig(
        fixture,
        `
qualityLevel: medium
tools:
  eslint:
    configPath: global.eslintrc.json
`
      );
      await writeProjectConfig(
        fixture,
        `
qualityLevel: strict
tools:
  eslint:
    configPath: project.eslintrc.json
`
      );

      // When loading configuration
      const config = await fixture.repo.load(fixture.projectDir);

      // Then project config should override global config
      expect(config.qualityLevel).toBe('strict');
      expect(config.tools?.eslint?.configPath).toBe('project.eslintrc.json');
      expect(config.tools?.eslint?.enabled).toBe(true);
    });

    it('should use defaults when no config files exist', async () => {
      // Given no configuration files
      const fixture = useConfigFixture();

      // When loading configuration
      const config = await fixture.repo.load(fixture.projectDir);

      // Then default configuration should be used
      expect(config.qualityLevel).toBe('strict');
      expect(config.aiAssistants).toEqual(['claude-code']);
      expect(config.tools?.eslint?.enabled).toBe(true);
    });
  });

  describe('P1 - Deep Merge Scenarios', () => {
    it('should deeply merge nested tool configs', async () => {
      // Given a project configuration with nested tool settings
      const fixture = useConfigFixture();
      await writeProjectConfig(
        fixture,
        `
tools:
  typescript:
    strict: false
    target: ES2020
  prettier:
    enabled: false
`
      );

      // When loading configuration
      const config = await fixture.repo.load(fixture.projectDir);

      // Then nested properties should be merged correctly
      expect(config.tools?.typescript?.enabled).toBe(true);
      expect(config.tools?.typescript?.strict).toBe(false);
      expect(config.tools?.typescript?.target).toBe('ES2020');
      expect(config.tools?.prettier?.enabled).toBe(false);
    });
  });
});
