# Consumer Web TAF — TAFLEX Example

Sample project demonstrating how to consume `@taflex/web`
from GitHub Packages. The `@taflex/web` package re-exports everything
from `@taflex/core`, so no separate core install is needed.

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

- The `.npmrc` file tells npm to resolve any `@taflex/*` package from
  GitHub Packages instead of the public npm registry.
- The `GITHUB_TOKEN` environment variable provides authentication.
- All other dependencies (like `@playwright/test`) install from the public
  npm registry as usual.

## CI/CD Usage

For GitHub Actions workflows in consuming projects, add this to your `.github/workflows/ci.yml`:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      registry-url: https://npm.pkg.github.com
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  - run: npm test
```

> **Note:** For cross-repository package access, use a PAT with `read:packages`
> scope stored as a repository secret (e.g., `secrets.PKG_TOKEN`).

## Local testing (before packages are published)

If the packages haven't been published yet, you can test locally using `npm pack`:

```bash
# From the taflex-js-modular root
cd packages/core && npm pack && cd ../..
cd packages/web && npm pack && cd ../..

# From this consumer project
npm install ../../packages/core/taflex-core-1.0.0.tgz
npm install ../../packages/web/taflex-web-1.0.0.tgz
```
