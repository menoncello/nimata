# TypeScript Typecheck Fix Skill

Resolves all TypeScript compilation errors and type system issues.

## Usage

Execute `typecheck-fix` to run the complete TypeScript fixing workflow:

- Analyzes all TypeScript compilation errors across packages
- Fixes missing types, type mismatches, and generic issues
- Resolves complex type system problems (generics, interfaces, constraints)
- Improves type safety without using `any` type
- Maintains code functionality while enhancing type coverage

## Process

1. **Assessment**: `bunx turbo typecheck` to catalog all type errors
2. **Critical Fixes**: Missing types, implicit any, type mismatches
3. **Complex Resolution**: Generic constraints, interface compatibility, advanced types
4. **Validation**: Verify 0 TypeScript errors across all packages

## Result

Returns comprehensive report of all type fixes applied with improved type safety metrics.
