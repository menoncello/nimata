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
});
