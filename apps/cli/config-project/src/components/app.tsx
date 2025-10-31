import { useState, useEffect } from 'react';
import { Router } from './router.js';
import { Layout } from './layout.js';
import { useAppState } from '../hooks/use-app-state.js';
import '../styles/main.css';

interface AppConfig {
  debug?: boolean;
  routes?: Record<string, () => Promise<React.ComponentType>>;
}

/**
 * Main application component
 */
export function App() {
  const { state, loading, notifications, setTheme } = useAppState();
  const [router] = useState(() => new Router({
    debug: import.meta.env.DEV,
  }));

  useEffect(() => {
    // Initialize router
    router.setupRouting();
    router.setupErrorHandling();

    // Apply theme
    if (state.theme) {
      setTheme(state.theme);
    }
  }, [router, state.theme, setTheme]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading config-project...</p>
      </div>
    );
  }

  return (
    <div className="app" data-theme={state.theme}>
      <Layout>
        <Router />

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification notification--${notification.type}`}
              >
                {notification.message}
                <button
                  onClick={() => {/* Handle notification removal */}}
                  className="notification__close"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </div>
  );
}

export default App;