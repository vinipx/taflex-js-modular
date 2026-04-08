import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list'], ['@taflex/core/setup/playwright-reporter']],
  use: {
    baseURL: process.env.BASE_URL || 'https://playwright.dev',
    headless: process.env.HEADLESS !== 'false',
  },
});
