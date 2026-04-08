# BDD Testing Tutorial

In this tutorial, you will learn how to create and run a Behavior-Driven Development (BDD) test using Gherkin syntax.

## 1. Create a Feature File

Features are defined in `.feature` files using plain English. Create a file at `tests/bdd/features/google_search.feature`:

```gherkin
Feature: Google Search

  Scenario: Searching for TAFLEX JS
    Given I navigate to "https://www.google.com"
    When I search for "TAFLEX JS"
    Then I should see results related to "TAFLEX"
```

## 2. Implement Step Definitions

Step definitions bridge the Gherkin steps to actual code. Create `tests/bdd/steps/google.steps.js`:

```javascript
import { Given, When, Then, expect } from '@taflex/bdd';

Given('I navigate to {string}', async ({ driver }, url) => {
    await driver.navigateTo(url);
});

When('I search for {string}', async ({ driver }, term) => {
    await driver.loadLocators('global'); // Using global locators
    const searchInput = await driver.findElement('search_input');
    await searchInput.fill(term);
    await searchInput.press('Enter');
});

Then('I should see results related to {string}', async ({ driver }, expected) => {
    // Assertions using TAFLEX JS unified element API
    const body = await driver.findElement('body_tag'); // Assuming body_tag is defined in global.json
    expect(await body.getText()).toContain(expected);
});
```

## 3. Run the Test

Execute the BDD-specific test command:

```bash
npm run test:bdd
```

## Key Benefits of this Approach

1. **Shared State**: The `driver` fixture is shared between all steps in a scenario.
2. **Locator Management**: You can use `driver.loadLocators()` within any step to fetch your JSON-based selectors.
3. **Enterprise Reporting**: BDD scenarios appear beautifully in Allure and ReportPortal, showing each Gherkin step as a test phase.
