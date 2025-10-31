/**
 * Layout Styles Generator
 *
 * Generates CSS layout classes for containers, grids, and flexbox
 */

/**
 * Generates CSS layout classes
 * @returns {string} CSS string for layout classes
 */
export class LayoutStyles {
  /**
   * Generates container styles
   * @returns {string} CSS string for container styles
   */
  private generateContainerStyles(): string {
    return `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`;
  }

  /**
   * Generates grid system styles
   * @returns {string} CSS string for grid system
   */
  private generateGridStyles(): string {
    return `.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }`;
  }

  /**
   * Generates flexbox utilities
   * @returns {string} CSS string for flexbox utilities
   */
  private generateFlexStyles(): string {
    return `.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}`;
  }

  /**
   * Generates gap utilities
   * @returns {string} CSS string for gap utilities
   */
  private generateGapStyles(): string {
    return `.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }`;
  }

  /**
   * Generates complete CSS for layout classes
   * @returns {string} Complete CSS string for layout classes
   */
  generateLayoutStyles(): string {
    const containerStyles = this.generateContainerStyles();
    const gridStyles = this.generateGridStyles();
    const flexStyles = this.generateFlexStyles();
    const gapStyles = this.generateGapStyles();

    return `/* Layout Styles */
${containerStyles}

${gridStyles}

${flexStyles}

${gapStyles}`;
  }
}
