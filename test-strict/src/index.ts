/**
 * TestStrict
 *
 *
 *
 * @author
 * @license MIT
 * @version 1.0.0
 * @since 2025
 */

export const VERSION = '1.0.0';

export function hello(name: string = 'world'): string {
  return `Hello, ${name}!`;
}

export default {
  VERSION,
  hello,
};
