import { z } from 'zod';

export const ReporterConfigSchema = z.object({
  XRAY_ENABLED: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  XRAY_CLIENT_ID: z.string().optional(),
  XRAY_CLIENT_SECRET: z.string().optional(),
  XRAY_PROJECT_KEY: z.string().optional(),
  XRAY_TEST_PLAN_KEY: z.string().optional(),
  XRAY_TEST_EXEC_KEY: z.string().optional(),
  XRAY_ENVIRONMENT: z.string().optional(),
  ALLURE_RESULTS_DIR: z.string().default('allure-results'),
  RP_ENDPOINT: z.string().url().optional(),
  RP_API_KEY: z.string().optional(),
  RP_PROJECT: z.string().optional(),
  RP_LAUNCH: z.string().optional(),
  RP_ATTRIBUTES: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val.split(';').map((attr) => {
            const [key, value] = attr.split(':');
            return { key, value };
          })
        : []
    ),
  RP_DESCRIPTION: z.string().optional(),
});
