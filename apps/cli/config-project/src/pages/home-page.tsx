import { useState, useEffect } from 'react';

/**
 * Home page component
 */
export function HomePage() {
  const [message, setMessage] = useState('Welcome to config-project!');

  useEffect(() => {
    // Simulate API call or data fetching
    const timer = setTimeout(() => {
      setMessage('Project from config');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">{message}</h1>
          <p className="hero__description">Get started with your new project in seconds.</p>
          <div className="hero__actions">
            <button className="btn btn--primary">Get Started</button>
            <button className="btn btn--secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features__grid">
          <div className="feature-card">
            <h3>⚡ Fast Performance</h3>
            <p>Optimized for speed and efficiency.</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Modern Design</h3>
            <p>Clean, responsive, and accessible UI.</p>
          </div>
          <div className="feature-card">
            <h3>🛠️ Developer Friendly</h3>
            <p>Built with modern tools and best practices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Home page lifecycle hooks
 */
export function useHomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Home page mounted');

    return () => {
      console.log('Home page unmounted');
    };
  }, []);

  return { mounted };
}

export default HomePage;
