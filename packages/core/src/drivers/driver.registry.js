/**
 * Registry class responsible for instantiating the correct AutomationDriver strategy.
 */
export class DriverRegistry {
  static strategies = new Map();

  /**
   * Registers a strategy class for a given mode and provider.
   * @param {string} mode - The execution mode (e.g., 'web', 'api').
   * @param {string} provider - The specific provider (e.g., 'playwright', 'axios').
   * @param {Function} strategyClass - The class constructor for the strategy.
   */
  static register(mode, provider, strategyClass) {
    const key = `${mode}:${provider}`;
    this.strategies.set(key, strategyClass);
  }

  /**
   * Creates and returns an AutomationDriver instance based on the mode and provider.
   * @param {string} mode - The execution mode.
   * @param {string} [provider='default'] - The provider to use.
   * @returns {object} An instance of a class extending BaseDriver.
   * @throws {Error} If the execution mode/provider is unregistered.
   */
  static create(mode, provider = 'default') {
    let key = `${mode}:${provider}`;
    let Strategy = this.strategies.get(key);

    // Fallback to default if specific provider not registered
    if (!Strategy && provider !== 'default') {
        key = `${mode}:default`;
        Strategy = this.strategies.get(key);
    }

    if (!Strategy) {
        throw new Error(`Strategy for mode '${mode}' and provider '${provider}' is not registered.`);
    }

    return new Strategy();
  }
}
