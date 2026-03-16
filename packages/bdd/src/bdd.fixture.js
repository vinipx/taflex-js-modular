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

    // Create driver from registry
    const driver = DriverRegistry.create(mode, provider);

    // Adopt Playwright page/request if applicable for Playwright-native drivers
    if (mode === 'web' && typeof driver.adoptPage === 'function') {
      await driver.adoptPage(page);
    } else if (mode === 'api' && provider === 'playwright' && typeof driver.adoptRequest === 'function') {
      await driver.adoptRequest(request);
    } else {
      // For mobile or other API strategies (like Axios), use standard initialize
      await driver.initialize(configManager.config);
    }

    await use(driver);

    // Cleanup - don't terminate page/request if they are managed by the Playwright runner
    if (
      typeof driver.terminate === 'function' &&
      mode !== 'web' &&
      !(mode === 'api' && provider === 'playwright')
    ) {
      await driver.terminate();
    }
  },
});

export const { Given, When, Then } = createBdd(test);
export { expect };
