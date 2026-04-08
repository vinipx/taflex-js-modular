import { expect } from '@playwright/test';
import { Given, When, Then } from '@taflex/bdd';
import { configManager, BddConfigSchema } from '@taflex/bdd';
import { WebConfigSchema, mergeSchemas } from '@taflex/web';

configManager.registerSchema(mergeSchemas(BddConfigSchema, WebConfigSchema));
configManager.load();

const BASE_URL = configManager.get('BASE_URL') || 'https://playwright.dev';

Given('I am on the Playwright homepage', async ({ driver }) => {
  await driver.navigateTo(BASE_URL);
});

Then('the page title should contain {string}', async ({ page }, expectedTitle) => {
  await expect(page).toHaveTitle(new RegExp(expectedTitle));
});

Then('I should see the {string} link', async ({ page }, linkText) => {
  const link = page.getByRole('link', { name: linkText });
  await expect(link).toBeVisible();
});

When('I click the {string} link', async ({ page }, linkText) => {
  await page.getByRole('link', { name: linkText }).click();
});
