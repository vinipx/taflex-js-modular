import { test, expect } from '@playwright/test';
import { PlaywrightDriver, configManager, WebConfigSchema, logger } from '@taflex/web';

configManager.registerSchema(WebConfigSchema);
configManager.load();

const BASE_URL = configManager.get('BASE_URL') || 'https://playwright.dev';

test.describe('TAFLEX Consumer Example', () => {
  test('should load config and create a web driver', () => {
    // Verify @taflex/core is importable and functional
    expect(configManager).toBeDefined();
    expect(logger).toBeDefined();

    // Verify @taflex/web is importable and functional
    const driver = new PlaywrightDriver();
    expect(driver).toBeDefined();
  });

  test('should navigate to a page using the driver', async ({ page }) => {
    const driver = new PlaywrightDriver();
    await driver.adoptPage(page);
    await driver.navigateTo(BASE_URL);

    await expect(page).toHaveTitle(/Playwright/);
  });
});
