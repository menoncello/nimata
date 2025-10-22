/**
 * Hello Service
 */

export interface HelloOptions {
  uppercase?: boolean;
  exclamation?: boolean;
  language?: 'en' | 'es' | 'fr' | 'de';
}

export interface GreetingResponse {
  message: string;
  language: string;
  timestamp: string;
}

const greetings = {
  en: 'Hello',
  es: 'Hola',
  fr: 'Bonjour',
  de: 'Hallo',
};

/**
 * Generate a greeting message
 *
 * @param name - Name to greet
 * @param options - Additional options for formatting
 * @returns Formatted greeting message
 */
export function hello(name: string = 'World', options: HelloOptions = {}): string {
  const language = options.language || 'en';
  const greeting = greetings[language];
  let message = `${greeting}, ${name}`;

  if (options.uppercase) {
    message = message.toUpperCase();
  }

  const punctuation = options.exclamation ? '!' : '.';
  message += punctuation;

  return message;
}

/**
 * Generate a detailed greeting response
 *
 * @param name - Name to greet
 * @param options - Additional options for formatting
 * @returns Detailed greeting response
 */
export function createGreetingResponse(name: string, options: HelloOptions = {}): GreetingResponse {
  return {
    message: hello(name, options),
    language: options.language || 'en',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get supported languages
 *
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(greetings);
}

/**
 * Validate greeting options
 *
 * @param options - Options to validate
 * @returns Validation result
 */
export function validateHelloOptions(options: HelloOptions): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (options.language && !greetings[options.language]) {
    errors.push(
      `Unsupported language: ${options.language}. Supported languages: ${getSupportedLanguages().join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
