# API Testing

TAFLEX JS employs a **Dual API Strategy** that allows you to choose the best tool for your specific testing needs.

| Strategy | Engine | Best For... |
|----------|--------|-------------|
| **Hybrid (E2E)** | Playwright | API calls within UI flows (setup/teardown), shared authentication with browser context, and integrated tracing. |
| **Specialized (Logic)** | Axios + Vitest | High-volume contract testing, complex business logic validation, and standalone API suites requiring maximum execution speed. |

---

## 1. Hybrid API Testing (Playwright)

This strategy uses Playwright's `APIRequestContext`.

## Configuration

Ensure `API_BASE_URL` is set in your `.env` file.

## Writing an API Test

Use the `test` fixture and set the `mode` to `api`.

```javascript
import { test, expect } from '../fixtures.js';

test.describe('User API', () => {
    test.use({ mode: 'api' });

    test('get user details', async ({ driver }) => {
        const response = await driver.get('/users/1');
        expect(response.ok()).toBeTruthy();
        
        const user = await response.json();
        expect(user.username).toBe('Bret');
    });
});
```

## Available Methods

The API driver supports standard HTTP methods:
- `driver.get(url, options)`
- `driver.post(url, options)`
- `driver.put(url, options)`
- `driver.delete(url, options)`

## 2. Specialized API Testing (Axios + Vitest)

For high-performance, pure API tests (without UI dependencies), TAFLEX JS supports a specialized strategy using **Axios** and **Vitest**. This is ideal for contract testing and logic validation due to its extreme execution speed and superior developer experience (watch mode).

### Configuration
Set the provider in your `.env`:
```env
API_PROVIDER=axios
```

### Writing a Vitest API Test
Create a file ending in `.axios.spec.js` in your `tests/api/` directory:

```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import { DriverFactory } from '../../src/core/drivers/driver.factory.js';

describe('Specialized API', () => {
    let driver;

    beforeAll(async () => {
        driver = DriverFactory.create('api', 'axios'); 
        await driver.initialize({
            apiBaseUrl: 'https://api.example.com'
        });
    });

    it('should fetch data', async () => {
        const response = await driver.get('/endpoint');
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBeDefined();
    });
});
```

### Running Specialized Tests
```bash
npm run test:unit
```
