# Web Testing Tutorial

Learn how to write robust and maintainable Web tests using TAFLEX JS.

## 1. Page Object Model (POM)

We recommend using the Page Object Model to encapsulate page-specific logic and locators. This makes tests readable and easy to maintain.

### Step 1: Create Locators
Create a JSON file for your page in `src/resources/locators/web/search.json`:

```json
{
  "search_input": "input[name='q']",
  "search_button": "input[type='submit'] >> n=1"
}
```

### Step 2: Create Page Object
Create a class to handle interactions in `tests/web/pages/search.page.js`:

```javascript
export class SearchPage {
    constructor(driver) {
        this.driver = driver;
    }

    async open() {
        await this.driver.navigateTo('https://www.google.com');
        // Load the page-specific locators
        await this.driver.loadLocators('search');
    }

    async searchFor(term) {
        const input = await this.driver.findElement('search_input');
        await input.fill(term);
        await input.press('Enter');
    }
}
```

## 2. Writing the Test Spec

Create a Playwright test spec that uses `PlaywrightDriver` from `@taflex/web`. The driver adopts Playwright's native `page` object and adds TAFLEX features (locator management, element abstraction, cloud routing).

```javascript
import { test, expect } from '@playwright/test';
import { PlaywrightDriver, configManager, WebConfigSchema } from '@taflex/web';
import { SearchPage } from './pages/search.page.js';

configManager.registerSchema(WebConfigSchema);
configManager.load();

test.describe('Google Search', () => {
    test('should find relevant results', async ({ page }) => {
        const driver = new PlaywrightDriver();
        await driver.adoptPage(page);

        const searchPage = new SearchPage(driver);

        await searchPage.open();
        await searchPage.searchFor('Taflex JS');

        // Assertions using Playwright's expect
        await expect(page).toHaveTitle(/Taflex JS/);
    });
});
```

## 3. Best Practices

- **Load Locators Early**: Always call `driver.loadLocators('page_name')` before interacting with elements.
- **Use Logical Names**: Refer to elements by their logical names (e.g., `login_button`) instead of hardcoded CSS/XPath.
- **Adopt the Page**: Call `driver.adoptPage(page)` to connect the TAFLEX driver to Playwright's page. This lets Playwright manage the browser lifecycle while TAFLEX adds locator resolution, element abstraction, and cloud routing.

## Running on Cloud Grids

You can run these same tests on **BrowserStack** or **SauceLabs** by simply updating your `.env` file. No code changes are required.

Refer to the [Cloud Execution Tutorial](./cloud-execution.md) for detailed configuration steps.
