import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';

/**
 * Main App component for config-project
 */
function App() {
  return (
    <div className="app">
      <header>
        <h1>Welcome to config-project</h1>
      </header>
      <main>
        <p>Your React application is ready!</p>
      </main>
    </div>
  );
}

// Initialize and render the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
