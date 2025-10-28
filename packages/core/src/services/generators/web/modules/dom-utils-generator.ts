/**
 * DOM Utilities Generator
 *
 * Generates DOM utility functions for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate DOM utilities
 * @param _config - Project configuration (unused)
 * @returns DOM utilities code
 */
export function generateDOMUtils(_config: ProjectConfig): string {
  return `/**
 * DOM utility functions
 */

/**
 * Wait for DOM to be ready
 * @param callback - Function to execute when DOM is ready
 */
export const domReady = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

/**
 * Check if element is in viewport
 * @param element - Element to check
 * @returns True if element is in viewport
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
 * @param element - Element to scroll to
 * @param offset - Offset from top (default: 0)
 */
export const scrollToElement = (element: Element, offset: number = 0): void => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Get element's computed style
 * @param element - Element to get style from
 * @param property - CSS property to get
 * @returns CSS property value
 */
export const getComputedStyle = (
  element: Element,
  property: string
): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Add event listener with automatic cleanup
 * @param element - Element to add listener to
 * @param event - Event type
 * @param handler - Event handler
 * @param options - Event listener options
 * @returns Cleanup function
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

/**
 * Create portal container
 * @param id - Container ID
 * @returns Container element
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

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
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

/**
 * Check if element has scrollbar
 * @param element - Element to check
 * @returns True if element has scrollbar
 */
export const hasScrollbar = (element: Element): boolean => {
  return element.scrollHeight > element.clientHeight;
};

/**
 * Get scrollbar width
 * @returns Scrollbar width in pixels
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

/**
 * Debounce function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
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

/**
 * Throttle function
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
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
