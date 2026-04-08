import { z } from 'zod';

export const ApiConfigSchema = z.object({
  API_BASE_URL: z.preprocess(
    (val) => (val === '' || val === '/' ? undefined : val),
    z.string().url().optional()
  ),
});
