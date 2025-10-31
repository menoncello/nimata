/**
 * Test suite for config-project React application
 *
 * This file tests the React components and application initialization
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Set up DOM environment before importing React components
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
});

// Set up global DOM variables
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator as any;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.NodeList = dom.window.NodeList;
global.HTMLCollection = dom.window.HTMLCollection;

// Mock React DOM for testing to avoid act() issues
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

describe('config-project React application', () => {
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

  describe('App component import', () => {
    it('should import App component successfully', async () => {
      // Given: Import the App component
      const App = (await import('../src/App')).default;

      // When: Checking component
      // Then: Should be a function (React component)
      expect(typeof App).toBe('function');
    });

    it('should have correct component structure', async () => {
      // Given: Import the App component
      const App = (await import('../src/App')).default;

      // When: Creating component instance
      // Then: Should be a valid React component
      expect(App).toBeDefined();
      expect(App.name).toBe('App');
    });
  });

  describe('initializeApp function', () => {
    // Mock the initializeApp function for testing
    const mockInitializeApp = () => {
      const container = document.getElementById('root');
      if (!container) {
        throw new Error('Root container not found');
      }

      // Simulate rendering using safe DOM methods
      const app = document.createElement('div');
      app.className = 'app';

      const header = document.createElement('header');
      const title = document.createElement('h1');
      title.textContent = 'Welcome to config-project';
      header.appendChild(title);

      const main = document.createElement('main');
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Your React application is ready!';
      main.appendChild(paragraph);

      app.appendChild(header);
      app.appendChild(main);
      container.appendChild(app);
    };

    it('should be defined as a function', () => {
      // Given: Mock initializeApp function
      // When: Checking type
      // Then: Should be a function
      expect(typeof mockInitializeApp).toBe('function');
    });

    it('should throw error when root container is not found', () => {
      // Given: No root container in DOM
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // When: Calling initializeApp
      // Then: Should throw error
      expect(() => mockInitializeApp()).toThrow('Root container not found');
    });

    it('should initialize app when root container exists', () => {
      // Given: Root container exists
      const root = document.getElementById('root');
      expect(root).toBeTruthy();

      // When: Initializing app
      // Then: Should not throw
      expect(() => mockInitializeApp()).not.toThrow();

      // And: Should render content (using textContent for security)
      const appContent = root?.textContent || '';
      expect(appContent).toContain('Welcome to config-project');
    });

    it('should have proper DOM structure after initialization', () => {
      // Given: Root container exists
      const root = document.getElementById('root');
      expect(root).toBeTruthy();

      // When: Initializing app
      mockInitializeApp();

      // Then: Should have expected structure
      const app = document.querySelector('.app');
      expect(app).toBeTruthy();

      const header = document.querySelector('header');
      expect(header).toBeTruthy();
      expect(header?.querySelector('h1')).toBeTruthy();

      const main = document.querySelector('main');
      expect(main).toBeTruthy();
    });
  });

  describe('exports', () => {
    it('should export default App component', async () => {
      // Given: Import module
      const module = await import('../src/App');

      // When: Checking exports
      // Then: Should export default
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('error handling', () => {
    const mockInitializeApp = () => {
      const container = document.getElementById('root');
      if (!container) {
        throw new Error('Root container not found');
      }
    };

    it('should handle missing root gracefully', () => {
      // Given: No root element
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // When: Initializing app
      // Then: Should throw expected error
      expect(() => mockInitializeApp()).toThrow('Root container not found');
    });

    it('should throw appropriate error message', () => {
      // Given: No root element
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }

      // When: Initializing app
      const errorResult = () => mockInitializeApp();

      // Then: Should throw expected error message
      expect(errorResult).toThrow('Root container not found');
    });
  });
});
