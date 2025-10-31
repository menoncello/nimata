/**
 * Component Styles Module
 *
 * Generates additional component-specific styles beyond basic components
 */
import { ButtonStyles } from './button-styles.js';
import { CardStyles } from './card-styles.js';
import { FormStyles } from './form-styles.js';
import { HeroStyles } from './hero-styles.js';
import { NavigationStyles } from './navigation-styles.js';
import { UtilityStyles } from './utility-styles.js';

/**
 * Generates styles for advanced UI components
 */
export class ComponentStyles {
  private readonly heroStyles: HeroStyles;
  private readonly navigationStyles: NavigationStyles;
  private readonly cardStyles: CardStyles;
  private readonly buttonStyles: ButtonStyles;
  private readonly formStyles: FormStyles;
  private readonly utilityStyles: UtilityStyles;

  /**
   * Initialize component styles with all sub-generators
   */
  constructor() {
    this.heroStyles = new HeroStyles();
    this.navigationStyles = new NavigationStyles();
    this.cardStyles = new CardStyles();
    this.buttonStyles = new ButtonStyles();
    this.formStyles = new FormStyles();
    this.utilityStyles = new UtilityStyles();
  }

  /**
   * Generate component styles header comment
   * @returns {string} Header comment string for component styles section
   */
  private generateComponentStylesHeader(): string {
    return `/*
 * Component-specific Styles
 * Styles for individual components and features
 */`;
  }

  /**
   * Generate complete component styles section
   * @returns {string} Complete component styles CSS
   */
  generateComponentStylesSection(): string {
    const header = this.generateComponentStylesHeader();
    const hero = this.heroStyles.generate();
    const navigation = this.navigationStyles.generate();
    const cards = this.cardStyles.generate();
    const buttons = this.buttonStyles.generate();
    const forms = this.formStyles.generate();
    const utilities = this.utilityStyles.generate();

    return [header, hero, navigation, cards, buttons, forms, utilities].join('\n\n');
  }
}
