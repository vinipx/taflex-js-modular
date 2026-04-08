# API Testing Tutorial

Learn how to master the **Dual API Drivers** in TAFLEX JS. Choose the right tool for the right job: Playwright for integrated flows or Axios for high-performance specialized tests.

---

## 1. Hybrid Approach (Playwright)

**Use case:** Integrated tests where you need to share authentication with a browser or see API calls in a Trace Viewer.

### Creating the Test
Create a standard Playwright spec in `tests/api/`. The `PlaywrightApiDriver` adopts Playwright's native `request` context, so API calls appear in Trace Viewer alongside any browser interactions.

```javascript
import { test, expect } from '@playwright/test';
import { PlaywrightApiDriver, configManager, ApiConfigSchema } from '@taflex/api';

configManager.registerSchema(ApiConfigSchema);
configManager.load();

test.describe('Hybrid API Driver (Playwright)', () => {
    test('should validate user profile integration', async ({ request }) => {
        // 1. Create driver and adopt Playwright's request context
        const driver = new PlaywrightApiDriver();
        await driver.adoptRequest(request);

        // 2. Perform request
        const response = await driver.get('/users/1');

        // 3. Assert — PlaywrightApiDriver returns native Playwright APIResponse
        expect(response.status()).toBe(200);
        const user = await response.json();
        expect(user.username).toBe('Bret');
    });
});
```

**How to run:**
```bash
npx playwright test tests/api/
```

---

## 2. Specialized Approach (Axios + Vitest)

**Use case:** Standalone API testing, contract validation, and extreme execution speed.

### Creating the Test
Create a file ending in `.axios.spec.js` in `tests/api/`. These tests use **Vitest** as the runner.

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AxiosApiDriver, configManager, ApiConfigSchema } from '@taflex/api';

configManager.registerSchema(ApiConfigSchema);
configManager.load();

describe('Specialized API Driver (Axios + Vitest)', () => {
    const driver = new AxiosApiDriver();

    beforeAll(async () => {
        // 1. Initialize the Axios driver directly
        await driver.initialize({
            apiBaseUrl: configManager.get('API_BASE_URL') || 'https://jsonplaceholder.typicode.com',
        });
    });

    afterAll(async () => {
        await driver.terminate();
    });

    it('should validate user contract with high performance', async () => {
        // 2. Perform request
        const response = await driver.get('/users/1');

        // 3. Standard Vitest assertions
        expect(response.status()).toBe(200);
        const user = await response.json();
        expect(user.id).toBe(1);
    });

    it('should create a resource via POST', async () => {
        const response = await driver.post('/posts', {
            title: 'Test Post',
            body: 'Contract validation',
            userId: 1
        });
        expect(response.status()).toBe(201);
    });
});
```

**How to run:**
```bash
npm run test:unit
```

---

## 3. Which one should I choose?

| Feature | Playwright Driver | Axios Driver |
|---------|---------------------|----------------|
| **Runner** | Playwright | Vitest |
| **Speed** | Moderate | Fast (Blazing) |
| **Trace Viewer** | Yes | No |
| **Authentication Sharing** | Native with Browser | Manual |
| **Watch Mode** | `npx playwright test --ui` | `npm run test:unit` (Auto-watch) |

---

## 4. Best Practices

- **Shared Locators**: Use `src/resources/locators/api/common.json` to store endpoints for both strategies.
- **Environment URLs**: Always rely on `API_BASE_URL` in your `.env`.
- **Response API**: The `AxiosApiDriver` wraps responses with unified `status()`, `json()`, `ok()`, and `text()` methods. The `PlaywrightApiDriver` returns native Playwright `APIResponse` objects, which also provide `status()` and `json()` natively.
