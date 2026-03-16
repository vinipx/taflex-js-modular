import { z } from 'zod';

/**
 * Base configuration schema for the core framework.
 */
export const CoreConfigSchema = z.object({
  EXECUTION_MODE: z.enum(['web', 'api', 'mobile']).default('web'),
  API_PROVIDER: z.string().default('playwright'),
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
