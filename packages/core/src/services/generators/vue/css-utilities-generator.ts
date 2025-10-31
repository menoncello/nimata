/**
 * CSS Utilities Generator for Vue projects
 */

/**
 * Generates CSS utility classes for Vue projects
 */
export class CSSUtilitiesGenerator {
  /**
   * Get utility classes
   * @returns {string} Utility CSS classes
   */
  static getUtilityClasses(): string {
    const accessibility = this.getAccessibilityUtilities();
    const text = this.getTextUtilities();
    const colors = this.getColorUtilities();
    const backgrounds = this.getBackgroundUtilities();
    const borders = this.getBorderUtilities();
    const borderRadius = this.getBorderRadiusUtilities();
    const shadows = this.getShadowUtilities();
    const spacing = this.getSpacingUtilities();
    const display = this.getDisplayUtilities();
    const flexbox = this.getFlexboxUtilities();
    const visibility = this.getVisibilityUtilities();

    return `/* Utility classes */
${accessibility}

${text}

${colors}

${backgrounds}

${borders}

${borderRadius}

${shadows}

${spacing}

${display}

${flexbox}

${visibility}`;
  }

  /**
   * Get accessibility utilities
   * @returns {string} Accessibility CSS
   */
  private static getAccessibilityUtilities(): string {
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
   * Get text utilities
   * @returns {string} Text CSS
   */
  private static getTextUtilities(): string {
    return `.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

.text-sm { font-size: var(--font-size-sm); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }`;
  }

  /**
   * Get color utilities
   * @returns {string} Color CSS
   */
  private static getColorUtilities(): string {
    return `.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-error { color: var(--color-error); }
.text-success { color: var(--color-success); }`;
  }

  /**
   * Get background utilities
   * @returns {string} Background CSS
   */
  private static getBackgroundUtilities(): string {
    return `.bg-primary { background-color: var(--color-primary); }
.bg-surface { background-color: var(--color-surface); }
.bg-error { background-color: var(--color-error); }
.bg-success { background-color: var(--color-success); }`;
  }

  /**
   * Get border utilities
   * @returns {string} Border CSS
   */
  private static getBorderUtilities(): string {
    return `.border { border: 1px solid var(--color-border); }
.border-primary { border-color: var(--color-primary); }
.border-error { border-color: var(--color-error); }`;
  }

  /**
   * Get border radius utilities
   * @returns {string} Border radius CSS
   */
  private static getBorderRadiusUtilities(): string {
    return `.rounded { border-radius: var(--radius-base); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-full { border-radius: var(--radius-full); }`;
  }

  /**
   * Get shadow utilities
   * @returns {string} Shadow CSS
   */
  private static getShadowUtilities(): string {
    return `.shadow { box-shadow: var(--shadow-base); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }`;
  }

  /**
   * Get spacing utilities
   * @returns {string} Spacing CSS
   */
  private static getSpacingUtilities(): string {
    return `.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-5 { padding: var(--spacing-5); }
.p-6 { padding: var(--spacing-6); }

.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-3 { margin: var(--spacing-3); }
.m-4 { margin: var(--spacing-4); }
.m-5 { margin: var(--spacing-5); }
.m-6 { margin: var(--spacing-6); }

.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-5 { margin-bottom: var(--spacing-5); }
.mb-6 { margin-bottom: var(--spacing-6); }`;
  }

  /**
   * Get display utilities
   * @returns {string} Display CSS
   */
  private static getDisplayUtilities(): string {
    return `.flex { display: flex; }
.flex-col { flex-direction: column; }
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }`;
  }

  /**
   * Get flexbox utilities
   * @returns {string} Flexbox CSS
   */
  private static getFlexboxUtilities(): string {
    return `.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }`;
  }

  /**
   * Get visibility utilities
   * @returns {string} Visibility CSS
   */
  private static getVisibilityUtilities(): string {
    return ``;
  }
}
