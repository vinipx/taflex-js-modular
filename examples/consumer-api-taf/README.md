# Consumer API TAF — TAFLEX Example

Sample project demonstrating how to consume `@taflex/api`
from GitHub Packages for API testing. The `@taflex/api` package
re-exports everything from `@taflex/core`, so no separate core install is needed.

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) as a public API
to demonstrate GET, POST, PUT, PATCH, DELETE, and error handling.

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

> The `.npmrc` file is already configured to resolve `@taflex/*` packages from GitHub Packages — no additional setup needed.

### 2. Install dependencies

```bash
npm install
```

### 3. Run tests

```bash
npm test
```

## How it works

- The `.npmrc` file tells npm to resolve any `@taflex/*` package from the
  GitHub Packages instead of the public npm registry.
- The `GITHUB_TOKEN` environment variable provides authentication.
- Tests use **Vitest** as the runner and `AxiosApiDriver` from `@taflex/api`.
- The driver wraps responses in a unified interface (`status()`, `ok()`, `json()`)
  consistent across both the Axios and Playwright API drivers.

## Local testing (before packages are published)

If the packages haven't been published yet, you can test locally using `npm pack`:

```bash
# From the taflex-js-modular root
cd packages/core && npm pack && cd ../..
cd packages/api && npm pack && cd ../..

# From this consumer project
npm install ../../packages/core/taflex-core-1.0.0.tgz
npm install ../../packages/api/taflex-api-1.0.0.tgz
```
