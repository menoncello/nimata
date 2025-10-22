/**
 * Unit Tests - TSyringe Container
 *
 * Story 1.1: Test container initialization and lifecycle
 */
import { describe, it, expect, beforeEach, spyOn } from 'bun:test';
import { configureContainer, getContainer, clearContainer } from '../../src/container.js';

describe('DI Container', () => {
  beforeEach(() => {
    clearContainer();
  });

  it('should initialize container without errors', () => {
    expect(() => configureContainer()).not.toThrow();
  });

  it('should return container instance', () => {
    configureContainer();
    const container = getContainer();
    expect(container).toBeDefined();
  });

  it('should clear container instances', () => {
    configureContainer();
    expect(() => clearContainer()).not.toThrow();
  });

  it('should allow multiple container configurations', () => {
    configureContainer();
    expect(() => configureContainer()).not.toThrow();
  });

  it('should call clearInstances on container when clearContainer is called', () => {
    const container = getContainer();
    const clearSpy = spyOn(container, 'clearInstances');

    clearContainer();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('should register OutputWriter service', () => {
    configureContainer();
    const container = getContainer();

    const outputWriter = container.resolve('OutputWriter');

    expect(outputWriter).toBeDefined();
    expect(typeof outputWriter.stdout).toBe('function');
    expect(typeof outputWriter.stderr).toBe('function');
    expect(typeof outputWriter.log).toBe('function');
  });

  it('should register CliBuilder service', () => {
    configureContainer();
    const container = getContainer();

    const cliBuilder = container.resolve('CliBuilder');

    expect(cliBuilder).toBeDefined();
    expect(typeof cliBuilder.create).toBe('function');
  });

  it('should configure container with actual registrations (not empty)', () => {
    const container = getContainer();
    configureContainer();

    // Verify container has registrations by attempting to resolve
    expect(() => container.resolve('OutputWriter')).not.toThrow();
    expect(() => container.resolve('CliBuilder')).not.toThrow();
  });
});
