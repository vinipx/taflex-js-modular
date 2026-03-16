import { z } from 'zod';

export const DatabaseConfigSchema = z.object({
  DB_HOST: z.string().optional(),
  DB_PORT: z.preprocess((val) => parseInt(val, 10), z.number()).optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
});
