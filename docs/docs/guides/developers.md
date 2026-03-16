# Developers Guide

This guide is for developers who want to extend TAFLEX JS or integrate it into their CI/CD pipelines.

## Extending the Framework

### Adding a New Strategy
To add support for a new platform, create a new class extending `AutomationDriver` in `src/core/drivers/strategies/`.

```javascript
import { AutomationDriver } from '../automation.driver.js';

export class MyNewStrategy extends AutomationDriver {
    // Implement abstract methods
}
```

Then, register it in `src/core/drivers/driver.factory.js`.

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
- name: Run tests
  run: npm test
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
    API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

## Type Safety with Zod

If you add new configuration parameters, update the `ConfigSchema` in `src/config/config.manager.js`. This ensures that any missing or invalid configuration is caught immediately at runtime.

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
