# Locators Management

Taflex JS uses a hierarchical JSON-based system for managing locators, allowing for clean separation and easy overrides.

## Directory Structure

```text
src/resources/locators/
├── global.json            # Application-wide locators
├── web/
│   ├── common.json        # Shared web locators
│   └── login.json         # Page-specific locators (Login)
├── api/
│   └── common.json
└── mobile/
    └── common.json
```

## Example: login.json

```json
{
    "username_field": "#username",
    "password_field": "#password",
    "login_button": "button[type='submit']"
}
```

## Usage in Tests

```javascript
import { test } from '../fixtures.js';

test('login test', async ({ driver }) => {
    await driver.navigateTo('https://example.com/login');
    
    // Load page-specific locators
    await driver.loadLocators('login');

    const username = await driver.findElement('username_field');
    await username.fill('myuser');
});
```

The `findElement` method will resolve the logical name `username_field` to the CSS selector `#username`.
