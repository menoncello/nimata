/**
 * Utility Styles Module
 *
 * Generates utility component styles (alerts, loading, etc.)
 */

/**
 * Generates utility styles
 */
export class UtilityStyles {
  /**
   * Generate alert styles
   * @returns {string} Alert CSS styles
   */
  generateAlertStyles(): string {
    return `/* Alerts */
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.alert--success {
  background: rgb(34 197 94 / 0.1);
  border: 1px solid rgb(34 197 94 / 0.2);
  color: rgb(21 128 61);
}

.alert--warning {
  background: rgb(245 158 11 / 0.1);
  border: 1px solid rgb(245 158 11 / 0.2);
  color: rgb(180 83 9);
}

.alert--error {
  background: rgb(239 68 68 / 0.1);
  border: 1px solid rgb(239 68 68 / 0.2);
  color: rgb(185 28 28);
}

.alert--info {
  background: rgb(59 130 246 / 0.1);
  border: 1px solid rgb(59 130 246 / 0.2);
  color: rgb(29 78 216);
}`;
  }

  /**
   * Generate loading styles
   * @returns {string} Loading CSS styles
   */
  generateLoadingStyles(): string {
    return `/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--space-4);
}`;
  }

  /**
   * Generate all utility styles
   * @returns {string} All utility CSS styles
   */
  generate(): string {
    return `${this.generateAlertStyles()}

${this.generateLoadingStyles()}`;
  }
}
