/**
 * Utilities for matching Handlebars blocks
 */

export interface BlockMatch {
  type: string;
  position: number;
  isOpen: boolean;
}

/**
 * Finds all block matches in template
 * @param template - Template string to search
 * @param pattern - Regex pattern to match
 * @param isOpen - Whether this pattern matches opening blocks
 * @returns Array of block matches with type and position
 */
export function findBlockMatches(template: string, pattern: RegExp, isOpen = true): BlockMatch[] {
  const matches: BlockMatch[] = [];
  let match;

  while ((match = pattern.exec(template)) !== null) {
    matches.push({
      type: match[1],
      position: match.index,
      isOpen,
    });
  }

  return matches;
}

/**
 * Matches opening and closing blocks to find unclosed ones
 * @param openBlockMatches - Array of opening block matches
 * @param closeBlockMatches - Array of closing block matches
 * @returns Array of unclosed block types
 */
export function matchBlocks(
  openBlockMatches: BlockMatch[],
  closeBlockMatches: BlockMatch[]
): string[] {
  const stack: string[] = [];
  const allMatches = [...openBlockMatches, ...closeBlockMatches].sort(
    (a, b) => a.position - b.position
  );

  for (const match of allMatches) {
    if (match.isOpen) {
      stack.push(match.type);
    } else {
      const lastOpenIndex = stack.lastIndexOf(match.type);
      if (lastOpenIndex > -1) {
        stack.splice(lastOpenIndex, 1);
      } else {
        // Found closing block without matching opening
        return [`Mismatched closing block: {{/${match.type}}}`];
      }
    }
  }

  return stack;
}
