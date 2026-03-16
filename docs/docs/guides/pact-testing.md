# Pact Contract Testing

Pact is a consumer-driven contract testing tool that ensures different services (e.g., a frontend and an API) can communicate correctly.

:::tip Tutorial
Ready to get started? Check out our [**Step-by-Step Contract Testing Tutorial**](../tutorials/contract-testing).
:::

## Why Contract Testing?

In a microservices architecture, traditional E2E tests are often slow, flaky, and hard to maintain. Contract testing allows you to:
- **Decouple Teams**: Develop and test services independently.
- **Fast Feedback**: Catch breaking API changes at build time.
- **Reduce Flakiness**: Replace unstable E2E tests with fast, deterministic contract tests.

---

## 🛠 Configuration

Enable Pact in your `.env` file:

```bash
# Enable Pact
PACT_ENABLED=true

# Consumer & Provider Names
PACT_CONSUMER=my-web-app
PACT_PROVIDER=my-api-service

# Pact Broker (Optional)
PACT_BROKER_URL=https://your-pact-broker.com
PACT_BROKER_TOKEN=your-token
```

---

## 🧑‍💻 Consumer Testing Tutorial

Consumer tests define the expectations for how the provider should behave.

### 1. Create a Consumer Test
Create a file in `tests/contract/consumer/user.spec.js`:

```javascript
import { pactManager } from '../../../src/core/contracts/pact.manager.js';
import axios from 'axios';

describe('User API Contract', () => {
  const pact = pactManager.setup();

  it('should return user details', async () => {
    // 1. Define Interaction
    await pactManager.addInteraction({
      state: 'user with ID 1 exists',
      uponReceiving: 'a request for user 1',
      withRequest: {
        method: 'GET',
        path: '/users/1',
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 1,
          name: 'John Doe',
        },
      },
    });

    // 2. Execute Test against the Mock Server
    await pactManager.executeTest(async (mockServer) => {
      const response = await axios.get(`${mockServer.url}/users/1`);
      expect(response.status).toBe(200);
      expect(response.data.name).toBe('John Doe');
    });
  });
});
```

### 2. Generate the Pact File
Run the tests to generate the JSON contract in the `/pacts` directory.

---

## 🏗 Provider Verification

Provider verification ensures that the real API service actually respects the contracts defined by the consumers.

### 1. Verification Script
Create a script (e.g., `pact-verify.js`) that uses the Pact Verifier:

```javascript
import { Verifier } from '@pact-foundation/pact';

const opts = {
  provider: 'my-api-service',
  providerBaseUrl: 'http://localhost:3000',
  pactBrokerUrl: process.env.PACT_BROKER_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  publishVerificationResult: true,
  providerVersion: '1.0.0',
};

new Verifier(opts).verifyProvider();
```

---

## 🚀 CLI Commands

To keep contract tests isolated, use the following recommended scripts in `package.json`:

| Command | Description |
| :--- | :--- |
| `npm run test:contract` | Run consumer-side contract tests. |
| `npm run pact:publish` | Publish generated pacts to the Broker. |
| `npm run pact:verify` | Run provider-side verification. |
