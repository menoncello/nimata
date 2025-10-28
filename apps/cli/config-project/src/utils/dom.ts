/**
 * DOM Utilities
 *
 * DOM manipulation helpers for config-project
 */

/**
 * Wait for DOM to be ready
 * @param callback - Function to call when DOM is ready
 */
export function domReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Create element with attributes and children
 * @param tagName - HTML tag name
 * @param attributes - Element attributes
 * @param children - Child elements or text
 * @returns Created element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: Record<string, string> = {},
  ...children: Array<string | Element>
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // Add children
  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }

  return element;
}

/**
 * Query selector with type safety
 * @param selector - CSS selector
 * @param parent - Parent element to search in
 * @returns Found element or null
 */
export function querySelector<T extends Element>(
  selector: string,
  parent: Element | Document = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Query selector all with type safety
 * @param selector - CSS selector
 * @param parent - Parent element to search in
 * @returns Array of found elements
 */
export function querySelectorAll<T extends Element>(
  selector: string,
  parent: Element | Document = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Add event listener with automatic cleanup
 * @param element - Element to add listener to
 * @param event - Event name
 * @param handler - Event handler
 * @param options - Event listener options
 * @returns Cleanup function
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);

  return () => {
    element.removeEventListener(event, handler, options);
  };
}

/**
 * Debounce function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
