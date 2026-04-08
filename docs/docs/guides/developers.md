# Developers Guide

This guide is for developers who want to extend TAFLEX JS or integrate it into their CI/CD pipelines.

## Extending the Framework

### Adding a New Driver
To add support for a new platform, create a new class extending `BaseDriver` (or `UiDriver` / `ApiDriver`) from `@taflex/core`.

```javascript
import { UiDriver } from '@taflex/core';

export class MyNewDriver extends UiDriver {
    // Implement abstract methods: navigateTo, findElement, etc.
}
```

Then register it in your package's barrel export (`index.js`) so it auto-registers when imported:

```javascript
import { DriverRegistry } from '@taflex/core';
import { MyNewDriver } from './src/my-new.driver.js';

DriverRegistry.register('custom', 'default', MyNewDriver);
```

## BDD Integration (Gherkin)

TAFLEX JS uses `playwright-bdd` to bridge Gherkin and Playwright.

### Generation Process
When running BDD tests, the framework executes `npx bddgen`. This command:
1. Scans `tests/bdd/features/*.feature`.
2. Scans `tests/bdd/steps/*.js` and `tests/fixtures.js`.
3. Generates executable Playwright spec files in the `.features-gen/` directory.

The `test:bdd` script in `package.json` automates this process.

## Unit Testing

Always add unit tests for core framework logic. We use **Vitest** for its speed and modern API.

```bash
npm run test:unit
```

## CI/CD Integration

TAFLEX JS is designed to run in headless environments. Ensure you pass the required environment variables.

### GitHub Actions Example
```yaml
test:
  stage: quality
  image: node:20
  script:
    - npm ci
    - npm run lint
    - npm test
  variables:
    BASE_URL: $BASE_URL
    API_BASE_URL: $API_BASE_URL
```

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
    API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

## Versioning with Changesets

TAFLEX JS uses [Changesets](https://github.com/changesets/changesets) for version management. All packages are versioned together in **fixed mode**.

### Adding a Changeset
When you make a change that affects consumers, create a changeset:
```bash
npm run changeset
```
Follow the prompts to select affected packages and describe the change. This creates a file in `.changeset/` that is consumed during the release process.

### Releasing
```bash
npm run version   # Bumps versions based on accumulated changesets
git push --follow-tags
```
When a version tag (e.g., `v1.2.0`) is pushed, the GitHub Actions pipeline publishes all packages to the GitHub Packages.

For more details, see the [Package Registry Guide](./package-registry).

## Type Safety with Zod

Each package exports its own Zod schema (e.g., `WebConfigSchema`, `ApiConfigSchema`). The `@taflex/core` package also exports a shared `CloudConfigSchema` for cloud platform settings. If you add new configuration parameters, create a new Zod schema in your package and register it with `configManager.registerSchema()` before calling `configManager.load()`. This ensures that any missing or invalid configuration is caught immediately at runtime.

## Code Hygiene & Formatting

To maintain high code quality and consistency across the project, we use **ESLint** and **Prettier**.

### Linting
Checks for potential errors and adherence to coding standards:
```bash
npm run lint
```

### Automatic Formatting
Fixes formatting and simple linting issues automatically:
```bash
npm run lint:fix
```

All contributions must pass the linter before being merged into the main branch.
