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
 * @param {WizardStep} step - The wizard step with validation rules
 * @param {unknown} value - The user input value to validate
 * @returns {ValidationResult} Validation result with any errors
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
 * @param {WizardStep} step - The wizard step
 * @param {unknown} value - The input value
 * @returns {boolean} True if required field is empty
 */
export function isRequiredFieldEmpty(step: WizardStep, value: unknown): boolean {
  return step.required && (value === undefined || value === null || value === '');
}

/**
 * Check if optional field is empty
 * @param {WizardStep} step - The wizard step
 * @param {unknown} value - The input value
 * @returns {boolean} True if optional field is empty
 */
export function isOptionalFieldEmpty(step: WizardStep, value: unknown): boolean {
  return !step.required && (value === undefined || value === null || value === '');
}

/**
 * Run all validation rules for a step
 * @param {WizardStep} step - The wizard step
 * @param {unknown} value - The input value
 * @param {string[]} errors - Array to collect validation errors
 */
export function runValidationRules(step: WizardStep, value: unknown, errors: string[]): void {
  if (!step.validation) {
    return;
  }

  for (const rule of step.validation) {
    validateRule(rule, value, errors);
  }
}

/**
 * Validate a single rule against a value
 * @param {object} rule - The validation rule to apply
 * @param {'required' | 'pattern' | 'length' | 'custom'} rule.type - The type of validation rule
 * @param {string} rule.message - The error message to display if validation fails
 * @param {RegExp} [rule.pattern] - The regex pattern for pattern validation
 * @param {number} [rule.min] - The minimum length value for length validation
 * @param {number} [rule.max] - The maximum length value for length validation
 * @param {(value: unknown) => boolean | string} [rule.validator] - The custom validator function
 * @param {unknown} value - The value to validate
 * @param {string[]} errors - Array to collect validation errors
 */
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

/**
 * Validate pattern rule against a value
 * @param {object} rule - Pattern validation rule
 * @param {RegExp} [rule.pattern] - The regex pattern to match against
 * @param {string} rule.message - The error message to display if pattern doesn't match
 * @param {unknown} value - The value to validate
 * @param {string[]} errors - Array to collect validation errors
 */
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

/**
 * Validate length rule against a value
 * @param {object} rule - Length validation rule
 * @param {number} [rule.min] - The minimum allowed length
 * @param {number} [rule.max] - The maximum allowed length
 * @param {string} rule.message - The error message to display if length constraints are violated
 * @param {unknown} value - The value to validate
 * @param {string[]} errors - Array to collect validation errors
 */
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

/**
 * Validate custom rule against a value
 * @param {object} rule - Custom validation rule
 * @param {(value: unknown) => boolean | string} [rule.validator] - The custom validator function
 * @param {string} rule.message - The error message to display if validation fails
 * @param {unknown} value - The value to validate
 * @param {string[]} errors - Array to collect validation errors
 */
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
