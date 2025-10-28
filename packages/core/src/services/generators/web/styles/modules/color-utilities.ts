/**
 * Color Utilities Module
 *
 * Provides color manipulation functions for CSS generation
 */
import type { ProjectConfig } from '../../../../../types/project-config.js';

// Constants for color manipulation
const RGB_MAX_VALUE = 255;
const HEX_BASE = 16;
const COLOR_MULTIPLIER_RED = 0x1000000;
const COLOR_MULTIPLIER_GREEN = 0x10000;
const COLOR_MULTIPLIER_BLUE = 0x100;
const COLOR_MASK_BLUE = 0x0000FF;
const COLOR_MASK_GREEN = 0x00FF;
const COLOR_SHIFT_RED = 16;
const COLOR_SHIFT_GREEN = 8;
const COLOR_CONVERSION_FACTOR = 2.55;

/**
 * Clamp color values to valid byte range
 * @param value - Color value to clamp
 * @returns Clamped value between 0 and RGB_MAX_VALUE
 */
const clampToByte = (value: number): number => {
  if (value < 1) return 0;
  if (value > RGB_MAX_VALUE) return RGB_MAX_VALUE;
  return value;
};

/**
 * Provides color manipulation utilities
 */
export class ColorUtilities {
  /**
   * Get primary color based on project configuration
   * @param config - Project configuration containing theme settings
   * @returns Primary color hex code
   */
  getPrimaryColor(config: ProjectConfig): string {
    // Extract primary color from theme or use default
    return config.theme?.primaryColor || '#3b82f6';
  }

  /**
   * Lighten a hex color by a specified percentage
   * @param color - Hex color code to lighten (e.g., '#3b82f6')
   * @param percent - Percentage to lighten (0-100)
   * @returns Lightened hex color code
   */
  lightenColor(color: string, percent: number): string {
    const num = Number.parseInt(color.replace('#', ''), HEX_BASE);
    const amt = Math.round(COLOR_CONVERSION_FACTOR * percent);
    const R = (num >> COLOR_SHIFT_RED) + amt;
    const G = ((num >> COLOR_SHIFT_GREEN) & COLOR_MASK_GREEN) + amt;
    const B = (num & COLOR_MASK_BLUE) + amt;

    const clampedR = clampToByte(R);
    const clampedG = clampToByte(G);
    const clampedB = clampToByte(B);

    return `#${(
      COLOR_MULTIPLIER_RED +
      clampedR * COLOR_MULTIPLIER_GREEN +
      clampedG * COLOR_MULTIPLIER_BLUE +
      clampedB
    )
      .toString(HEX_BASE)
      .slice(1)}`;
  }

  /**
   * Darken a hex color by a specified percentage
   * @param color - Hex color code to darken (e.g., '#3b82f6')
   * @param percent - Percentage to darken (0-100)
   * @returns Darkened hex color code
   */
  darkenColor(color: string, percent: number): string {
    return this.lightenColor(color, -percent);
  }

  /**
   * Generate a color palette based on primary color
   * @param config - Project configuration
   * @returns Object containing color palette
   */
  generateColorPalette(config: ProjectConfig): {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  } {
    const primaryColor = this.getPrimaryColor(config);
    const adjustmentAmount = 20;

    return {
      primary: primaryColor,
      primaryLight: this.lightenColor(primaryColor, adjustmentAmount),
      primaryDark: this.darkenColor(primaryColor, adjustmentAmount),
      secondary: '#64748b',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
  }
}
