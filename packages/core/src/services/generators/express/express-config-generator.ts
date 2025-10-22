/**
 * Express Configuration Code Generator
 *
 * Generates Express configuration implementation code
 */
import type { ProjectConfig } from '../../../types/project-config.js';

/**
 * Generator for Express configuration code components
 */
export class ExpressConfigCodeGenerator {
  /**
   * Generate Express environment configuration
   * @param _config - Project configuration
   * @returns Environment config TypeScript code
   */
  generateEnvironmentConfig(_config: ProjectConfig): string {
    return [
      this.getConfigImports(),
      this.getConfigInterface(),
      this.getConfigValidation(),
      this.getConfigImplementation(),
      this.getCorsConfig(),
      this.getDatabaseConfig(),
    ].join('\n\n');
  }

  /**
   * Get configuration import statements
   * @returns Import statements
   */
  private getConfigImports(): string {
    return `import { config } from 'dotenv';
import { z } from 'zod';`;
  }

  /**
   * Get configuration interface definition
   * @returns Configuration interface
   */
  private getConfigInterface(): string {
    return [
      this.getInterfaceHeader(),
      this.getServerConfigInterface(),
      this.getCorsConfigInterface(),
      this.getDatabaseConfigInterface(),
      this.getSecurityConfigInterface(),
      this.getLoggingConfigInterface(),
      this.getInterfaceFooter(),
    ].join('\n');
  }

  /**
   * Get interface header
   * @returns Interface header
   */
  private getInterfaceHeader(): string {
    return `/**
 * Application configuration interface
 */
export interface AppConfig {`;
  }

  /**
   * Get server configuration interface
   * @returns Server configuration interface
   */
  private getServerConfigInterface(): string {
    return `  // Server configuration
  port: number;
  environment: 'development' | 'production' | 'test';
  nodeEnv: string;`;
  }

  /**
   * Get CORS configuration interface
   * @returns CORS configuration interface
   */
  private getCorsConfigInterface(): string {
    return `  // CORS configuration
  cors: {
    origin: string | string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };`;
  }

  /**
   * Get database configuration interface
   * @returns Database configuration interface
   */
  private getDatabaseConfigInterface(): string {
    return `  // Database configuration
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    ssl: boolean;
    url?: string;
  };`;
  }

  /**
   * Get security configuration interface
   * @returns Security configuration interface
   */
  private getSecurityConfigInterface(): string {
    return `  // Security configuration
  jwt: {
    secret: string;
    expiresIn: string;
    issuer: string;
  };`;
  }

  /**
   * Get logging configuration interface
   * @returns Logging configuration interface
   */
  private getLoggingConfigInterface(): string {
    return `  // Logging configuration
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'simple';
  };`;
  }

  /**
   * Get interface footer
   * @returns Interface footer
   */
  private getInterfaceFooter(): string {
    return `}`;
  }

  /**
   * Get configuration validation schema
   * @returns Configuration validation schema
   */
  private getConfigValidation(): string {
    return `/**
 * Configuration validation schema
 */
const configSchema = z.object({
  // Server configuration
  PORT: z.string().transform(Number).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS configuration
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.string().transform(Boolean).default('true'),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('app'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_SSL: z.string().transform(Boolean).default('false'),

  // Security configuration
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_ISSUER: z.string().default('app'),

  // Logging configuration
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('simple')
});`;
  }

  /**
   * Get configuration implementation
   * @returns Configuration implementation
   */
  private getConfigImplementation(): string {
    return [
      this.getConfigHeader(),
      this.getAppConfigExport(),
      this.getConfigExportHeader(),
      this.getServerConfigExport(),
      this.getCorsConfigExport(),
      this.getDatabaseConfigExport(),
      this.getSecurityConfigExport(),
      this.getLoggingConfigExport(),
      this.getConfigExportFooter(),
    ].join('\n');
  }

  /**
   * Get configuration header
   * @returns Configuration header
   */
  private getConfigHeader(): string {
    return `// Load environment variables
config();`;
  }

  /**
   * Get app config export
   * @returns App config export
   */
  private getAppConfigExport(): string {
    return `/**
 * Validate and export configuration
 */
export const appConfig = configSchema.parse(process.env);`;
  }

  /**
   * Get config export header
   * @returns Config export header
   */
  private getConfigExportHeader(): string {
    return `/**
 * Export configuration object with proper typing
 */
export const config: AppConfig = {`;
  }

  /**
   * Get server configuration export
   * @returns Server configuration export
   */
  private getServerConfigExport(): string {
    return `  // Server configuration
  port: appConfig.PORT,
  environment: appConfig.NODE_ENV,
  nodeEnv: process.env.NODE_ENV || 'development',`;
  }

  /**
   * Get CORS configuration export
   * @returns CORS configuration export
   */
  private getCorsConfigExport(): string {
    return `  // CORS configuration
  cors: {
    origin: appConfig.CORS_ORIGIN.split(',').map(origin => origin.trim()),
    credentials: appConfig.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },`;
  }

  /**
   * Get database configuration export
   * @returns Database configuration export
   */
  private getDatabaseConfigExport(): string {
    return `  // Database configuration
  database: {
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    name: appConfig.DB_NAME,
    username: appConfig.DB_USER,
    password: appConfig.DB_PASSWORD,
    ssl: appConfig.DB_SSL,
    url: \`postgresql://\${appConfig.DB_USER}:\${appConfig.DB_PASSWORD}@\${appConfig.DB_HOST}:\${appConfig.DB_PORT}/\${appConfig.DB_NAME}\`
  },`;
  }

  /**
   * Get security configuration export
   * @returns Security configuration export
   */
  private getSecurityConfigExport(): string {
    return `  // Security configuration
  jwt: {
    secret: appConfig.JWT_SECRET,
    expiresIn: appConfig.JWT_EXPIRES_IN,
    issuer: appConfig.JWT_ISSUER
  },`;
  }

  /**
   * Get logging configuration export
   * @returns Logging configuration export
   */
  private getLoggingConfigExport(): string {
    return `  // Logging configuration
  logging: {
    level: appConfig.LOG_LEVEL,
    format: appConfig.LOG_FORMAT
  }`;
  }

  /**
   * Get config export footer
   * @returns Config export footer
   */
  private getConfigExportFooter(): string {
    return `};`;
  }

  /**
   * Get CORS configuration helper
   * @returns CORS configuration helper
   */
  private getCorsConfig(): string {
    return `/**
 * Get CORS options for Express
 * @returns CORS configuration object
 */
export function getCorsOptions(): {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
} {
  return {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders
  };
}`;
  }

  /**
   * Get database configuration helper
   * @returns Database configuration helper
   */
  private getDatabaseConfig(): string {
    return `/**
 * Get database connection configuration
 * @returns Database connection object
 */
export function getDatabaseConfig(): {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionString?: string;
} {
  return {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    username: config.database.username,
    password: config.database.password,
    ssl: config.database.ssl,
    connectionString: config.database.url
  };
}`;
  }
}
