/**
 * Hero Styles Module
 *
 * Generates hero section styles
 */

/**
 * Generates hero section styles
 */
export class HeroStyles {
  /**
   * Generate hero section styles
   * @returns {string} Hero section CSS styles
   */
  generate(): string {
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
}
