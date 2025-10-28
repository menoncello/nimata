/**
 * Types for Template Error Handler
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Error categories
 */
export enum ErrorCategory {
  SYNTAX = 'syntax',
  STRUCTURE = 'structure',
  CONTENT = 'content',
  DEPENDENCY = 'dependency',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  COMPATIBILITY = 'compatibility',
}

/**
 * Template error context
 */
export interface TemplateErrorContext {
  templateId?: string;
  filePath?: string;
  line?: number;
  column?: number;
  expression?: string;
  snippet?: string;
  rule?: string;
}

/**
 * Enhanced template error
 */
export interface TemplateError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: TemplateErrorContext;
  suggestion?: string;
  documentation?: string;
  fixes?: string[];
}

/**
 * Error recovery strategy
 */
export interface ErrorRecoveryStrategy {
  canRecover: boolean;
  strategy: 'skip' | 'replace' | 'fix' | 'abort';
  recoveredContent?: string;
  fallbackUsed?: boolean;
  manualInterventionRequired: boolean;
}
