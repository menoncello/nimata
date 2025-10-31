/**
 * Error Test Builder
 *
 * Helper class for generating error handling test content
 */

/**
 * Builds error handling test content
 */
export class ErrorTestBuilder {
  /**
   * Generate configuration error tests
   * @param {string} className - Class name being tested
   * @returns {string} Configuration error test code string
   */
  private generateConfigurationErrorTests(className: string): string {
    return `
    it('should handle invalid configuration gracefully', () => {
      // Given: Invalid configuration
      const invalidConfig = {
        debug: 'invalid' as any,
        options: null as any
      };

      // When: Creating instance
      // Then: Should not throw
      expect(() => new ${className}(invalidConfig)).not.toThrow();
    });

    it('should handle null/undefined configuration', () => {
      // When: Creating instance with null/undefined
      // Then: Should not throw
      expect(() => new ${className}(null as any)).not.toThrow();
      expect(() => new ${className}(undefined as any)).not.toThrow();
    });`;
  }

  /**
   * Generate method error tests
   * @returns {string} Method error test code string
   */
  private generateMethodErrorTests(): string {
    return `
    it('should handle invalid method arguments', () => {
      // Given: Valid instance
      // When: Calling methods with invalid arguments
      // Then: Should handle gracefully
      expect(() => instance.initialize(null as any)).not.toThrow();
      expect(() => instance.updateConfig(null as any)).not.toThrow();
    });`;
  }

  /**
   * Generate error message tests
   * @returns {string} Error message test code string
   */
  private generateErrorMessageTests(): string {
    return `
    it('should provide meaningful error messages', () => {
      // Given: Test scenario that should produce an error
      // When: Error occurs
      // Then: Error should be meaningful
      // Note: Add specific error handling tests based on your implementation
    });`;
  }

  /**
   * Generate error handling tests for invalid configurations
   * @param {string} className - Class name being tested
   * @returns {string} Error handling test code string
   */
  getErrorHandlingTests(className: string): string {
    const configTests = this.generateConfigurationErrorTests(className);
    const methodTests = this.generateMethodErrorTests();
    const messageTests = this.generateErrorMessageTests();

    return `
  describe('error handling', () => {
${configTests}

${methodTests}

${messageTests}
  });`;
  }
}
