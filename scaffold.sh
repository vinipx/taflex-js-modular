#!/bin/bash

# Styling
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}       TAFLEX JS Enterprise Scaffolder                  ${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo ""

# 0. Registry source
echo -e "\n${CYAN}Where are @taflex packages hosted?${NC}"
echo -e "  1) GitHub Packages (default)"
echo -e "  2) GitHub repository (direct from source)"
read -p "Choose [1]: " REGISTRY_CHOICE
REGISTRY_CHOICE=${REGISTRY_CHOICE:-1}

if [ "$REGISTRY_CHOICE" = "2" ]; then
  PKG_SOURCE="github"
  GITHUB_REPO="git+https://github.com/vinipx/taflex-js-modular.git"
else
  PKG_SOURCE="registry"

  echo -e "\n${CYAN}@taflex package version to install:${NC}"
  read -p "  Version (e.g., 1.0.0 or latest) [latest]: " TAFLEX_VERSION
  TAFLEX_VERSION=${TAFLEX_VERSION:-latest}
fi

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
  echo -e "${RED}Directory '$TARGET_DIR_ABS' already exists. Aborting.${NC}"
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

echo -e "\n${YELLOW}Generating project '$PROJECT_NAME' at '$TARGET_DIR_ABS'...${NC}"
mkdir -p "$TARGET_DIR_ABS/src/resources/locators"
mkdir -p "$TARGET_DIR_ABS/tests"

# --- Helper: resolve package reference based on registry ---
pkg_ref() {
  local pkg_name=$1
  if [ "$PKG_SOURCE" = "github" ]; then
    echo "$GITHUB_REPO#workspace=packages/$pkg_name"
  else
    if [ "$TAFLEX_VERSION" = "latest" ]; then
      echo "latest"
    else
      echo "^$TAFLEX_VERSION"
    fi
  fi
}

# --- GENERATE .npmrc for GitHub Packages registry ---
if [ "$PKG_SOURCE" = "registry" ]; then
  cat <<EOF > "$TARGET_DIR_ABS/.npmrc"
# Configure @taflex scope to resolve from GitHub Packages
# The GITHUB_TOKEN env var should contain your PAT with read:packages scope

@taflex:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
EOF
  echo -e "${CYAN}Created .npmrc with GitHub Packages registry configuration.${NC}"
fi

# --- Determine primary runner ---
# BDD or Web uses Playwright; API-only uses Vitest
HAS_WEB=false; [[ "$USE_WEB" =~ ^[Yy]$ ]] || [[ -z "$USE_WEB" ]] && HAS_WEB=true
HAS_API=false; [[ "$USE_API" =~ ^[Yy]$ ]] || [[ -z "$USE_API" ]] && HAS_API=true
HAS_MOBILE=false; [[ "$USE_MOBILE" =~ ^[Yy]$ ]] && HAS_MOBILE=true
HAS_BDD=false; [[ "$USE_BDD" =~ ^[Yy]$ ]] || [[ -z "$USE_BDD" ]] && HAS_BDD=true
HAS_DB=false; [[ "$USE_DB" =~ ^[Yy]$ ]] && HAS_DB=true
HAS_REPORTERS=false
[[ "$USE_ALLURE" =~ ^[Yy]$ ]] || [[ "$USE_RP" =~ ^[Yy]$ ]] || [[ "$USE_XRAY" =~ ^[Yy]$ ]] && HAS_REPORTERS=true

USES_PLAYWRIGHT=$($HAS_WEB || $HAS_BDD || $HAS_MOBILE && echo true || echo false)

# --- GENERATE package.json ---
cat <<EOF > "$TARGET_DIR_ABS/package.json"
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
EOF

if $HAS_BDD; then
  echo '    "test": "npx bddgen && npx playwright test",' >> "$TARGET_DIR_ABS/package.json"
  echo '    "test:bdd": "npx bddgen && npx playwright test",' >> "$TARGET_DIR_ABS/package.json"
  echo '    "bddgen": "npx bddgen"' >> "$TARGET_DIR_ABS/package.json"
elif $HAS_WEB; then
  echo '    "test": "npx playwright test",' >> "$TARGET_DIR_ABS/package.json"
  echo '    "test:ui": "npx playwright test --ui"' >> "$TARGET_DIR_ABS/package.json"
else
  echo '    "test": "vitest run"' >> "$TARGET_DIR_ABS/package.json"
fi

cat <<EOF >> "$TARGET_DIR_ABS/package.json"
  },
  "dependencies": {
    "@taflex/core": "$(pkg_ref core)"
EOF

if $HAS_WEB; then echo "    ,\"@taflex/web\": \"$(pkg_ref web)\"" >> "$TARGET_DIR_ABS/package.json"; fi
if $HAS_API; then echo "    ,\"@taflex/api\": \"$(pkg_ref api)\"" >> "$TARGET_DIR_ABS/package.json"; fi
if $HAS_MOBILE; then echo "    ,\"@taflex/mobile\": \"$(pkg_ref mobile)\"" >> "$TARGET_DIR_ABS/package.json"; fi
if $HAS_BDD; then echo "    ,\"@taflex/bdd\": \"$(pkg_ref bdd)\"" >> "$TARGET_DIR_ABS/package.json"; fi
if $HAS_DB; then echo "    ,\"@taflex/database\": \"$(pkg_ref database)\"" >> "$TARGET_DIR_ABS/package.json"; fi
if $HAS_REPORTERS; then echo "    ,\"@taflex/reporters\": \"$(pkg_ref reporters)\"" >> "$TARGET_DIR_ABS/package.json"; fi

echo '  },' >> "$TARGET_DIR_ABS/package.json"
echo '  "devDependencies": {' >> "$TARGET_DIR_ABS/package.json"

if $USES_PLAYWRIGHT; then
  echo '    "@playwright/test": "^1.40.0"' >> "$TARGET_DIR_ABS/package.json"
  if $HAS_BDD; then echo '    ,"playwright-bdd": "^6.0.0"' >> "$TARGET_DIR_ABS/package.json"; fi
else
  echo '    "vitest": "^4.0.0"' >> "$TARGET_DIR_ABS/package.json"
fi

cat <<EOF >> "$TARGET_DIR_ABS/package.json"
  }
}
EOF

# --- GENERATE .env ---
cat <<EOF > "$TARGET_DIR_ABS/.env"
# Framework Configuration
TIMEOUT=30000
EOF

if $HAS_WEB; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"

# Web Configuration
BROWSER=chromium
HEADLESS=true
BASE_URL=https://example.com
EOF
fi

if $HAS_API; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"

# API Configuration
API_BASE_URL=https://api.example.com
EOF
fi

if $HAS_BDD; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"

# BDD Configuration (driver selection for @taflex/bdd fixture)
EXECUTION_MODE=web
EOF
  if $HAS_API; then echo "API_PROVIDER=playwright" >> "$TARGET_DIR_ABS/.env"; fi
fi

if $HAS_DB; then
  cat <<EOF >> "$TARGET_DIR_ABS/.env"

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=mydb
EOF
fi

# --- GENERATE taflex.setup.js ---
# Determine the primary package to import configManager from
if $HAS_WEB; then
  SETUP_PRIMARY_PKG="@taflex/web"
  SETUP_PRIMARY_IMPORTS="configManager, WebConfigSchema"
elif $HAS_API; then
  SETUP_PRIMARY_PKG="@taflex/api"
  SETUP_PRIMARY_IMPORTS="configManager, ApiConfigSchema"
elif $HAS_MOBILE; then
  SETUP_PRIMARY_PKG="@taflex/mobile"
  SETUP_PRIMARY_IMPORTS="configManager, MobileConfigSchema"
else
  SETUP_PRIMARY_PKG="@taflex/core"
  SETUP_PRIMARY_IMPORTS="configManager"
fi

cat <<EOF > "$TARGET_DIR_ABS/taflex.setup.js"
import { $SETUP_PRIMARY_IMPORTS } from '$SETUP_PRIMARY_PKG';
EOF

# Additional schema imports (skip the primary package — already imported above)
if $HAS_WEB && [ "$SETUP_PRIMARY_PKG" != "@taflex/web" ]; then
  echo "import { WebConfigSchema } from '@taflex/web';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if $HAS_API && [ "$SETUP_PRIMARY_PKG" != "@taflex/api" ]; then
  echo "import { ApiConfigSchema } from '@taflex/api';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if $HAS_MOBILE && [ "$SETUP_PRIMARY_PKG" != "@taflex/mobile" ]; then
  echo "import { MobileConfigSchema } from '@taflex/mobile';" >> "$TARGET_DIR_ABS/taflex.setup.js"
fi
if $HAS_BDD; then echo "import { BddConfigSchema } from '@taflex/bdd';" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_DB; then echo "import { DatabaseConfigSchema } from '@taflex/database';" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_REPORTERS; then echo "import { ReporterConfigSchema } from '@taflex/reporters';" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi

cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// Register configuration schemas
EOF

if $HAS_WEB; then echo "configManager.registerSchema(WebConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_API; then echo "configManager.registerSchema(ApiConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_MOBILE; then echo "configManager.registerSchema(MobileConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_BDD; then echo "configManager.registerSchema(BddConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_DB; then echo "configManager.registerSchema(DatabaseConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi
if $HAS_REPORTERS; then echo "configManager.registerSchema(ReporterConfigSchema);" >> "$TARGET_DIR_ABS/taflex.setup.js"; fi

cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// Load and validate env vars
configManager.load();
EOF

if $HAS_DB; then
  cat <<EOF >> "$TARGET_DIR_ABS/taflex.setup.js"

// Database Initialization (Optional)
/*
import { databaseManager } from '@taflex/database';
await databaseManager.connectPostgres({
  host: configManager.get('DB_HOST'),
  user: configManager.get('DB_USER'),
  password: configManager.get('DB_PASSWORD'),
  database: configManager.get('DB_NAME'),
});
*/
EOF
fi

# --- GENERATE test runner config ---
if $HAS_BDD; then
  # BDD: Playwright config with playwright-bdd
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

elif $HAS_WEB; then
  # Web (no BDD): standard Playwright config
  cat <<EOF > "$TARGET_DIR_ABS/playwright.config.js"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
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

else
  # API-only: Vitest config
  cat <<EOF > "$TARGET_DIR_ABS/vitest.config.js"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.spec.js'],
  },
});
EOF
fi

# --- GENERATE BDD fixtures and samples ---
if $HAS_BDD; then
  cat <<EOF > "$TARGET_DIR_ABS/tests/fixtures.js"
import '../taflex.setup.js';
import { test, expect } from '@taflex/bdd';

export { test, expect };
EOF

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

# --- GENERATE Web sample (non-BDD) ---
elif $HAS_WEB; then
  cat <<EOF > "$TARGET_DIR_ABS/tests/example.spec.js"
import { test, expect } from '@playwright/test';
import { PlaywrightDriver, configManager, WebConfigSchema } from '@taflex/web';

configManager.registerSchema(WebConfigSchema);
configManager.load();

const BASE_URL = configManager.get('BASE_URL') || 'https://example.com';

test.describe('Example Web Tests', () => {
  test('should navigate and verify title', async ({ page }) => {
    const driver = new PlaywrightDriver();
    await driver.adoptPage(page);
    await driver.navigateTo(BASE_URL);

    await expect(page).toHaveTitle(/.+/);
  });
});
EOF

# --- GENERATE API sample (non-BDD, non-Web) ---
elif $HAS_API; then
  cat <<EOF > "$TARGET_DIR_ABS/tests/example.api.spec.js"
import { AxiosApiDriver, configManager, ApiConfigSchema } from '@taflex/api';

configManager.registerSchema(ApiConfigSchema);
configManager.load();

describe('Example API Tests', () => {
  const api = new AxiosApiDriver();

  beforeAll(async () => {
    await api.initialize({
      apiBaseUrl: configManager.get('API_BASE_URL') || 'https://jsonplaceholder.typicode.com',
    });
  });

  afterAll(async () => {
    await api.terminate();
  });

  it('should GET a resource', async () => {
    const response = await api.get('/posts/1');
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
  });
});
EOF
fi

# --- Done ---
echo -e "\n${GREEN}Project successfully generated at $TARGET_DIR_ABS${NC}"

if [ "$PKG_SOURCE" = "registry" ]; then
  echo -e "${YELLOW}Packages will be installed from GitHub Packages.${NC}"
  echo -e "${YELLOW}Make sure your GITHUB_TOKEN environment variable is set before running npm install.${NC}"
else
  echo -e "${YELLOW}Dependencies are linked directly to the GitHub repository workspaces.${NC}"
fi

echo -e "\n${CYAN}Next steps:${NC}"
if [ "$PKG_SOURCE" = "registry" ]; then
  echo -e "  cd $TARGET_DIR"
  echo -e "  export GITHUB_TOKEN=<your-token>"
  echo -e "  npm install"
  echo -e "  npm test\n"
else
  echo -e "  cd $TARGET_DIR"
  echo -e "  npm install"
  echo -e "  npm test\n"
fi
