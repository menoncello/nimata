/**
 * Utility Styles Generator
 *
 * Generates CSS utility classes for common styling needs
 */

/**
 * Generates CSS utility classes
 * @returns {string} CSS string for utility classes
 */
export class UtilityStyles {
  /**
   * Generates accessibility utilities
   * @returns {string} CSS string for accessibility utilities
   */
  private generateAccessibilityUtilities(): string {
    return `.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`;
  }

  /**
   * Generates text alignment utilities
   * @returns {string} CSS string for text alignment utilities
   */
  private generateTextAlignmentUtilities(): string {
    return `.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }`;
  }

  /**
   * Generates text size utilities
   * @returns {string} CSS string for text size utilities
   */
  private generateTextSizeUtilities(): string {
    return `.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }`;
  }

  /**
   * Generates font weight utilities
   * @returns {string} CSS string for font weight utilities
   */
  private generateFontWeightUtilities(): string {
    return `.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }`;
  }

  /**
   * Generates text color utilities
   * @returns {string} CSS string for text color utilities
   */
  private generateTextColorUtilities(): string {
    return `.text-gray-500 { color: var(--color-gray-500); }
.text-gray-600 { color: var(--color-gray-600); }
.text-gray-700 { color: var(--color-gray-700); }
.text-gray-900 { color: var(--color-gray-900); }`;
  }

  /**
   * Generates background color utilities
   * @returns {string} CSS string for background color utilities
   */
  private generateBackgroundColorUtilities(): string {
    return `.bg-white { background-color: var(--color-white); }
.bg-gray-50 { background-color: var(--color-gray-50); }`;
  }

  /**
   * Generates border radius utilities
   * @returns {string} CSS string for border radius utilities
   */
  private generateBorderRadiusUtilities(): string {
    return `.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }`;
  }

  /**
   * Generates shadow utilities
   * @returns {string} CSS string for shadow utilities
   */
  private generateShadowUtilities(): string {
    return `.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }`;
  }

  /**
   * Generates complete CSS for utility classes
   * @returns {string} Complete CSS string for utility classes
   */
  generateUtilityStyles(): string {
    const accessibilityUtilities = this.generateAccessibilityUtilities();
    const textAlignmentUtilities = this.generateTextAlignmentUtilities();
    const textSizeUtilities = this.generateTextSizeUtilities();
    const fontWeightUtilities = this.generateFontWeightUtilities();
    const textColorUtilities = this.generateTextColorUtilities();
    const backgroundColorUtilities = this.generateBackgroundColorUtilities();
    const borderRadiusUtilities = this.generateBorderRadiusUtilities();
    const shadowUtilities = this.generateShadowUtilities();

    return `/* Utility Styles */
${accessibilityUtilities}

${textAlignmentUtilities}

${textSizeUtilities}

${fontWeightUtilities}

${textColorUtilities}

${backgroundColorUtilities}

${borderRadiusUtilities}

${shadowUtilities}`;
  }
}
