# BDD Testing

TAFLEX JS supports Behavior-Driven Development (BDD) using Gherkin syntax through the `playwright-bdd` integration. This allows you to write tests in a human-readable format that can be shared with non-technical stakeholders.

## Project Structure

BDD tests are located in the `tests/bdd/` directory:
- `features/`: Contains your `.feature` files (Gherkin).
- `steps/`: Contains your JavaScript step definitions.

## Writing a Feature File

Create a file ending in `.feature` in `tests/bdd/features/`:

```gherkin
Feature: User Login

  Scenario: Successful login
    Given I navigate to "https://example.com/login"
    When I enter "myuser" as username and "mypass" as password
    And I click on the login button
    Then I should see "Welcome" in the header
```

## Writing Step Definitions

Create a JavaScript file in `tests/bdd/steps/`. Use the `createBdd` function and the TAFLEX JS `test` fixture:

```javascript
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures.js';

const { Given, When, Then } = createBdd(test);

Given('I navigate to {string}', async ({ driver }, url) => {
    await driver.navigateTo(url);
});

When('I enter {string} as username and {string} as password', async ({ driver }, user, pass) => {
    await driver.loadLocators('login');
    await (await driver.findElement('username')).fill(user);
    await (await driver.findElement('password')).fill(pass);
});

When('I click on the login button', async ({ driver }) => {
    await (await driver.findElement('login_btn')).click();
});

Then('I should see {string} in the header', async ({ driver }, expected) => {
    const header = await driver.findElement('header');
    expect(await header.getText()).toContain(expected);
});
```

## Running BDD Tests

You can run BDD tests specifically using:

```bash
npm run test:bdd
```

To run both standard and BDD tests together:

```bash
npm test
```

## How it works

TAFLEX JS uses a dual-project approach in Playwright:
1. **`chromium` project**: Runs standard Playwright tests from `./tests`.
2. **`bdd` project**: Runs generated tests from `.features-gen` (generated from your `.feature` files).

Step definitions have full access to the TAFLEX JS `driver` fixture, allowing you to use hierarchical locators and the unified element API just like in standard tests.
