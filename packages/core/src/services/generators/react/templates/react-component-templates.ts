import { ProjectConfig } from '../../../../types/project-config.js';

/**
 * React Component Templates
 * Contains template generation methods for React components
 */
export class ReactComponentTemplates {
  /**
   * Generate App component template
   * @param componentName - Component name
   * @param config - Project configuration
   * @returns App component template
   */
  getAppComponentTemplate(componentName: string, config: ProjectConfig): string {
    return `import React from 'react';
import { ${componentName} } from './components/${componentName}.js';
import { useAppState } from './hooks/useAppState.js';
import './index.css';

/**
 * Main application component
 */
export function App(): JSX.Element {
  const { state, setState } = useAppState();

  return (
    <div className="app">
      <header className="app-header">
        <h1>${config.name}</h1>
        <p>${config.description || 'A modern React application'}</p>
      </header>

      <main className="app-main">
        <${componentName}
          debug={state.debug}
          onStateChange={setState}
        />
      </main>

      <footer className="app-footer">
        <p>Built with Bun, React, and TypeScript</p>
      </footer>
    </div>
  );
}

export default App;`;
  }

  /**
   * Generate main component template
   * @param componentName - Component name
   * @param config - Project configuration
   * @returns Main component template
   */
  getComponentTemplate(componentName: string, config: ProjectConfig): string {
    const imports = this.getComponentImports();
    const interfaces = this.getComponentInterfaces(componentName);
    const component = this.getComponentImplementation(componentName, config);

    return `${imports}

${interfaces}

${component}`;
  }

  /**
   * Get React component imports
   * @returns Import statements string
   */
  private getComponentImports(): string {
    return `import React, { useState, useEffect } from 'react';`;
  }

  /**
   * Generate React component interfaces
   * @param componentName - Component name
   * @returns Interface definitions string
   */
  private getComponentInterfaces(componentName: string): string {
    return `interface ${componentName}Props {
  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Callback when component state changes
   */
  onStateChange?: (state: any) => void;
}

interface ${componentName}State {
  /**
   * Component initialization state
   */
  initialized: boolean;

  /**
   * Current user data
   */
  userData: {
    name: string;
    timestamp: Date;
  } | null;

  /**
   * Error state
   */
  error: string | null;
}`;
  }

  /**
   * Generate React component implementation
   * @param componentName - Component name
   * @param config - Project configuration
   * @returns Component implementation string
   */
  private getComponentImplementation(componentName: string, config: ProjectConfig): string {
    const componentBody = this.getComponentBody(componentName, config);
    const exportStatement = `export default ${componentName};`;

    return `/**
 * ${componentName} component
 */
export function ${componentName}({
  debug = false,
  onStateChange
}: ${componentName}Props): JSX.Element {
  ${componentBody}
}

${exportStatement}`;
  }

  /**
   * Generate the complete component body including state, effects, and render logic
   * @param componentName - Component name
   * @param config - Project configuration
   * @returns Complete component body implementation string
   */
  private getComponentBody(componentName: string, config: ProjectConfig): string {
    const stateInit = this.getStateInitialization(componentName);
    const effectHook = this.getEffectHook(componentName, config);
    const renderLogic = this.getRenderLogic(componentName);

    return `${stateInit}

  ${effectHook}

  ${renderLogic}`;
  }

  /**
   * Generate React state initialization code
   * @param componentName - Component name for typing the state
   * @returns State initialization code string
   */
  private getStateInitialization(componentName: string): string {
    return `const [state, setState] = useState<${componentName}State>({
    initialized: false,
    userData: null,
    error: null
  });`;
  }

  /**
   * Generate React useEffect hook for component initialization
   * @param componentName - Component name for logging
   * @param config - Project configuration for initialization data
   * @returns useEffect hook implementation string
   */
  private getEffectHook(componentName: string, config: ProjectConfig): string {
    return `useEffect(() => {
    const initializeComponent = async () => {
      try {
        ${this.getInitializationLogic(componentName, config)}
      } catch (error) {
        ${this.getErrorHandlingLogic()}
      }
    };

    initializeComponent();
  }, [debug, onStateChange]);`;
  }

  /**
   * Generate component initialization logic
   * @param componentName - Component name for logging
   * @param config - Project configuration
   * @returns Initialization logic string
   */
  private getInitializationLogic(componentName: string, config: ProjectConfig): string {
    return `if (debug) {
          console.log('${componentName}: Initializing component');
        }

        // Simulate async initialization
        await new Promise(resolve => setTimeout(resolve, 100));

        const newState = {
          initialized: true,
          userData: {
            name: '${config.name}',
            timestamp: new Date()
          },
          error: null
        };

        setState(newState);
        onStateChange?.(newState);`;
  }

  /**
   * Generate error handling logic
   * @returns Error handling logic string
   */
  private getErrorHandlingLogic(): string {
    return `const errorState = {
          initialized: false,
          userData: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        };

        setState(errorState);
        onStateChange?.(errorState);`;
  }

  /**
   * Generate React render logic with conditional rendering
   * @param componentName - Component name for display and CSS classes
   * @returns Render logic JSX implementation string
   */
  private getRenderLogic(componentName: string): string {
    return `if (state.error) {
    return ${this.getErrorRender()};
  }

  if (!state.initialized) {
    return ${this.getLoadingRender(componentName)};
  }

  return ${this.getSuccessRender(componentName)};`;
  }

  /**
   * Generate error render JSX
   * @returns Error JSX string
   */
  private getErrorRender(): string {
    return `(
      <div className="component-error">
        <h3>Error</h3>
        <p>{state.error}</p>
      </div>
    )`;
  }

  /**
   * Generate loading render JSX
   * @param componentName - Component name for loading message
   * @returns Loading JSX string
   */
  private getLoadingRender(componentName: string): string {
    return `(
      <div className="component-loading">
        <p>Loading ${componentName}...</p>
      </div>
    )`;
  }

  /**
   * Generate success render JSX
   * @param componentName - Component name for display
   * @returns Success JSX string
   */
  private getSuccessRender(componentName: string): string {
    return `(
    <div className="${componentName.toLowerCase()}">
      <h2>${componentName}</h2>
      {state.userData && (
        <div className="user-data">
          <p>Name: {state.userData.name}</p>
          <p>Initialized: {state.userData.timestamp.toLocaleString()}</p>
        </div>
      )}
      {debug && (
        <div className="debug-info">
          <h4>Debug Information</h4>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </div>
  )`;
  }
}
