/**
 * Unit tests for hello service
 */

import { describe, it, expect } from 'bun:test';
import {
  hello,
  createGreetingResponse,
  getSupportedLanguages,
  validateHelloOptions,
  type HelloOptions,
} from '../src/services/helloService';

describe('Hello Service', () => {
  describe('hello function', () => {
    it('should return default greeting', () => {
      expect(hello()).toBe('Hello, World.');
    });

    it('should return greeting with custom name', () => {
      expect(hello('TypeScript')).toBe('Hello, TypeScript.');
    });

    it('should return uppercase greeting', () => {
      expect(hello('TypeScript', { uppercase: true })).toBe('HELLO, TYPESCRIPT.');
    });

    it('should return greeting with exclamation', () => {
      expect(hello('TypeScript', { exclamation: true })).toBe('Hello, TypeScript!');
    });

    it('should return greeting in Spanish', () => {
      expect(hello('Mundo', { language: 'es' })).toBe('Hola, Mundo.');
    });

    it('should return greeting in French', () => {
      expect(hello('Monde', { language: 'fr' })).toBe('Bonjour, Monde.');
    });

    it('should return greeting in German', () => {
      expect(hello('Welt', { language: 'de' })).toBe('Hallo, Welt.');
    });

    it('should apply all options together', () => {
      const options: HelloOptions = {
        uppercase: true,
        exclamation: true,
        language: 'es',
      };
      expect(hello('Mundo', options)).toBe('HOLA, MUNDO!');
    });
  });

  describe('createGreetingResponse', () => {
    it('should create detailed response', () => {
      const response = createGreetingResponse('TypeScript', { language: 'fr' });

      expect(response).toHaveProperty('message', 'Bonjour, TypeScript.');
      expect(response).toHaveProperty('language', 'fr');
      expect(response).toHaveProperty('timestamp');
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return all supported languages', () => {
      const languages = getSupportedLanguages();
      expect(languages).toEqual(['en', 'es', 'fr', 'de']);
    });
  });

  describe('validateHelloOptions', () => {
    it('should validate valid options', () => {
      const result = validateHelloOptions({ language: 'es', uppercase: true });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid language', () => {
      const result = validateHelloOptions({ language: 'invalid' as any });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Unsupported language: invalid. Supported languages: en, es, fr, de'
      );
    });

    it('should accept empty options', () => {
      const result = validateHelloOptions({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
