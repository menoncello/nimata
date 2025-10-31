/**
 * Test suite for config-project React application initialization
 *
 * This file tests the React application initialization functionality
 */

import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Set up DOM environment before importing React components

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
});

// Set up global DOM variables
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator as any;

// Mock React DOM for testing
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

describe('config-project React application initialization', () => {
  beforeEach(() => {
    // Clear DOM before each test using safe methods
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    // Create root element for testing
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initializeApp function', () => {
    it('should be defined as a function', async () => {
      // Given: Import the initializeApp function
      const { initializeApp } = await import('../src/index.tsx');

      // When: Checking type
      // Then: Should be a function
      expect(typeof initializeApp).toBe('function');
    });

    it('should throw error when root container is not found', async () => {
      // Given: No root container in DOM
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // When: Importing and calling initializeApp
      const { initializeApp } = await import('../src/index.tsx');

      // Then: Should throw error
      expect(() => initializeApp()).toThrow('Root container not found');
    });

    it('should initialize app when root container exists', async () => {
      // Given: Root container exists
      const root = document.getElementById('root');
      expect(root).toBeTruthy();

      // When: Importing and calling initializeApp
      const { initializeApp } = await import('../src/index.tsx');

      // Then: Should not throw
      expect(() => initializeApp()).not.toThrow();
    });
  });

  describe('exports', () => {
    it('should export initializeApp function', async () => {
      // Given: Import module
      const module = await import('../src/index.tsx');

      // When: Checking exports
      // Then: Should export initializeApp
      expect(module.initializeApp).toBeDefined();
      expect(typeof module.initializeApp).toBe('function');
    });
  });
});
