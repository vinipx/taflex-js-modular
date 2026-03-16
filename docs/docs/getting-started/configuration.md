---
sidebar_position: 3
title: Configuration Validation
---

# Type-Safe Configuration (Zod)

One of the most frequent causes of broken CI pipelines in large organizations is **configuration drift**. A developer adds a new required environment variable (like an API Key or a new Base URL) locally, but forgets to update the CI pipeline. The pipeline fails silently or deep within a test execution.

TAFLEX JS solves this through **Type-Safe Runtime Validation** powered by [Zod](https://zod.dev/).

## The Architecture

Because TAFLEX JS is highly modular, it does not have a single, massive configuration file. Instead, each module defines its own schema, and the core `ConfigManager` merges them together.

### 1. Module-Level Schemas
Each package exports a Zod schema defining the environment variables it expects.

For example, `@taflex/web` exports `WebConfigSchema`:
```javascript
import { z } from 'zod';

export const WebConfigSchema = z.object({
  EXECUTION_MODE: z.string().default('web'),
  BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  HEADLESS: z.coerce.boolean().default(true),
  BASE_URL: z.string().url('BASE_URL must be a valid URL'),
});
```

### 2. The Composition Root
In your consumer project, the `taflex.setup.js` file registers the schemas for the modules you are actually using.

```javascript
import { configManager } from '@taflex/core';
import { WebConfigSchema } from '@taflex/web';
import { DatabaseConfigSchema } from '@taflex/database';

// Combine the schemas you need
configManager.registerSchema(WebConfigSchema);
configManager.registerSchema(DatabaseConfigSchema);

// Parse the .env file and validate against the combined schema
configManager.load();
```

## Fail-Fast Execution

When `configManager.load()` is executed (before any test runs), it performs a strict validation against the current environment and your `.env` file.

If a required variable is missing, or if a variable has the wrong type (e.g., `BASE_URL=localhost` instead of a valid URL), **the framework will immediately throw a fatal error**.

```text
❌ Configuration Validation Error:
- BASE_URL: Invalid url (received 'localhost')
- DB_PASSWORD: Required
```

This "Fail-Fast" behavior guarantees that your test suite never starts executing in a broken state, saving valuable CI/CD minutes and debugging time.

## Using Configuration in Tests

Once validated, the `ConfigManager` acts as a strongly typed singleton registry. You do not need to read `process.env` directly anymore.

```javascript
import { configManager } from '@taflex/core';
import { test, expect } from '../fixtures.js';

test('verify environment config', async ({ driver }) => {
    // Safely retrieve configuration values
    const baseUrl = configManager.get('BASE_URL');
    
    await driver.navigateTo(baseUrl);
});
```

## Supported Types and Coercion

TAFLEX JS leverages Zod's coercion features, which is particularly useful for environment variables (which are always parsed as strings).

- `z.coerce.boolean()`: Converts `"true"` or `"false"` strings into actual boolean types.
- `z.coerce.number()`: Converts `"30000"` into the integer `30000`.
- `z.string().url()`: Ensures the string is a properly formatted HTTP/HTTPS URL.

If your team builds a custom Strategy, simply create your own Zod schema and register it in `taflex.setup.js`!
