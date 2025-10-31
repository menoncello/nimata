/**
 * Vue Component Generators
 */

import type { ProjectConfig } from '../../../types/project-config.js';
import { toPascalCase } from '../../../utils/string-utils.js';
import {
  INIT_DELAY,
  JSON_INDENTATION,
  CSS_VALUES,
  INTERFACES,
  VUE_IMPORTS,
} from './vue-constants.js';

/**
 * Generates Vue component content
 */
export class VueComponentGenerators {
  /**
   * Generate main App component for Vue
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} App component Vue template
   */
  static generateVueAppComponent(config: ProjectConfig): string {
    const template = this.getAppTemplate(config);
    const script = this.getAppScript(config);
    const style = this.getAppStyle();

    return `${template}

${script}

${style}`;
  }

  /**
   * Generate main Vue component
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Main component Vue template
   */
  static generateVueMainComponent(config: ProjectConfig): string {
    const componentName = toPascalCase(config.name);
    const template = this.getMainComponentTemplate(componentName);
    const script = this.getMainComponentScript(config, componentName);
    const style = this.getMainComponentStyle(componentName);

    return `${template}

${script}

${style}`;
  }

  /**
   * Get App template section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Template HTML
   */
  private static getAppTemplate(config: ProjectConfig): string {
    const componentName = toPascalCase(config.name);
    return `<template>
  <div class="app">
    <header class="app-header">
      <h1>{{ config.name }}</h1>
      <p>{{ config.description || 'A modern Vue application' }}</p>
    </header>

    <main class="app-main">
      <${componentName}
        :debug="state.debug"
        @state-change="handleStateChange"
      />
    </main>

    <footer class="app-footer">
      <p>Built with Bun, Vue, and TypeScript</p>
    </footer>
  </div>
</template>`;
  }

  /**
   * Get App script section
   * @param {ProjectConfig} config - Project configuration
   * @returns {string} Script TypeScript code
   */
  private static getAppScript(config: ProjectConfig): string {
    const componentName = toPascalCase(config.name);
    return `<script setup lang="ts">
import { reactive } from 'vue'
import ${componentName} from './components/${componentName}.vue'
import { useAppState } from './composables/useAppState.js'

// App configuration
const config = reactive({
  name: '${config.name}',
  description: '${config.description || ''}'
})

// Application state
const { state, setState } = useAppState()

// Handle component state changes
const handleStateChange = (newState: ${INTERFACES.COMPONENT_STATE}) => {
  setState(newState)
}
</script>`;
  }

  /**
   * Get App style section
   * @returns {string} Style CSS
   */
  private static getAppStyle(): string {
    return `<style>
@import './index.css';
</style>`;
  }

  /**
   * Get main component template
   * @param {string} componentName - Component name
   * @returns {string} Template HTML
   */
  private static getMainComponentTemplate(componentName: string): string {
    return `<template>
  <div class="${componentName.toLowerCase()}">
    <h2>{{ componentName }}</h2>

    <div v-if="state.error" class="component-error">
      <h3>Error</h3>
      <p>{{ state.error }}</p>
    </div>

    <div v-else-if="!state.initialized" class="component-loading">
      <p>Loading {{ componentName }}...</p>
    </div>

    <div v-else>
      <div v-if="state.userData" class="user-data">
        <p>Name: {{ state.userData.name }}</p>
        <p>Initialized: {{ formattedTimestamp }}</p>
      </div>

      <div v-if="debug" class="debug-info">
        <h4>Debug Information</h4>
        <pre>{{ debugInfo }}</pre>
      </div>
    </div>
  </div>
</template>`;
  }

  /**
   * Get main component script
   * @param {ProjectConfig} config - Project configuration
   * @param {string} componentName - Component name
   * @returns {string} Script TypeScript code
   */
  private static getMainComponentScript(config: ProjectConfig, componentName: string): string {
    const imports = this.getMainComponentImports();
    const interfaces = this.getMainComponentInterfaces();
    const propsDefinition = this.getPropsDefinition();
    const stateDefinition = this.getStateDefinition(componentName);
    const computedProperties = this.getComputedProperties();
    const methods = this.getMethods(config, componentName);
    const watchers = this.getWatchers(componentName);
    const lifecycle = this.getLifecycle();

    return `<script setup lang="ts">
${imports}

${interfaces}

${propsDefinition}

${stateDefinition}

${computedProperties}

${methods}

${watchers}

${lifecycle}
</script>`;
  }

  /**
   * Get main component imports
   * @returns {string} Import statements
   */
  private static getMainComponentImports(): string {
    return `import { ${VUE_IMPORTS.join(', ')} } from 'vue'`;
  }

  /**
   * Get main component interfaces
   * @returns {string} TypeScript interfaces
   */
  private static getMainComponentInterfaces(): string {
    return `interface ${INTERFACES.COMPONENT_STATE} {
  initialized: boolean
  ${INTERFACES.USER_DATA}: {
    name: string
    timestamp: Date
  } | null
  error: string | null
}

interface Props {
  debug?: boolean
}

interface Emits {
  (e: 'stateChange', state: ${INTERFACES.COMPONENT_STATE}): void
}`;
  }

  /**
   * Get props definition
   * @returns {string} Props definition
   */
  private static getPropsDefinition(): string {
    return `const props = withDefaults(defineProps<Props>(), {
  debug: false
})

const emit = defineEmits<Emits>()`;
  }

  /**
   * Get state definition
   * @param {string} componentName - Component name
   * @returns {string} State definition
   */
  private static getStateDefinition(componentName: string): string {
    return `const componentName = ref('${componentName}')
const state = ref<${INTERFACES.COMPONENT_STATE}>({
  initialized: false,
  ${INTERFACES.USER_DATA}: null,
  error: null
})`;
  }

  /**
   * Get computed properties
   * @returns {string} Computed properties
   */
  private static getComputedProperties(): string {
    return `// Computed properties
const formattedTimestamp = computed(() => {
  return state.value.${INTERFACES.USER_DATA}?.timestamp.toLocaleString() || ''
})

const debugInfo = computed(() => {
  return JSON.stringify(state.value, null, ${JSON_INDENTATION})
})`;
  }

  /**
   * Get methods
   * @param {ProjectConfig} config - Project configuration
   * @param {string} _componentName - Component name (unused)
   * @returns {string} Methods
   */
  private static getMethods(config: ProjectConfig, _componentName: string): string {
    return `// Methods
const initializeComponent = async () => {
  try {
    if (props.debug) {
      console.log(\`\${componentName.value}: Initializing component\`)
    }

    // Simulate async initialization
    await new Promise(resolve => setTimeout(resolve, ${INIT_DELAY}))

    const newState = {
      initialized: true,
      ${INTERFACES.USER_DATA}: {
        name: '${config.name}',
        timestamp: new Date()
      },
      error: null
    }

    state.value = newState
    emit('stateChange', newState)

  } catch (error) {
    const errorState = {
      initialized: false,
      ${INTERFACES.USER_DATA}: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }

    state.value = errorState
    emit('stateChange', errorState)
  }
}`;
  }

  /**
   * Get watchers
   * @param {string} _componentName - Component name (unused)
   * @returns {string} Watchers
   */
  private static getWatchers(_componentName: string): string {
    return `// Watchers
watch(() => props.debug, (newDebug) => {
  if (newDebug) {
    console.log(\`\${componentName.value}: Debug mode enabled\`)
  }
})`;
  }

  /**
   * Get lifecycle hooks
   * @returns {boolean}ecycle hooks
   */
  private static getLifecycle(): string {
    return `// Lifecycle
onMounted(() => {
  initializeComponent()
})`;
  }

  /**
   * Get main component style
   * @param {string} componentName - Component name
   * @returns {string} Style CSS
   */
  private static getMainComponentStyle(componentName: string): string {
    return `<style scoped>
.${componentName.toLowerCase()} {
  padding: 1rem;
}

.component-error {
  color: var(--error-color, ${CSS_VALUES.ERROR_COLOR});
}

.component-loading {
  color: var(--text-color, ${CSS_VALUES.TEXT_COLOR});
}

.user-data {
  margin: 1rem 0;
  padding: 1rem;
  background-color: var(--background-light, ${CSS_VALUES.BACKGROUND_LIGHT});
  border-radius: var(--border-radius, ${CSS_VALUES.BORDER_RADIUS});
}

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--background-dark, ${CSS_VALUES.BACKGROUND_DARK});
  border-radius: var(--border-radius, ${CSS_VALUES.BORDER_RADIUS});
  border: 1px solid var(--border-color, ${CSS_VALUES.BORDER_COLOR});
}

.debug-info pre {
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>`;
  }
}
