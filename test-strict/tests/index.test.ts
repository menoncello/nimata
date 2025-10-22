/**
 * Unit tests for test-strict
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { hello, VERSION } from '../src/index';

describe('test-strict', () => {
  describe('hello function', () => {
    it('should return greeting with default name', () => {
      expect(hello()).toBe('Hello, world!');
    });

    it('should return greeting with custom name', () => {
      expect(hello('TypeScript')).toBe('Hello, TypeScript!');
    });
  });

  describe('VERSION', () => {
    it('should have correct version', () => {
      expect(VERSION).toBe('1.0.0');
    });
  });
});
