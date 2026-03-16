import { z } from 'zod';

export const WebConfigSchema = z.object({
  BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  HEADLESS: z.preprocess((val) => val === 'true', z.boolean()).default(true),
  CLOUD_PLATFORM: z.enum(['local', 'browserstack', 'saucelabs']).default('local'),
  CLOUD_USER: z.string().optional(),
  CLOUD_KEY: z.string().optional(),
  BROWSER_VERSION: z.string().default('latest'),
  OS: z.string().optional(),
  OS_VERSION: z.string().optional(),
  BASE_URL: z.preprocess(
    (val) => (val === '' || val === '/' ? undefined : val),
    z.string().url().optional()
  ),
});
