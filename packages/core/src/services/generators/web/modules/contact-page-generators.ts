/**
 * Contact Page Generators
 *
 * Generates contact page component parts for web projects
 */

/**
 * Generate imports for contact page component
 * @returns Import statements for contact page
 */
export function generateContactPageImports(): string {
  return `import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import styles from './contact-page.module.css';`;
}

/**
 * Generate TypeScript interfaces for contact page
 * @returns TypeScript interfaces for contact page
 */
export function generateContactPageInterfaces(): string {
  return `interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}`;
}

/**
 * Generate the main contact page component
 * @param projectName - Name of the project
 * @returns Contact page React component
 */
export function generateContactPageComponent(projectName: string): string {
  return `export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return false;
    }

    if (!formData.email.includes('@')) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormStatus({
        type: 'success',
        message: 'Thank you for your message! We\\'ll get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });

      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title=\`Contact ${projectName}\`>
      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2>Get in Touch</h2>
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>hello@${projectName.toLowerCase().replace(/\\s+/g, '')}.com</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Address</h3>
              <p>123 Business Street<br />Suite 100<br />City, State 12345</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
              />
            </div>

            {formStatus.type && (
              <div className={\`\${styles.formStatus} \${styles[\`formStatus--\${formStatus.type}\`]}\`}>
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};`;
}

/**
 * Generate export statement for contact page
 * @returns Export statement for contact page
 */
export function generateContactPageExports(): string {
  return `export default ContactPage;`;
}
