/**
 * About Page Generator
 *
 * Generates about page component for web projects
 */
import type { ProjectConfig } from '../../../../types/project-config.js';

/**
 * Generate about page component
 * @param config - Project configuration
 * @returns About page component code
 */
export function generateAboutPage(config: ProjectConfig): string {
  const { name } = config;
  const imports = getAboutPageImports();
  const component = getAboutPageComponent(name);
  const defaultExport = getAboutPageDefaultExport();

  return `${imports}

${component}

${defaultExport}`;
}

/**
 * Get about page imports
 * @returns Import statements
 */
function getAboutPageImports(): string {
  return `import React from 'react';
import { Layout } from '../components/layout';
import styles from './about-page.module.css';`;
}

/**
 * Get about page component
 * @param name - Project name
 * @returns About page component code
 */
function getAboutPageComponent(name: string): string {
  const header = getAboutPageHeader(name);
  const main = getAboutPageMain(name);

  return `export const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.aboutPage}>
        ${header}

        ${main}
      </div>
    </Layout>
  );
};`;
}

/**
 * Get about page header
 * @param name - Project name
 * @returns Header JSX
 */
function getAboutPageHeader(name: string): string {
  return `<header className={styles.header}>
          <h1>About ${name}</h1>
          <p>Learn more about our project and team</p>
        </header>`;
}

/**
 * Get about page main content
 * @param name - Project name
 * @returns Main content JSX
 */
function getAboutPageMain(name: string): string {
  const missionSection = getMissionSection(name);
  const technologiesSection = getTechnologiesSection();
  const contactSection = getContactSection();

  return `<main className={styles.main}>
          ${missionSection}

          ${technologiesSection}

          ${contactSection}
        </main>`;
}

/**
 * Get mission section
 * @param name - Project name
 * @returns Mission section JSX
 */
function getMissionSection(name: string): string {
  return `<section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              ${name} is dedicated to providing exceptional web experiences
              through modern technologies and best practices.
            </p>
          </section>`;
}

/**
 * Get technologies section
 * @returns Technologies section JSX
 */
function getTechnologiesSection(): string {
  return `<section className={styles.section}>
            <h2>Technologies</h2>
            <ul>
              <li>React 18 with TypeScript</li>
              <li>Modern CSS with modules</li>
              <li>Build tools with Vite</li>
              <li>Testing with Jest and React Testing Library</li>
            </ul>
          </section>`;
}

/**
 * Get contact section
 * @returns Contact section JSX
 */
function getContactSection(): string {
  return `<section className={styles.section}>
            <h2>Get in Touch</h2>
            <p>
              Have questions or feedback? We'd love to hear from you.
              Visit our contact page or reach out through our channels.
            </p>
          </section>`;
}

/**
 * Get about page default export
 * @returns Default export statement
 */
function getAboutPageDefaultExport(): string {
  return `export default AboutPage;`;
}
