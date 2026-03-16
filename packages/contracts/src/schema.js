import { z } from 'zod';

export const PactConfigSchema = z.object({
  PACT_ENABLED: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  PACT_BROKER_URL: z.string().url().optional(),
  PACT_BROKER_TOKEN: z.string().optional(),
  PACT_CONSUMER: z.string().default('taflex-consumer'),
  PACT_PROVIDER: z.string().default('taflex-provider'),
  PACT_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
