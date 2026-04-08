import { z } from 'zod';
import { CloudConfigSchema } from '@taflex/core';

export const WebConfigSchema = CloudConfigSchema.merge(
  z.object({
    BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
    HEADLESS: z
      .preprocess((val) => (val === undefined ? undefined : val === 'true'), z.boolean())
      .default(true),
    BROWSER_VERSION: z.string().default('latest'),
    BASE_URL: z.preprocess(
      (val) => (val === '' || val === '/' ? undefined : val),
      z.string().url().optional()
    ),
  })
);
