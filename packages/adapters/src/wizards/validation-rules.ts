/**
 * Validation rules for wizard prompts
 */

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  help?: string;
  type: 'text' | 'list' | 'checkbox' | 'confirm';
  required: boolean;
  defaultValue?: unknown | ((config: Record<string, unknown>) => unknown);
  options?: Array<{ label: string; value: unknown; description?: string }>;
  validation?: Array<{
    type: 'required' | 'pattern' | 'length' | 'custom';
    message: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
    validator?: (value: unknown) => boolean | string;
  }>;
  condition?: (config: Record<string, unknown>) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate user input against step validation rules
 * @param step - The wizard step with validation rules
 * @param value - The user input value to validate
 * @returns Validation result with any errors
 */
export function validateStepInput(step: WizardStep, value: unknown): ValidationResult {
  const errors: string[] = [];

  // Check required field validation
  if (isRequiredFieldEmpty(step, value)) {
    errors.push('This field is required');
    return { valid: false, errors };
  }

  // Skip validation if field is optional and empty
  if (isOptionalFieldEmpty(step, value)) {
    return { valid: true, errors: [] };
  }

  // Run validation rules
  runValidationRules(step, value, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if required field is empty
 * @param step - The wizard step
 * @param value - The input value
 * @returns True if required field is empty
 */
export function isRequiredFieldEmpty(step: WizardStep, value: unknown): boolean {
  return step.required && (value === undefined || value === null || value === '');
}

/**
 * Check if optional field is empty
 * @param step - The wizard step
 * @param value - The input value
 * @returns True if optional field is empty
 */
export function isOptionalFieldEmpty(step: WizardStep, value: unknown): boolean {
  return !step.required && (value === undefined || value === null || value === '');
}

/**
 * Run all validation rules for a step
 * @param step - The wizard step
 * @param value - The input value
 * @param errors - Array to collect validation errors
 */
export function runValidationRules(step: WizardStep, value: unknown, errors: string[]): void {
  if (!step.validation) {
    return;
  }

  for (const rule of step.validation) {
    validateRule(rule, value, errors);
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function validateRule(
  rule: {
    type: 'required' | 'pattern' | 'length' | 'custom';
    message: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
    validator?: (value: unknown) => boolean | string;
  },
  value: unknown,
  errors: string[]
): void {
  switch (rule.type) {
    case 'pattern':
      validatePatternRule(rule, value, errors);
      break;
    case 'length':
      validateLengthRule(rule, value, errors);
      break;
    case 'custom':
      validateCustomRule(rule, value, errors);
      break;
    default:
      break;
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function validatePatternRule(
  rule: { pattern?: RegExp; message: string },
  value: unknown,
  errors: string[]
): void {
  if (typeof value !== 'string' || !rule.pattern) {
    return;
  }

  if (!rule.pattern.test(value)) {
    errors.push(rule.message);
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function validateLengthRule(
  rule: { min?: number; max?: number; message: string },
  value: unknown,
  errors: string[]
): void {
  if (typeof value !== 'string') {
    return;
  }

  if (rule.min && value.length < rule.min) {
    errors.push(rule.message);
  }

  if (rule.max && value.length > rule.max) {
    errors.push(rule.message);
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function validateCustomRule(
  rule: { validator?: (value: unknown) => boolean | string; message: string },
  value: unknown,
  errors: string[]
): void {
  if (!rule.validator) {
    return;
  }

  const result = rule.validator(value);
  if (typeof result === 'string') {
    errors.push(result);
  } else if (!result) {
    errors.push(rule.message);
  }
}
