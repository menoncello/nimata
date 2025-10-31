/**
 * Card Styles Module
 *
 * Generates card component styles
 */

/**
 * Generates card styles
 */
export class CardStyles {
  /**
   * Generate card styles
   * @returns {string} Card CSS styles
   */
  generate(): string {
    const baseCard = this.getBaseCardStyles();
    const cardHover = this.getCardHoverStyles();
    const cardParts = this.getCardPartsStyles();

    return `/* Cards */
${baseCard}

${cardHover}

${cardParts}`;
  }

  /**
   * Get base card styles
   * @returns {string} Base card CSS
   */
  private getBaseCardStyles(): string {
    return `.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
}`;
  }

  /**
   * Get card hover styles
   * @returns {string} Card hover CSS
   */
  private getCardHoverStyles(): string {
    return `.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}`;
  }

  /**
   * Get card component parts styles
   * @returns {string} Card parts CSS
   */
  private getCardPartsStyles(): string {
    return `.card__header {
  margin-bottom: var(--space-4);
}

.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.card__content {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
}

.card__footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}`;
  }
}
