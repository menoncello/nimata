/**
 * Test suite for config-project React application initialization
 *
 * This file tests the React application initialization functionality
 */

import { describe, it, expect, beforeEach, afterEach, mock, spyOn } from 'bun:test';

// Simple DOM implementation for testing
class MockElement {
  children: MockElement[] = [];
  classList = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    add: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    remove: () => {},
    contains: () => false,
  };
  textContent = '';
  innerHTML = '';
  id = '';
  style = {};

  appendChild(child: MockElement) {
    this.children.push(child);
  }

  removeChild(child: MockElement) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }
}

class MockDocument extends MockElement {
  body = new MockElement();
  private allElements: MockElement[] = [];

  createElement(_tagName: string) {
    const element = new MockElement();
    this.allElements.push(element);
    return element as any;
  }

  getElementById(id: string) {
    return this.allElements.find((element) => element.id === id) || null;
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }
}

// Mock React DOM for testing
mock.module('react-dom/client', () => ({
  createRoot: () => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unmount: () => {},
  }),
}));

describe('config-project React application initialization', () => {
  beforeEach(() => {
    // Setup mock DOM
    global.document = new MockDocument() as any;
    global.window = {
      location: { href: 'http://localhost' },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      addEventListener: () => {},
    } as any;

    // Create root element for testing
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Mock console methods to avoid noise in tests
    spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty mock to suppress console errors during tests
    });
  });

  afterEach(() => {
    // Clear document body
    if (global.document) {
      while ((global.document as any).body.firstChild) {
        (global.document as any).body.removeChild((global.document as any).body.firstChild);
      }
      // Clear the allElements array to reset DOM state
      (global.document as any).allElements = [];
    }

    // Restore mocks
    /* eslint-disable no-console */
    if (console.error.mockRestore) {
      console.error.mockRestore();
    }
    /* eslint-enable no-console */
  });

  describe('initializeApp function', () => {
    it('should be defined as a function', async () => {
      // Given: Import the initializeApp function
      const { initializeApp } = await import('../src/index');

      // When: Checking type
      // Then: Should be a function
      expect(typeof initializeApp).toBe('function');
    });

    it('should throw error when root container is not found', async () => {
      // Given: No root container in DOM
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      // Clear the allElements array to simulate empty DOM
      (global.document as any).allElements = [];

      // When: Importing and calling initializeApp
      const { initializeApp } = await import('../src/index');

      // Then: Should throw error
      expect(() => initializeApp()).toThrow('Root container not found');
    });

    it('should initialize app when root container exists', async () => {
      // Given: Root container exists
      const root = document.getElementById('root');
      expect(root).toBeTruthy();

      // When: Importing and calling initializeApp
      const { initializeApp } = await import('../src/index');

      // Then: Should not throw
      expect(() => initializeApp()).not.toThrow();
    });
  });

  describe('exports', () => {
    it('should export initializeApp function', async () => {
      // Given: Import module
      const module = await import('../src/index');

      // When: Checking exports
      // Then: Should export initializeApp
      expect(module.initializeApp).toBeDefined();
      expect(typeof module.initializeApp).toBe('function');
    });
  });
});
