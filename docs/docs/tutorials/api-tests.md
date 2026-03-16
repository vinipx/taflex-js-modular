# API Testing Tutorial

Learn how to master the **Dual API Strategy** in TAFLEX JS. Choose the right tool for the right job: Playwright for integrated flows or Axios for high-performance specialized tests.

---

## 1. Hybrid Approach (Playwright)

**Use case:** Integrated tests where you need to share authentication with a browser or see API calls in a Trace Viewer.

### Creating the Test
Create a standard Playwright spec in `tests/api/`:

```javascript
import { test, expect } from '../fixtures.js';

test.describe('Hybrid API Strategy (Playwright)', () => {
    // 1. Configure mode
    test.use({ mode: 'api' });

    test('should validate user profile integration', async ({ driver }) => {
        // 2. Perform request
        const response = await driver.get('/users/1');
        
        // 3. Assert using Playwright matchers
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
import { describe, it, expect, beforeAll } from 'vitest';
import { DriverFactory } from '../../src/core/drivers/driver.factory.js';

describe('Specialized API Strategy (Axios + Vitest)', () => {
    let driver;

    beforeAll(async () => {
        // 1. Initialize driver with api mode
        // Ensure API_PROVIDER=axios is set in .env
        driver = DriverFactory.create('api', 'axios'); 
        await driver.initialize({
            apiBaseUrl: 'https://jsonplaceholder.typicode.com'
        });
    });

    it('should validate user contract with high performance', async () => {
        // 2. Perform request
        const response = await driver.get('/users/1');
        
        // 3. Standard Vitest assertions
        expect(response.status()).toBe(200);
        const user = await response.json();
        expect(user.id).toBe(1);
    });
});
```

**How to run:**
```bash
# Set provider if not default in .env
API_PROVIDER=axios npm run test:unit
```

---

## 3. Which one should I choose?

| Feature | Playwright Strategy | Axios Strategy |
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
- **Validation**: For both strategies, the `driver` wrapper provides consistent `status()`, `json()`, and `ok()` methods to keep your code portable.
