/**
 * Navigation Styles Module
 *
 * Generates navigation component styles
 */

/**
 * Generates navigation styles
 */
export class NavigationStyles {
  /**
   * Generate navigation styles
   * @returns {string} Navigation CSS styles
   */
  generate(): string {
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
   * @returns {string} Base navigation CSS
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
   * @returns {string} Navigation container CSS
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
   * @returns {string} Navigation logo CSS
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
   * @returns {string} Navigation links CSS
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
}
