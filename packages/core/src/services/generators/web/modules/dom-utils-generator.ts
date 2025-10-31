/**
 * DOM Utilities Generator
 *
 * Generates DOM utility functions for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate DOM utilities
 * @param {ProjectConfig} _config - Project configuration (unused)
 * @returns {string} DOM utilities code
 */
export function generateDOMUtils(_config: ProjectConfig): string {
  return `${generateDOMUtilityFunctions()}${generateViewportFunctions()}${generateStyleFunctions()}${generateEventFunctions()}${generateClipboardFunctions()}${generateScrollbarFunctions()}${generatePerformanceFunctions()}`;
}

/**
 * Generate basic DOM utility functions
 * @returns {string} Basic DOM utility functions code
 */
function generateDOMUtilityFunctions(): string {
  return `/**
 * DOM utility functions
 */

/**
 * Wait for DOM to be ready
  * @param {string} callback - Function to execute when DOM is ready
 */
export const domReady = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

`;
}

/**
 * Generate viewport-related functions
 * @returns {string} Viewport functions code
 */
function generateViewportFunctions(): string {
  return `/**
 * Check if element is in viewport
  * @param {string} element - Element to check
  * @returns {boolean} if element is in viewport
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to element
  * @param {string} element - Element to scroll to
  * @param {string} offset - Offset from top (default: 0)
 */
export const scrollToElement = (element: Element, offset: number = 0): void => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

`;
}

/**
 * Generate style-related functions
 * @returns {string} Style functions code
 */
function generateStyleFunctions(): string {
  return `/**
 * Get element's computed style
  * @param {string} element - Element to get style from
  * @param {string} property - CSS property to get
  * @returns {string} CSS property value
 */
export const getComputedStyle = (
  element: Element,
  property: string
): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

`;
}

/**
 * Generate event handling functions
 * @returns {string} Event functions code
 */
function generateEventFunctions(): string {
  return `${generateEventListenerFunction()}${generatePortalContainerFunction()}`;
}

/**
 * Generate event listener with cleanup function
 * @returns {string} Event listener function code
 */
function generateEventListenerFunction(): string {
  return `/**
 * Add event listener with automatic cleanup
  * @param {string} element - Element to add listener to
  * @param {string} event - Event type
  * @param {string} handler - Event handler
  * @param {string} options - Event listener options
  * @returns {string} Cleanup function
 */
export const addEventListenerWithCleanup = <T extends EventTarget>(
  element: T,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  element.addEventListener(event, handler, options);

  return () => {
    element.removeEventListener(event, handler, options);
  };
};

`;
}

/**
 * Generate portal container function
 * @returns {string} Portal container function code
 */
function generatePortalContainerFunction(): string {
  return `/**
 * Create portal container
  * @param {string} id - Container ID
  * @returns {string} Container element
 */
export const createPortalContainer = (id: string): HTMLElement => {
  let container = document.getElementById(id);

  if (!container) {
    container = document.createElement('div');
    container.id = id;
    document.body.appendChild(container);
  }

  return container;
};

`;
}

/**
 * Generate clipboard-related functions
 * @returns {string} Clipboard functions code
 */
function generateClipboardFunctions(): string {
  return `/**
 * Copy text to clipboard
  * @param {string} text - Text to copy
  * @returns {Promise<void>} that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

`;
}

/**
 * Generate scrollbar-related functions
 * @returns {string} Scrollbar functions code
 */
function generateScrollbarFunctions(): string {
  return `/**
 * Check if element has scrollbar
 * @param {string} element - Element to check
 * @returns {boolean} if element has scrollbar
 */
export const hasScrollbar = (element: Element): boolean => {
  return element.scrollHeight > element.clientHeight;
};

/**
 * Get scrollbar width
 * @returns {string} Scrollbar width in pixels
 */
export const getScrollbarWidth = (): number => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};

`;
}

/**
 * Generate performance-related functions (debounce, throttle)
 * @returns {string} Performance functions code
 */
function generatePerformanceFunctions(): string {
  return `${generateDebounceFunction()}${generateThrottleFunction()}`;
}

/**
 * Generate debounce function
 * @returns {string} Debounce function code
 */
function generateDebounceFunction(): string {
  return `/**
 * Debounce function
  * @param {string} func - Function to debounce
  * @param {string} delay - Delay in milliseconds
  * @returns {string} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

`;
}

/**
 * Generate throttle function
 * @returns {string} Throttle function code
 */
function generateThrottleFunction(): string {
  return `/**
 * Throttle function
  * @param {string} func - Function to throttle
  * @param {string} limit - Time limit in milliseconds
  * @returns {string} Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
`;
}
