import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { registerServiceWorker } from './utils/service-worker';
import { reportWebVitals } from './utils/web-vitals';
import './styles/main.css';

// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create React root
const root = createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Report web vitals
reportWebVitals(console.log);

// Hot module replacement
if (import.meta.env.DEV) {
  import.meta.hot?.accept();
}

// Error boundary setup
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // You can send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can send this to an error tracking service
});
