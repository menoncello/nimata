import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles/main.css';

/**
 * Initialize and render the React application
 */
function initializeApp(): void {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Initialize the application
initializeApp();

export { initializeApp };
