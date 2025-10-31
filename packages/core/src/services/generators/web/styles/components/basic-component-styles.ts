/**
 * Basic Component Styles Generator
 *
 * Generates CSS for basic UI components like buttons, cards, and form inputs
 */

/**
 * Generates CSS styles for basic UI components
 * @returns {string} CSS string for basic components
 */
export class BasicComponentStyles {
  /**
   * Generates CSS for buttons
   * @returns {string} CSS string for button styles
   */
  private generateButtonStyles(): string {
    const baseButton = this.getBaseButtonStyles();
    const primaryButton = this.getPrimaryButtonStyles();
    const secondaryButton = this.getSecondaryButtonStyles();

    return `${baseButton}

${primaryButton}

${secondaryButton}`;
  }

  /**
   * Get base button styles
   * @returns {string} Base button CSS
   */
  private getBaseButtonStyles(): string {
    return `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}`;
  }

  /**
   * Get primary button styles
   * @returns {string} Primary button CSS
   */
  private getPrimaryButtonStyles(): string {
    return `.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
}`;
  }

  /**
   * Get secondary button styles
   * @returns {string} Secondary button CSS
   */
  private getSecondaryButtonStyles(): string {
    return `.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: var(--color-white);
}`;
  }

  /**
   * Generates CSS for cards
   * @returns {string} CSS string for card styles
   */
  private generateCardStyles(): string {
    return `.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}`;
  }

  /**
   * Generates CSS for form inputs
   * @returns {string} CSS string for form input styles
   */
  private generateFormInputStyles(): string {
    return `.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}`;
  }

  /**
   * Generates complete CSS for basic components
   * @returns {string} Complete CSS string for basic components
   */
  generateBasicComponentStyles(): string {
    const buttonStyles = this.generateButtonStyles();
    const cardStyles = this.generateCardStyles();
    const formInputStyles = this.generateFormInputStyles();

    return `/* Component Styles */
${buttonStyles}

${cardStyles}

${formInputStyles}`;
  }
}
