/**
 * Component Styles Module
 *
 * Generates additional component-specific styles beyond basic components
 */

/**
 * Generates styles for advanced UI components
 */
export class ComponentStyles {
  /**
   * Generate component styles header comment
   * @returns Header comment string for component styles section
   */
  private generateComponentStylesHeader(): string {
    return `/*
 * Component-specific Styles
 * Styles for individual components and features
 */`;
  }

  /**
   * Generate hero section styles
   * @returns Hero section CSS styles
   */
  private generateHeroStyles(): string {
    return `/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-white);
  padding: var(--space-20) 0;
  text-align: center;
}

.hero__content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.hero__title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
  line-height: var(--line-height-tight);
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-8);
  opacity: 0.9;
}`;
  }

  /**
   * Generate navigation styles
   * @returns Navigation CSS styles
   */
  private generateNavigationStyles(): string {
    const navBase = this.getNavBaseStyles();
    const navContainer = this.getNavContainerStyles();
    const navLogo = this.getNavLogoStyles();
    const navLinks = this.getNavLinksStyles();

    return `/* Navigation */
${navBase}

${navContainer}

${navLogo}

${navLinks}`;
  }

  /**
   * Get base navigation styles
   * @returns Base navigation CSS
   */
  private getNavBaseStyles(): string {
    return `.nav {
  background: var(--color-white);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}`;
  }

  /**
   * Get navigation container styles
   * @returns Navigation container CSS
   */
  private getNavContainerStyles(): string {
    return `.nav__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}`;
  }

  /**
   * Get navigation logo styles
   * @returns Navigation logo CSS
   */
  private getNavLogoStyles(): string {
    return `.nav__logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}`;
  }

  /**
   * Get navigation links styles
   * @returns Navigation links CSS
   */
  private getNavLinksStyles(): string {
    return `.nav__links {
  display: flex;
  gap: var(--space-6);
}

.nav__link {
  color: var(--color-gray-600);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color 0.2s ease;
}

.nav__link:hover {
  color: var(--color-primary);
}`;
  }

  /**
   * Generate enhanced card styles
   * @returns Enhanced card CSS styles
   */
  private generateCardStyles(): string {
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
   * @returns Base card CSS
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
   * @returns Card hover CSS
   */
  private getCardHoverStyles(): string {
    return `.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}`;
  }

  /**
   * Get card component parts styles
   * @returns Card parts CSS
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

  /**
   * Generate enhanced button styles
   * @returns Enhanced button CSS styles
   */
  private generateButtonStyles(): string {
    return `/* Buttons */
.btn {
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
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

.btn--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}`;
  }

  /**
   * Generate form styles
   * @returns Form CSS styles
   */
  private generateFormStyles(): string {
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
   * @returns Form group CSS
   */
  private getFormGroupStyles(): string {
    return `.form-group {
  margin-bottom: var(--space-4);
}`;
  }

  /**
   * Get form label styles
   * @returns Form label CSS
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
   * @returns Form input CSS
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
   * @returns Form error CSS
   */
  private getFormErrorStyles(): string {
    return `.form-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
}`;
  }

  /**
   * Generate alert/notification styles
   * @returns Alert CSS styles
   */
  private generateAlertStyles(): string {
    return `/* Alerts */
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.alert--success {
  background: rgb(34 197 94 / 0.1);
  border: 1px solid rgb(34 197 94 / 0.2);
  color: rgb(21 128 61);
}

.alert--warning {
  background: rgb(245 158 11 / 0.1);
  border: 1px solid rgb(245 158 11 / 0.2);
  color: rgb(180 83 9);
}

.alert--error {
  background: rgb(239 68 68 / 0.1);
  border: 1px solid rgb(239 68 68 / 0.2);
  color: rgb(185 28 28);
}

.alert--info {
  background: rgb(59 130 246 / 0.1);
  border: 1px solid rgb(59 130 246 / 0.2);
  color: rgb(29 78 216);
}`;
  }

  /**
   * Generate loading and animation styles
   * @returns Loading CSS styles
   */
  private generateLoadingStyles(): string {
    return `/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--space-4);
}`;
  }

  /**
   * Generate complete component styles section
   * @returns Complete component styles CSS
   */
  generateComponentStylesSection(): string {
    const header = this.generateComponentStylesHeader();
    const hero = this.generateHeroStyles();
    const navigation = this.generateNavigationStyles();
    const cards = this.generateCardStyles();
    const buttons = this.generateButtonStyles();
    const forms = this.generateFormStyles();
    const alerts = this.generateAlertStyles();
    const loading = this.generateLoadingStyles();

    return [header, hero, navigation, cards, buttons, forms, alerts, loading].join('\n\n');
  }
}
