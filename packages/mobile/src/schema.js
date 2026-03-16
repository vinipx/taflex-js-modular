import { z } from 'zod';

export const MobileConfigSchema = z.object({
  CLOUD_PLATFORM: z.enum(['local', 'browserstack', 'saucelabs']).default('local'),
  CLOUD_USER: z.string().optional(),
  CLOUD_KEY: z.string().optional(),
  OS: z.string().optional(),
  OS_VERSION: z.string().optional(),
});
