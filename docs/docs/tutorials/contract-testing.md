# Contract Testing Tutorial

This tutorial will walk you through creating your first Consumer-Driven Contract test using Pact in **taflex-js**. 

We will simulate a scenario where a **User Web App** (Consumer) expects a specific response from a **User Profile Service** (Provider).

---

## Prerequisites

1.  Ensure you have run `./setup.sh`.
2.  Enable Pact in your `.env`:
    ```env
    PACT_ENABLED=true
    ```

---

## Step 1: Create the Consumer Test

The Consumer defines the "Contract". We want to ensure that when we call `GET /users/profile`, we receive a JSON with `username` and `role`.

Create `tests/contract/consumer/profile.spec.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { pactManager } from '../../../src/core/contracts/pact.manager.js';
import axios from 'axios';

describe('User Profile Contract', () => {
  // Initialize the Pact Mock Server
  const pact = pactManager.setup('user-web-app', 'profile-service');

  it('validates the response for a valid user', async () => {
    // 1. Define the expectation (The Interaction)
    await pactManager.addInteraction({
      state: 'user exists',
      uponReceiving: 'a request for user profile',
      withRequest: {
        method: 'GET',
        path: '/profile',
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          username: 'johndoe',
          role: 'editor'
        },
      },
    });

    // 2. Execute the test against the mock server
    await pactManager.executeTest(async (mockServer) => {
      const response = await axios.get(`${mockServer.url}/profile`);
      
      // Verify that the consumer code (axios in this case) 
      // can handle the expected response
      expect(response.status).toBe(200);
      expect(response.data.username).toBe('johndoe');
    });
  });
});
```

---

## Step 2: Run the Test and Generate the Pact

Execute the contract test suite:

```bash
npm run test:contract
```

**What happened?**
- A mock server was started.
- The test made a real HTTP call to that mock server.
- Pact verified that the call matched the interaction we defined.
- A JSON file was created in the `/pacts` directory. This is your **Contract**.

---

## Step 3: Provider Verification (Conceptual)

Now that you have the JSON contract, the **Provider** team (API developers) must verify that their real service follows it.

1.  Start your local API service (e.g., on `http://localhost:3000`).
2.  Run the verification command:
    ```bash
    npm run pact:verify
    ```

> **Tip**: In a real CI/CD pipeline, you would publish the JSON file to a **Pact Broker** (like PactFlow) and have the Provider pipeline fetch it automatically.

---

## Summary

You have successfully:
1.  Defined a contract as a Consumer.
2.  Verified the contract against a Mock Server.
3.  Generated a portable JSON Pact file.

For more advanced configurations and Pact Broker integration, check the [Pact Testing Guide](../guides/pact-testing).
