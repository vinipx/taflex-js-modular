#!/bin/bash

# Styling
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}       🚀 TAFLEX JS Enterprise Scaffolder (GitHub)      ${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo ""

# 1. Project Path
echo -e "\n${CYAN}Where would you like to scaffold the project?${NC}"
read -p "Enter path (e.g., ./my-automation-project or ../tests): " TARGET_DIR
TARGET_DIR=${TARGET_DIR:-./taflex-tests}

# Resolve absolute path
TARGET_DIR_ABS=$(cd "$(dirname "$TARGET_DIR")" 2>/dev/null && pwd)/$(basename "$TARGET_DIR")
if [ -z "$(cd "$(dirname "$TARGET_DIR")" 2>/dev/null && pwd)" ]; then
  TARGET_DIR_ABS=$(pwd)/$TARGET_DIR
fi

if [ -d "$TARGET_DIR_ABS" ]; then
  echo -e "${RED}❌ Directory '$TARGET_DIR_ABS' already exists. Aborting.${NC}"
  exit 1
fi

PROJECT_NAME=$(basename "$TARGET_DIR_ABS")

# 2. Platforms
echo -e "\n${CYAN}Which platforms will you be testing? (y/n)${NC}"
read -p "  - Web (Playwright)? [Y/n]: " USE_WEB
read -p "  - API (Axios/Playwright)? [Y/n]: " USE_API
read -p "  - Mobile (WebdriverIO)? [y/N]: " USE_MOBILE

# 3. Features
echo -e "\n${CYAN}Which extra features do you need? (y/n)${NC}"
read -p "  - BDD (Gherkin/Cucumber)? [Y/n]: " USE_BDD

# 4. Database
echo -e "\n${CYAN}Do you need Database Integration?${NC}"
read -p "  - Postgres/MySQL? [y/N]: " USE_DB

# 5. Reporters
echo -e "\n${CYAN}Which reporters do you use? (y/n)${NC}"
read -p "  - Allure? [Y/n]: " USE_ALLURE
read -p "  - ReportPortal? [y/N]: " USE_RP
read -p "  - Xray (Jira)? [y/N]: " USE_XRAY

echo -e "\n${YELLOW}⚙️  Generating project '$PROJECT_NAME' at '$TARGET_DIR_ABS'...${NC}"
mkdir -p "$TARGET_DIR_ABS/src/resources/locators"
mkdir -p "$TARGET_DIR_ABS/tests"

# --- GENERATE package.json ---
GITHUB_REPO="git+https://github.com/vinipx/taflex-js-modular.git"

cat <<EOF > "$TARGET_DIR_ABS/package.json"
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "npx playwright test",
    "test:ui": "npx playwright test --ui"
EOF

if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then
  echo '    ,"test:bdd": "npx bddgen && npx playwright test"' >> "$TARGET_DIR_ABS/package.json"
  echo '    ,"bddgen": "npx bddgen"' >> "$TARGET_DIR_ABS/package.json"
fi

cat <<EOF >> "$TARGET_DIR_ABS/package.json"
  },
  "dependencies": {
    "@taflex/core": "$GITHUB_REPO#workspace=packages/core"
EOF

if [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]]; then
  echo "    ,\"@taflex/web\": \"$GITHUB_REPO#workspace=packages/web\"" >> "$TARGET_DIR_ABS/package.json"
fi
if [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]]; then
  echo "    ,\"@taflex/api\": \"$GITHUB_REPO#workspace=packages/api\"" >> "$TARGET_DIR_ABS/package.json"
fi
if [[ "$USE_MOBILE" =~ ^[Yy]$ ]]; then
  echo "    ,\"@taflex/mobile\": \"$GITHUB_REPO#workspace=packages/mobile\"" >> "$TARGET_DIR_ABS/package.json"
fi
if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then
  echo "    ,\"@taflex/bdd\": \"$GITHUB_REPO#workspace=packages/bdd\"" >> "$TARGET_DIR_ABS/package.json"
fi
if [[ "$USE_DB" =~ ^[Yy]$ ]]; then
  echo "    ,\"@taflex/database\": \"$GITHUB_REPO#workspace=packages/database\"" >> "$TARGET_DIR_ABS/package.json"
fi
if [[ "$USE_ALLURE" =~ ^[Yy]$ ]] || [[ "$USE_RP" =~ ^[Yy]$ ]] || [[ "$USE_XRAY" =~ ^[Yy]$ ]]; then
  echo "    ,\"@taflex/reporters\": \"$GITHUB_REPO#workspace=packages/reporters\"" >> "$TARGET_DIR_ABS/package.json"
fi

cat <<EOF >> "$TARGET_DIR_ABS/package.json"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
EOF

if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then
  echo '    ,"playwright-bdd": "^6.0.0"' >> "$TARGET_DIR_ABS/package.json"
fi

cat <<EOF >> "$TARGET_DIR_ABS/package.json"
  }
}
EOF

# --- GENERATE .env ---
cat <<EOF > "$TARGET_DIR_ABS/.env"
# Framework Configuration
EXECUTION_MODE=web
EOF

if [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]]; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"
BROWSER=chromium
HEADLESS=true
BASE_URL=https://example.com
EOF
fi

if [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]]; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"
API_BASE_URL=https://api.example.com
API_PROVIDER=playwright
EOF
fi

if [[ "$USE_DB" =~ ^[Yy]$ ]]; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=mydb
EOF
fi

# --- GENERATE taflex.setup.js ---
cat <<EOF > "$TARGET_DIR_ABS/taflex.setup.js"
import { DriverRegistry, configManager } from '@taflex/core';
EOF

if [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]]; then
  echo "import { PlaywrightDriverStrategy, WebConfigSchema } from '@taflex/web';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]]; then
  echo "import { PlaywrightApiStrategy, AxiosApiStrategy, ApiConfigSchema } from '@taflex/api';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_MOBILE" =~ ^[Yy]$ ]]; then
  echo "import { WebdriverioMobileStrategy, MobileConfigSchema } from '@taflex/mobile';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then
  echo "import { BddConfigSchema } from '@taflex/bdd';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_DB" =~ ^[Yy]$ ]]; then
  echo "import { databaseManager, DatabaseConfigSchema } from '@taflex/database';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_ALLURE" =~ ^[Yy]$ ]] || [[ "$USE_RP" =~ ^[Yy]$ ]] || [[ "$USE_XRAY" =~ ^[Yy]$ ]]; then
  echo "import { ReporterConfigSchema } from '@taflex/reporters';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi

cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// 1. Register Configuration Schemas
EOF

if [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]]; then echo "configManager.registerSchema(WebConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]]; then echo "configManager.registerSchema(ApiConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if [[ "$USE_MOBILE" =~ ^[Yy]$ ]]; then echo "configManager.registerSchema(MobileConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then echo "configManager.registerSchema(BddConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if [[ "$USE_DB" =~ ^[Yy]$ ]]; then echo "configManager.registerSchema(DatabaseConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if [[ "$USE_ALLURE" =~ ^[Yy]$ ]] || [[ "$USE_RP" =~ ^[Yy]$ ]] || [[ "$USE_XRAY" =~ ^[Yy]$ ]]; then echo "configManager.registerSchema(ReporterConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi

cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// Load and validate env vars
configManager.load();

// 2. Register Strategies
EOF

if [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]]; then
  echo "DriverRegistry.register('web', 'default', PlaywrightDriverStrategy);" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]]; then
  echo "DriverRegistry.register('api', 'playwright', PlaywrightApiStrategy);" >> "$TARGET_DIR_ABS/taflex.setup.js"
  echo "DriverRegistry.register('api', 'axios', AxiosApiStrategy);" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if [[ "$USE_MOBILE" =~ ^[Yy]$ ]]; then
  echo "DriverRegistry.register('mobile', 'default', WebdriverioMobileStrategy);" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi

if [[ "$USE_DB" =~ ^[Yy]$ ]]; then
  cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// 3. Database Initialization (Optional)
/*
await databaseManager.connectPostgres({
  host: configManager.get('DB_HOST'),
  user: configManager.get('DB_USER'),
  password: configManager.get('DB_PASSWORD'),
  database: configManager.get('DB_NAME'),
});
*/
EOF
fi

# --- GENERATE playwright.config.js ---
cat <<EOF > "$TARGET_DIR_ABS/playwright.config.js"
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/bdd/features/*.feature',
  steps: 'tests/bdd/steps/*.js',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
EOF

# --- GENERATE fixtures.js ---
cat <<EOF > "$TARGET_DIR_ABS/tests/fixtures.js"
import { test as base } from '@taflex/bdd';
import '../taflex.setup.js';

export const test = base;
export { expect } from '@playwright/test';
EOF

# --- GENERATE BDD Sample ---
if [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]]; then
  mkdir -p "$TARGET_DIR_ABS/tests/bdd/features"
  mkdir -p "$TARGET_DIR_ABS/tests/bdd/steps"

  cat <<EOF > "$TARGET_DIR_ABS/tests/bdd/features/google_search.feature"
Feature: Google Search

  Scenario: Searching for TAFLEX
    Given I navigate to "https://www.google.com"
    Then I should see "Google" in the title
EOF

  cat <<EOF > "$TARGET_DIR_ABS/tests/bdd/steps/google.steps.js"
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures.js';

const { Given, When, Then } = createBdd(test);

Given('I navigate to {string}', async ({ driver }, url) => {
  await driver.navigateTo(url);
});

Then('I should see {string} in the title', async ({ driver }, expected) => {
  const title = await driver.page.title();
  expect(title).toContain(expected);
});
EOF
fi

echo -e "\n${GREEN}✅ Project successfully generated at $TARGET_DIR_ABS${NC}"
echo -e "${YELLOW}📝 Note: Dependencies are linked directly to your GitHub repository workspaces.${NC}"
echo -e "\n${CYAN}Next steps:${NC}"
echo -e "  cd $TARGET_DIR"
echo -e "  npm install"
echo -e "  npm test\n"