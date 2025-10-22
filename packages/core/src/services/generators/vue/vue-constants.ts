/**
 * Vue Generator Constants
 */

/** Default initialization delay in milliseconds */
export const INIT_DELAY = 100;

/** Default JSON indentation */
export const JSON_INDENTATION = 2;

/** CSS property values */
export const CSS_VALUES = {
  ERROR_COLOR: '#ff6b6b',
  TEXT_COLOR: '#333',
  BACKGROUND_LIGHT: '#f8f9fa',
  BACKGROUND_DARK: '#f5f5f5',
  BORDER_COLOR: '#ddd',
  BORDER_RADIUS: '8px',
} as const;

/** File paths */
export const FILE_PATHS = {
  COMPONENTS: 'src/components',
  COMPOSABLES: 'src/composables',
  UTILS: 'src/utils',
  PUBLIC: 'public',
  APP_VUE: 'src/App.vue',
  INDEX_CSS: 'src/index.css',
  INDEX_HTML: 'public/index.html',
  VITE_CONFIG: 'vite.config.ts',
  USE_APP_STATE: 'src/composables/useAppState.ts',
} as const;

/** Vue component template sections */
export const COMPONENT_SECTIONS = {
  HEADER: 'header',
  MAIN: 'main',
  FOOTER: 'footer',
} as const;

/** State interface names */
export const INTERFACES = {
  COMPONENT_STATE: 'ComponentState',
  APP_STATE: 'AppState',
  USER_DATA: 'userData',
} as const;

/** Vue composition API imports */
export const VUE_IMPORTS = ['ref', 'reactive', 'computed', 'watch', 'onMounted'] as const;

/** Theme options */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
