import { PactV3 } from '@pact-foundation/pact';
import path from 'path';

/**
 * Manages Pact contract testing lifecycle and interactions.
 * Provides abstraction for setting up consumers/providers and adding interactions.
 */
export class PactManager {
  /**
   * Initializes the PactManager state.
   * @param {object} [configProvider] - Configuration provider with a get(key) method.
   */
  constructor(configProvider = null) {
    this.configProvider = configProvider;
    this.enabled = configProvider?.get('PACT_ENABLED');
    this.pact = null;
  }

  /**
   * Sets up a new PactV3 instance for a consumer-provider pair.
   * @param {string} [consumer] - Name of the consumer service. Defaults to PACT_CONSUMER config.
   * @param {string} [provider] - Name of the provider service. Defaults to PACT_PROVIDER config.
   * @returns {PactV3|null} The Pact instance or null if contract testing is disabled.
   */
  setup(
    consumer = this.configProvider?.get('PACT_CONSUMER'),
    provider = this.configProvider?.get('PACT_PROVIDER')
  ) {
    if (!this.enabled) return null;

    this.pact = new PactV3({
      consumer,
      provider,
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: this.configProvider?.get('PACT_LOG_LEVEL'),
    });

    return this.pact;
  }

  /**
   * Adds an interaction to the current Pact contract.
   * @param {object} interaction - The interaction definition (request/response expectations).
   * @returns {Promise<void>}
   */
  async addInteraction(interaction) {
    if (!this.enabled || !this.pact) return;
    this.pact.addInteraction(interaction);
  }

  /**
   * Executes a test function within the Pact context.
   * This method handles the lifecycle of the mock server and contract verification.
   * @param {Function} testFn - The test logic to execute against the mock provider.
   * @returns {Promise<*>} The result of the test function.
   */
  async executeTest(testFn) {
    if (!this.enabled || !this.pact) {
      return testFn();
    }
    return this.pact.executeTest(testFn);
  }
}

/**
 * Creates a new PactManager instance with the given configuration provider.
 * @param {object} configProvider - Configuration provider with a get(key) method.
 * @returns {PactManager} A configured PactManager instance.
 */
export function createPactManager(configProvider) {
  return new PactManager(configProvider);
}
