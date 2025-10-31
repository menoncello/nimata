import React from 'react';
import { Layout } from '../components/layout';
import styles from './about-page.module.css';

export const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.aboutPage}>
        <header className={styles.header}>
          <h1>About config-project</h1>
          <p>Learn more about our project and team</p>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              config-project is dedicated to providing exceptional web experiences through modern
              technologies and best practices.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Technologies</h2>
            <ul>
              <li>React 18 with TypeScript</li>
              <li>Modern CSS with modules</li>
              <li>Build tools with Vite</li>
              <li>Testing with Jest and React Testing Library</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Get in Touch</h2>
            <p>
              Have questions or feedback? We'd love to hear from you. Visit our contact page or
              reach out through our channels.
            </p>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default AboutPage;
