/**
 * Vue Composable Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { INTERFACES, THEMES } from './vue-constants.js';

/**
 * Generates Vue composable content
 */
export class VueComposableGenerators {
  /**
   * Generate Vue composable
   * @param {ProjectConfig} _config - Project configuration (unused)
   * @returns {string} Vue composable TypeScript code
   */
  static generateVueComposable(_config: ProjectConfig): string {
    const imports = this.getComposableImports();
    const interfaces = this.getComposableInterfaces();
    const state = this.getComposableState();
    const computedProperties = this.getComputedProperties();
    const methods = this.getMethods();
    const watchers = this.getWatchers();

    return `${imports}

${interfaces}

${state}

${computedProperties}

${methods}

${watchers}

export function useAppState() {
  return {
    state: readonly(state),
    setState,
    toggleTheme,
    resetState
  }
}`;
  }

  /**
   * Get composable imports
   * @returns {string} Import statements
   */
  private static getComposableImports(): string {
    return `import { ref, reactive, computed, watch, readonly } from 'vue'`;
  }

  /**
   * Get composable interfaces
   * @returns {string} TypeScript interfaces
   */
  private static getComposableInterfaces(): string {
    return `interface ${INTERFACES.APP_STATE} {
  debug: boolean
  theme: '${THEMES.LIGHT}' | '${THEMES.DARK}'
  user: {
    id?: string
    name?: string
    email?: string
  }
  notifications: Array<{
    id: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: Date
  }>
}

interface UserPreferences {
  theme: '${THEMES.LIGHT}' | '${THEMES.DARK}'
  notifications: boolean
  autoSave: boolean
}`;
  }

  /**
   * Get composable state
   * @returns {string} State definition
   */
  private static getComposableState(): string {
    return `// Application state
const state = reactive<${INTERFACES.APP_STATE}>({
  debug: false,
  theme: '${THEMES.LIGHT}',
  user: {},
  notifications: []
})

// User preferences (persisted)
const preferences = reactive<UserPreferences>({
  theme: '${THEMES.LIGHT}',
  notifications: true,
  autoSave: true
})`;
  }

  /**
   * Get computed properties
   * @returns {string} Computed properties
   */
  private static getComputedProperties(): string {
    return `// Computed properties
const isDarkTheme = computed(() => state.theme === '${THEMES.DARK}')

const unreadNotifications = computed(() =>
  state.notifications.filter(n => !n.read).length
)

const hasUser = computed(() => !!state.user.id)

const primaryThemeColor = computed(() =>
  isDarkTheme.value ? '#1a1a1a' : '#ffffff'
)

const textColor = computed(() =>
  isDarkTheme.value ? '#ffffff' : '#000000'
)`;
  }

  /**
   * Get methods
   * @returns {string} Methods
   */
  private static getMethods(): string {
    const stateMethods = this.getStateMethods();
    const notificationMethods = this.getNotificationMethods();
    const userMethods = this.getUserMethods();
    const initializationMethods = this.getInitializationMethods();

    return `// Methods
${stateMethods}

${notificationMethods}

${userMethods}

${initializationMethods}`;
  }

  /**
   * Get state management methods
   * @returns {string} State methods
   */
  private static getStateMethods(): string {
    return `const setState = (newState: Partial<${INTERFACES.APP_STATE}>) => {
  Object.assign(state, newState)

  // Save preferences to localStorage
  if (newState.theme) {
    preferences.theme = newState.theme
    localStorage.setItem('user-preferences', JSON.stringify(preferences))
  }
}

const toggleTheme = () => {
  const newTheme = state.theme === '${THEMES.LIGHT}' ? '${THEMES.DARK}' : '${THEMES.LIGHT}'
  setState({ theme: newTheme })
}

const resetState = () => {
  setState({
    debug: false,
    theme: preferences.theme,
    user: {},
    notifications: []
  })
}`;
  }

  /**
   * Get notification management methods
   * @returns {boolean}ication methods
   */
  private static getNotificationMethods(): string {
    return `const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const notification = {
    id: Date.now().toString(),
    message,
    type,
    timestamp: new Date(),
    read: false
  }

  state.notifications.unshift(notification)

  // Keep only last 50 notifications
  if (state.notifications.length > 50) {
    state.notifications = state.notifications.slice(0, 50)
  }
}

const markNotificationRead = (id: string) => {
  const notification = state.notifications.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const clearNotifications = () => {
  state.notifications = []
}`;
  }

  /**
   * Get user management methods
   * @returns {string} User methods
   */
  private static getUserMethods(): string {
    return `const setUser = (user: ${INTERFACES.APP_STATE}['user']) => {
  setState({ user })
}

const clearUser = () => {
  setState({ user: {} })
}`;
  }

  /**
   * Get initialization methods
   * @returns {string} Initialization methods
   */
  private static getInitializationMethods(): string {
    return `// Initialize from localStorage
const initializeFromStorage = () => {
  try {
    const stored = localStorage.getItem('user-preferences')
    if (stored) {
      const parsedPreferences = JSON.parse(stored)
      Object.assign(preferences, parsedPreferences)
      setState({ theme: parsedPreferences.theme || '${THEMES.LIGHT}' })
    }
  } catch (error) {
    console.warn('Failed to load preferences from localStorage:', error)
  }
}`;
  }

  /**
   * Get watchers
   * @returns {string} Watchers
   */
  private static getWatchers(): string {
    return `// Watchers
watch(() => state.debug, (newDebug) => {
  if (newDebug) {
    console.log('Debug mode enabled')
    console.log('Current state:', state)
  }
})

watch(() => state.theme, (newTheme) => {
  // Update document root class for theme
  document.documentElement.classList.remove('theme-light', 'theme-dark')
  document.documentElement.classList.add(\`theme-\${newTheme}\`)

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', primaryThemeColor.value)
  }
})

watch(() => state.notifications, (notifications) => {
  // Log notifications in debug mode
  if (state.debug && notifications.length > 0) {
    console.log('Notifications updated:', notifications)
  }
}, { deep: true })

// Initialize
initializeFromStorage()`;
  }
}
