# Consumer BDD TAF — TAFLEX Example

Sample project demonstrating how to consume `@taflex/core`, `@taflex/bdd`,
and `@taflex/web` packages from the GitHub Packages for
Behavior-Driven Development (BDD) testing with Gherkin feature files.

Uses [Playwright](https://playwright.dev) as the browser engine and
[playwright-bdd](https://github.com/nicolo-ribaudo/playwright-bdd) for
Gherkin/Cucumber-style step definitions.

## Prerequisites

- Node.js >= 20
- Access to the TAFLEX repository on GitHub
- A GitHub Personal Access Token (PAT) with `read:packages` scope

## Setup

### 1. Create your GitHub PAT

1. Go to <https://github.com/settings/tokens>
2. Create a token with the **read:packages** scope
3. Export it as an environment variable:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Open `.npmrc` and replace `280633` with the actual TAFLEX project ID

### 2. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 3. Run tests

```bash
npm test
```

## How it works

- The `.npmrc` file tells npm to resolve any `@taflex/*` package from the
  GitHub Packages instead of the public npm registry.
- The `GITHUB_TOKEN` environment variable provides authentication.
- Feature files in `tests/bdd/features/` describe scenarios in Gherkin syntax.
- Step definitions in `tests/bdd/steps/` map Gherkin steps to
  `@taflex/bdd` actions using `Given`, `When`, and `Then`.
- The BDD fixture automatically initializes the correct driver based on
  `EXECUTION_MODE` (web, api, or mobile).

## Local testing (before packages are published)

If the packages haven't been published yet, you can test locally using `npm pack`:

```bash
# From the taflex-js-modular root
cd packages/core && npm pack && cd ../..
cd packages/web && npm pack && cd ../..
cd packages/bdd && npm pack && cd ../..

# From this consumer project
npm install ../../packages/core/taflex-core-1.0.0.tgz
npm install ../../packages/web/taflex-web-1.0.0.tgz
npm install ../../packages/bdd/taflex-bdd-1.0.0.tgz
```
