import { test as base, expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { DriverRegistry, configManager } from '@taflex/core';

/**
 * TAFLEX-aware Playwright Test fixture.
 * Automatically initializes the correct driver strategy based on configuration.
 */
export const test = base.extend({
  driver: async ({ page, request }, use) => {
    const mode = configManager.get('EXECUTION_MODE');
    const provider = configManager.get('API_PROVIDER') || 'default';
    const managedByPlaywright = mode === 'web' || (mode === 'api' && provider === 'playwright');

    let driver;
    try {
      driver = DriverRegistry.create(mode, provider);

      if (mode === 'web') {
        await driver.adoptPage(page);
      } else if (mode === 'api' && provider === 'playwright') {
        await driver.adoptRequest(request);
      } else {
        await driver.initialize(configManager.config);
      }
    } catch (error) {
      throw new Error(
        `Failed to initialize driver for mode '${mode}' with provider '${provider}': ${error.message}`,
        { cause: error }
      );
    }

    await use(driver);

    if (!managedByPlaywright) {
      await driver.terminate();
    }
  },
});

export const { Given, When, Then } = createBdd(test);
export { expect };
