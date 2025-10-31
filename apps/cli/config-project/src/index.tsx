import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles/main.css';

/**
 * Initialize and render the React application
 */
function initializeApp(): void {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return; // Skip initialization in non-browser environments
  }

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

// Initialize the application only in browser environment
if (typeof document !== 'undefined') {
  initializeApp();
}

export { initializeApp };
