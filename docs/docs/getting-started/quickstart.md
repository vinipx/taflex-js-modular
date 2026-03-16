---
sidebar_position: 1
title: Quick Start
---

# Quick Start Guide

Get up and running with TAFLEX JS in under 5 minutes.

## 1. Installation

TAFLEX JS requires **Node.js 20** or higher. We provide an automated setup script that handles dependencies, browser installations, and initial configuration.

```bash
# Clone the repository
git clone https://github.com/vinipx/taflex-js.git
cd taflex-js

# Run the automated setup
./setup.sh
```

The script will:
- Install all NPM dependencies.
- Install Playwright browsers and system dependencies.
- Create an initial `.env` file from the example.

## 2. Configuration

The `setup.sh` script automatically creates your `.env` file. If you are performing a manual installation, you will need to create it:

```bash
# Only if you didn't run setup.sh
cp .env.example .env
```

Now, edit the `.env` file to match your environment:

```env
EXECUTION_MODE=web
BROWSER=chromium
HEADLESS=true
BASE_URL=https://www.google.com
API_BASE_URL=https://jsonplaceholder.typicode.com

# Reporting configuration
REPORTERS=html,allure
# REPORTERS=html,reportportal
```

## 3. Running Your First Test

### Integration Tests (Web/API)
Execute the Playwright test suite:

```bash
# Run all tests
npm test

# Run a specific spec
npx playwright test tests/web/login.spec.js
```

### Unit Tests
Verify the framework core components:

```bash
npm run test:unit
```

## 4. Visualizing Results

After running tests, you can view the native Playwright report:

```bash
npx playwright show-report
```

For enterprise reporting, generate the Allure report:

```bash
npm install -g allure-commandline
allure serve allure-results
```

To use **EPAM ReportPortal**, configure the `RP_*` variables in your `.env` and add `reportportal` to `REPORTERS`.

---

## 🏗️ What's Next?

- [Architecture Overview](../architecture/overview.md)
- [How to manage Locators](../guides/locators.md)
- [Database Integration](../guides/database.md)
