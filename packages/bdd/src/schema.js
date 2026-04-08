import { z } from 'zod';

export const BddConfigSchema = z.object({
  EXECUTION_MODE: z.enum(['web', 'api', 'mobile']).default('web'),
  API_PROVIDER: z.string().default('playwright'),
  FEATURES_PATH: z.string().default('tests/bdd/features'),
  STEPS_PATH: z.string().default('tests/bdd/steps'),
});
