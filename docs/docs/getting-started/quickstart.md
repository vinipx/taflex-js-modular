---
sidebar_position: 1
title: Quick Start
---

# 🚀 Quick Start & Onboarding

Welcome to TAFLEX JS! Our onboarding process is designed to get new teams up and running with a fully configured, production-ready framework in **under 2 minutes**. 

Instead of cloning a monolithic repository full of tools you don't need, we utilize a smart interactive Scaffolder.

---

## 1. Scaffold Your Modular Project

The scaffolding script acts as your setup wizard. It analyzes your team's needs and constructs a tailored bounded context.

Open your terminal and execute:

```bash
bash <(curl -s https://raw.githubusercontent.com/vinipx/taflex-js-modular/main/scaffold.sh)
```

### The Interactive Wizard
You will be guided through a series of choices:
1. **Project Identity**: Define the path and name (e.g., `./ecommerce-checkout-tests`).
2. **Platform Selection**: Select only the contexts you need (`Web`, `API`, `Mobile`).
3. **Database Integration**: Opt-in to PostgreSQL/MySQL support for data setup.
4. **Reporting Governance**: Choose your visibility stack (HTML, Allure, ReportPortal, Xray).

---

## 2. Install Your Tailored Dependencies

Because TAFLEX JS uses a strict plugin architecture, your newly generated `package.json` only contains the modules you selected.

Navigate to your new project and install:

```bash
cd your-project-name
npm install
```

*Note: If you selected Web Testing, this step will also automatically download the necessary Playwright browser binaries.*

---

## 3. Configure Your Environment

The Scaffolder automatically generates a `.env` file containing *exactly* the variables required by your chosen modules. TAFLEX JS uses strict runtime validation, so you must fill in these values.

Open the `.env` file:

```env
# Web Module Config
BASE_URL=https://your-staging-environment.com
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000

# (Optional) API Module Config
API_BASE_URL=https://api.your-staging-environment.com
```

---

## 4. Understanding the Setup

Your test setup file registers the configuration schema for the modules you're using and validates the environment:

```javascript
import { configManager, WebConfigSchema } from '@taflex/web';

// 1. Register Configuration Schemas for Zod Validation
configManager.registerSchema(WebConfigSchema);

// 2. Load and validate environment configuration
configManager.load();
```

That's it. When you import from `@taflex/web`, the package automatically makes its driver available. If your team's scope expands in the future (e.g., you start doing Mobile testing), simply `npm install @taflex/mobile` and import from it!

---

## 5. Write and Execute Your First Test

You are now ready to write tests. Create a file in `tests/example.spec.js`:

```javascript
import { test, expect } from './fixtures.js';

test('My First Unified Test', async ({ driver }) => {
    // 1. Navigate
    await driver.navigateTo('/');
    
    // 2. Load Locators
    await driver.loadLocators('home');
    
    // 3. Interact using the unified Driver API
    const title = await driver.findElement('main_heading');
    expect(await title.isVisible()).toBeTruthy();
});
```

Run the suite:
```bash
npm test
```

---

## 🏗️ What's Next for the Team?

To maximize the framework's potential, we recommend reviewing these architectural deep dives:

- 🧠 **[Architecture Overview](../architecture/overview.md)** - Understand the modular package-driven design.
- 🎯 **[Locator Management](../guides/locators.md)** - Learn how to build highly reusable JSON selectors.
- 🤝 **[Contract Testing](../guides/pact-testing.md)** - Shift-left your API testing with Consumer-Driven Contracts.