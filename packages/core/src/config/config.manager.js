import dotenv from 'dotenv';
import { CoreConfigSchema, mergeSchemas } from './schema.js';

/**
 * Manages framework configuration by loading, validating, and providing
 * access to environment variables based on registered schemas.
 */
export class ConfigManager {
  constructor() {
    this.schemas = [CoreConfigSchema];
    this.config = {};
  }

  /**
   * Registers an additional Zod schema for configuration validation.
   * @param {import('zod').ZodObject} schema
   */
  registerSchema(schema) {
    this.schemas.push(schema);
  }

  /**
   * Loads and validates the configuration based on registered schemas.
   * Must be called after all schemas are registered.
   */
  load() {
    dotenv.config();
    const finalSchema = mergeSchemas(...this.schemas);
    const result = finalSchema.safeParse(process.env);

    if (!result.success) {
      console.error('❌ Invalid configuration:', result.error.format());
      throw new Error('Invalid environment configuration');
    }
    this.config = result.data;
  }

  /**
   * Retrieves a configuration value by key.
   * @param {string} key - The configuration key (e.g., 'BROWSER').
   * @returns {*} The configuration value.
   */
  get(key) {
    return this.config[key];
  }
}

/**
 * Singleton instance of ConfigManager for application-wide use.
 */
export const configManager = new ConfigManager();
