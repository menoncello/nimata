/**
 * Contact Page Generators
 *
 * Generates contact page component parts for web projects
 */

/**
 * Generate imports for contact page component
 * @returns {string} Import statements for contact page
 */
export function generateContactPageImports(): string {
  return `import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout';
import styles from './contact-page.module.css';`;
}

/**
 * Generate TypeScript interfaces for contact page
 * @returns {string} TypeScript interfaces for contact page
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
 * @param {string} projectName - Name of the project
 * @returns {string} Contact page React component
 */
export function generateContactPageComponent(projectName: string): string {
  return `${generateContactPageComponentStart(projectName)}${generateContactPageStateManagement()}${generateContactPageEventHandlers()}${generateContactPageJSX(projectName)}${generateContactPageComponentEnd()}`;
}

/**
 * Generate the start of the contact page component
 * @param {string} _projectName - Name of the project (unused)
 * @returns {string} Component start with state initialization
 */
function generateContactPageComponentStart(_projectName: string): string {
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

`;
}

/**
 * Generate event handlers for the contact form
 * @returns {string} Event handler functions
 */
function generateContactPageEventHandlers(): string {
  return `${generateInputChangeHandler()}${generateFormValidationHandler()}${generateFormSubmitHandler()}

`;
}

/**
 * Generate state management logic
 * @returns {string} State management functions
 */
function generateContactPageStateManagement(): string {
  return `  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

`;
}

/**
 * Generate input change handler
 * @returns {string} Input change handler function
 */
function generateInputChangeHandler(): string {
  return ``;
}

/**
 * Generate form validation handler
 * @returns {string} Form validation handler function
 */
function generateFormValidationHandler(): string {
  return `  const validateForm = (): boolean => {
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

`;
}

/**
 * Generate form submission handler
 * @returns {string} Form submission handler function
 */
function generateFormSubmitHandler(): string {
  return `  const handleSubmit = async (e: React.FormEvent) => {
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
  };`;
}

/**
 * Generate JSX for the contact page
 * @param {string} projectName - Name of the project
 * @returns {string} JSX content for the contact page
 */
function generateContactPageJSX(projectName: string): string {
  return `  return (
    <Layout title=\`Contact ${projectName}\`>
      ${generateContactPageHeader()}${generateContactPageContent(projectName)}${generateContactPageForm()}
    </Layout>
  );`;
}

/**
 * Generate the contact page header section
 * @returns {string} Header JSX
 */
function generateContactPageHeader(): string {
  return `<div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
`;
}

/**
 * Generate the contact page content section
 * @param {string} projectName - Name of the project
 * @returns {string} Content JSX
 */
function generateContactPageContent(projectName: string): string {
  return `<div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2>Get in Touch</h2>
            ${generateContactInfoItems(projectName)}
          </div>
`;
}

/**
 * Generate contact info items
 * @param {string} projectName - Name of the project
 * @returns {string} Contact info JSX
 */
function generateContactInfoItems(projectName: string): string {
  return `<div className={styles.contactItem}>
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
            </div>`;
}

/**
 * Generate the contact form
 * @returns {string} Form JSX
 */
function generateContactPageForm(): string {
  return `<form ref={formRef} onSubmit={handleSubmit} className={styles.contactForm}>
            ${generateFormFields()}${generateFormStatus()}${generateSubmitButton()}
          </form>
        </div>
      </div>`;
}

/**
 * Generate form fields
 * @returns {string} Form field JSX
 */
function generateFormFields(): string {
  return `${generateFormField('name', 'text', 'Name *', true)}${generateFormField('email', 'email', 'Email *', true)}${generateFormField('subject', 'text', 'Subject', false)}${generateTextAreaField('message', 'Message *', true)}`;
}

/**
 * Generate a single form field
 * @param {string} name - Field name
 * @param {string} type - Field type
 * @param {string} label - Field label
 * @param {boolean} required - Whether field is required
 * @returns {string} Form field JSX
 */
function generateFormField(name: string, type: string, label: string, required: boolean): string {
  return `<div className={styles.formGroup}>
              <label htmlFor="${name}">${label}</label>
              <input
                type="${type}"
                id="${name}"
                name="${name}"
                value={formData.${name}}
                onChange={handleInputChange}
                ${required ? 'required' : ''}
              />
            </div>
`;
}

/**
 * Generate a textarea field
 * @param {string} name - Field name
 * @param {string} label - Field label
 * @param {boolean} required - Whether field is required
 * @returns {string} Textarea field JSX
 */
function generateTextAreaField(name: string, label: string, required: boolean): string {
  return `<div className={styles.formGroup}>
              <label htmlFor="${name}">${label}</label>
              <textarea
                id="${name}"
                name="${name}"
                value={formData.${name}}
                onChange={handleInputChange}
                ${required ? 'required' : ''}
                rows={6}
              />
            </div>
`;
}

/**
 * Generate form status display
 * @returns {string} Form status JSX
 */
function generateFormStatus(): string {
  return `{formStatus.type && (
              <div className={\`\${styles.formStatus} \${styles[\`formStatus--\${formStatus.type}\`]}\`}>
                {formStatus.message}
              </div>
            )}`;
}

/**
 * Generate submit button
 * @returns {string} Submit button JSX
 */
function generateSubmitButton(): string {
  return `<button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>`;
}

/**
 * Generate the end of the contact page component
 * @returns {string} Component closing
 */
function generateContactPageComponentEnd(): string {
  return `
  };
`;
}

/**
 * Generate export statement for contact page
 * @returns {string} Export statement for contact page
 */
export function generateContactPageExports(): string {
  return `export default ContactPage;`;
}
