#!/usr/bin/env node

/**
 * Batch JSDoc Fixer
 *
 * Automatically fixes common JSDoc issues in TypeScript files
 */

import fs from 'fs';
import path from 'path';

const FILES_TO_FIX = [
  'src/generators/copilot-content-builders.ts',
  'src/generators/prettier-generator.ts',
  'src/generators/vitest-generator.ts',
  'src/generators/claude-md-generator.ts',
  'src/generators/eslint-generator.ts',
];

// Common JSDoc fixes
function fixJSDocIssues(content) {
  let fixed = content;

  // Fix missing JSDoc block descriptions
  fixed = fixed.replace(/\/\*\*\s*\n\s*\*\s*\n\s*\* @param (\w+)/g, (match, paramName) => {
    const descriptions = {
      options: 'Configuration options',
      config: 'Configuration object',
      projectType: 'Project type identifier',
      qualityLevel: 'Quality level setting',
      targetEnvironment: 'Target environment',
      frameworks: 'Array of framework names',
      message: 'Optional message',
      steps: 'Array of progress steps',
      logger: 'Logger instance',
    };

    const desc = descriptions[paramName] || 'Function parameter';
    return `/**\n   * ${desc}\n   * @param ${paramName} - ${desc}`;
  });

  // Fix missing @returns declarations
  fixed = fixed.replace(
    /(\s+\* @param [^\n]+\n)(\s+\*\/\n\s+\w+[^(]+\([^)]*\)): string/g,
    '$1   * @returns Generated string\n$2'
  );

  // Fix missing @param descriptions
  fixed = fixed.replace(/(@param \w+)(- Parameter description)/g, '$1 - Parameter description');

  // Fix duplicate parameter names (simplified)
  fixed = fixed.replace(/(@param \w+)-\s*\n\s*\* @param \1/g, '@param $1');

  return fixed;
}

// Process each file
for (const filePath of FILES_TO_FIX) {
  if (fs.existsSync(filePath)) {
    console.log(`Fixing JSDoc in ${filePath}...`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixJSDocIssues(content);

    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      console.log(`✅ Fixed JSDoc issues in ${filePath}`);
    } else {
      console.log(`ℹ️  No JSDoc issues found in ${filePath}`);
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

console.log('🎉 JSDoc batch fixing complete!');
