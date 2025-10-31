/**
 * Button Styles Module
 *
 * Generates button component styles
 */

/**
 * Generates button styles
 */
export class ButtonStyles {
  /**
   * Generate button styles
   * @returns {string} Button CSS styles
   */
  generate(): string {
    return [
      this.getButtonStylesHeader(),
      this.getBaseButtonStyles(),
      this.getButtonDisabledStyles(),
      this.getButtonVariantStyles(),
      this.getButtonSizeStyles(),
    ].join('\n\n');
  }

  /**
   * Get button styles header
   * @returns {string} Button styles header
   */
  private getButtonStylesHeader(): string {
    return `/* Buttons */`;
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
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}`;
  }

  /**
   * Get button disabled styles
   * @returns {string} Button disabled CSS
   */
  private getButtonDisabledStyles(): string {
    return `.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`;
  }

  /**
   * Get button variant styles
   * @returns {string} Button variant CSS
   */
  private getButtonVariantStyles(): string {
    return [this.getPrimaryButtonStyles(), this.getSecondaryButtonStyles()].join('\n\n');
  }

  /**
   * Get primary button styles
   * @returns {string} Primary button CSS
   */
  private getPrimaryButtonStyles(): string {
    return `.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}`;
  }

  /**
   * Get secondary button styles
   * @returns {string} Secondary button CSS
   */
  private getSecondaryButtonStyles(): string {
    return `.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-white);
}`;
  }

  /**
   * Get button size styles
   * @returns {string} Button size CSS
   */
  private getButtonSizeStyles(): string {
    return [this.getSmallButtonStyles(), this.getLargeButtonStyles()].join('\n\n');
  }

  /**
   * Get small button styles
   * @returns {string} Small button CSS
   */
  private getSmallButtonStyles(): string {
    return `.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}`;
  }

  /**
   * Get large button styles
   * @returns {string} Large button CSS
   */
  private getLargeButtonStyles(): string {
    return `.btn--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}`;
  }
}
