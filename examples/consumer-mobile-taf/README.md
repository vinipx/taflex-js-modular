# Consumer Mobile TAF — TAFLEX Example

Sample project demonstrating how to consume `@taflex/core` and `@taflex/mobile`
packages from the GitHub Packages for mobile testing.

Uses [WebdriverIO](https://webdriver.io) with [Appium](https://appium.io) for
mobile automation, supporting both local emulators and cloud platforms
(BrowserStack, SauceLabs).

## Prerequisites

- Node.js >= 20
- Access to the TAFLEX repository on GitHub
- A GitHub Personal Access Token (PAT) with `read:packages` scope
- For real mobile tests: Appium server + Android emulator or iOS simulator
  (or BrowserStack/SauceLabs credentials)

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
```

### 3. Run tests

```bash
npm test
```

> **Note:** The default tests verify imports and driver API structure without
> requiring a running Appium server. Uncomment the skipped tests in
> `tests/example.mobile.spec.js` once your mobile environment is set up.

## How it works

- The `.npmrc` file tells npm to resolve any `@taflex/*` package from the
  GitHub Packages instead of the public npm registry.
- The `GITHUB_TOKEN` environment variable provides authentication.
- Tests use **Vitest** as the runner and `WebdriverioMobileDriver` from
  `@taflex/mobile`.
- The driver supports local Appium execution as well as cloud platforms
  (BrowserStack, SauceLabs) via `CLOUD_PLATFORM` configuration.

## Local testing (before packages are published)

If the packages haven't been published yet, you can test locally using `npm pack`:

```bash
# From the taflex-js-modular root
cd packages/core && npm pack && cd ../..
cd packages/mobile && npm pack && cd ../..

# From this consumer project
npm install ../../packages/core/taflex-core-1.0.0.tgz
npm install ../../packages/mobile/taflex-mobile-1.0.0.tgz
```
