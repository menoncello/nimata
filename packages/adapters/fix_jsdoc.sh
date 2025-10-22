#!/bin/bash
# Fix JSDoc issues in copilot-content-builders.ts

# Add missing descriptions and @returns
sed -i '' '
# Fix getFrameworkGuidelines
s|\/\*$|
   * Get framework guidelines based on frameworks and project type|
; /^\* @param frameworks$/,/@param projectType/{
  s|\/\*|
   * Get framework guidelines based on frameworks and project type|
  s|^   \* @param frameworks$|   * @param frameworks - Array of framework names|
  s|^   \* @param projectType$|   * @param projectType - Project type identifier|
  a\
   * @returns Framework guidelines string
}
' src/generators/copilot-content-builders.ts
