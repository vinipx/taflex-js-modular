import { z } from 'zod';

/**
 * Shared cloud platform configuration schema.
 * Used by both web and mobile packages to avoid schema collision on merge.
 */
export const CloudConfigSchema = z.object({
  CLOUD_PLATFORM: z.enum(['local', 'browserstack', 'saucelabs']).default('local'),
  CLOUD_USER: z.string().optional(),
  CLOUD_KEY: z.string().optional(),
  OS: z.string().optional(),
  OS_VERSION: z.string().optional(),
});

/**
 * Base configuration schema for the core framework.
 */
export const CoreConfigSchema = z.object({
  TIMEOUT: z.preprocess((val) => parseInt(val, 10), z.number()).default(30000),
  REPORTERS: z
    .string()
    .default('html')
    .transform((val) => val.split(',').map((s) => s.trim())),
});

/**
 * Utility to merge multiple Zod schemas into a single schema.
 * @param  {...z.ZodObject} schemas - The schemas to merge.
 * @returns {z.ZodObject} The merged schema.
 */
export function mergeSchemas(...schemas) {
  if (schemas.length === 0) {
    return z.object({});
  }

  let merged = schemas[0];
  for (let i = 1; i < schemas.length; i++) {
    merged = merged.merge(schemas[i]);
  }
  return merged;
}
