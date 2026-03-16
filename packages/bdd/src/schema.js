import { z } from 'zod';

export const BddConfigSchema = z.object({
  FEATURES_PATH: z.string().default('tests/bdd/features'),
  STEPS_PATH: z.string().default('tests/bdd/steps'),
});
