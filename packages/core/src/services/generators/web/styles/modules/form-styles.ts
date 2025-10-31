/**
 * Form Styles Module
 *
 * Generates form component styles
 */

/**
 * Generates form styles
 */
export class FormStyles {
  /**
   * Generate form styles
   * @returns {string} Form CSS styles
   */
  generate(): string {
    const formGroup = this.getFormGroupStyles();
    const formLabel = this.getFormLabelStyles();
    const formInput = this.getFormInputStyles();
    const formError = this.getFormErrorStyles();

    return `/* Forms */
${formGroup}

${formLabel}

${formInput}

${formError}`;
  }

  /**
   * Get form group styles
   * @returns {string} Form group CSS
   */
  private getFormGroupStyles(): string {
    return `.form-group {
  margin-bottom: var(--space-4);
}`;
  }

  /**
   * Get form label styles
   * @returns {string} Form label CSS
   */
  private getFormLabelStyles(): string {
    return `.form-label {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--space-2);
}`;
  }

  /**
   * Get form input styles
   * @returns {string} Form input CSS
   */
  private getFormInputStyles(): string {
    return `.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}`;
  }

  /**
   * Get form error styles
   * @returns {string} Form error CSS
   */
  private getFormErrorStyles(): string {
    return `.form-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
}`;
  }
}
