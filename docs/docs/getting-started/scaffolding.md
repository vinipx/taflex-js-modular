---
sidebar_position: 2
title: Interactive Scaffolder
---

# The Interactive Scaffolder

Monolithic frameworks often require you to clone a massive repository containing tools, dependencies, and configuration files you may never use. TAFLEX JS solves this through an **Interactive Scaffolder** that builds a tailored, lean automation project based on your exact needs.

## Why Scaffold?

1. **Lean Dependencies:** If your team only needs API testing, the scaffolder ensures you won't download Playwright browser binaries or Appium dependencies.
2. **Instant Configuration:** Generates a strictly typed `.env` file containing only the variables relevant to the modules you selected.
3. **Ready-to-Run Setup:** Automatically generates the project structure with correct imports and schema registration for your chosen stack.

## Running the Scaffolder

To create a new project, simply run the following command in your terminal:

```bash
bash <(curl -s https://raw.githubusercontent.com/vinipx/taflex-js-modular/main/scaffold.sh)
```

## The Wizard Steps

The interactive wizard will guide you through four main decisions to construct your project's bounded context.

### 1. Project Path
You will be asked where to scaffold the project. You can provide a relative path (e.g., `./ecommerce-tests`). A new directory will be created here.

### 2. Platforms
Select the automation contexts your team requires:
- **Web (Playwright)**
- **API (Axios/Playwright)**
- **Mobile (WebdriverIO)**

*Note: You can select multiple platforms for a unified testing strategy.*

### 3. Database Integration
Choose whether you need native Database integration for test data setup and teardown:
- **Postgres / MySQL**

### 4. Reporters
Select the reporting and governance tools your organization uses:
- **Allure** (Rich HTML reports)
- **ReportPortal** (Enterprise AI-powered dashboards)
- **Xray / Jira** (Requirements traceability)

---

## What Gets Generated?

Once the wizard completes, it generates a production-ready repository.

### Directory Structure
```text
my-automation-project/
├── src/
│   └── resources/
│       └── locators/    # Directory for your hierarchical JSON locators
├── tests/               # Directory for your test specs and features
├── .env                 # Tailored environment variables
└── package.json         # Lean dependencies pointing to TAFLEX packages
```

### Test Setup

Your test files import directly from the package you installed. Each package re-exports everything from `@taflex/core`, so a single import gives you the driver, config manager, logger, and everything else you need.

```javascript
import { PlaywrightDriver, configManager, WebConfigSchema } from '@taflex/web';
import { ReporterConfigSchema } from '@taflex/reporters';

// Register schemas for Zod validation
configManager.registerSchema(WebConfigSchema);
configManager.registerSchema(ReporterConfigSchema);

// Load and validate env vars against the combined schema
configManager.load();

// Use the driver directly
const driver = new PlaywrightDriver();
```

### The `.env` File

The `.env` file generated is perfectly mapped to the schemas you registered. If you didn't select Database support, you won't see `DB_HOST` cluttering your configuration.

```env
# Web Configuration
BROWSER=chromium
HEADLESS=true
BASE_URL=https://example.com
```

## Next Steps

Once scaffolding is complete, you simply navigate into your new folder, install the NPM dependencies, and begin writing tests!

```bash
cd my-automation-project
npm install
npm test
```
