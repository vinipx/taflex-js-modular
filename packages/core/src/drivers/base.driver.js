/**
 * Base class for all automation drivers in the TAFLEX JS framework.
 * @abstract
 */
export class BaseDriver {
  /**
   * Initializes the driver with the provided configuration.
   * @param {object} config - Configuration object containing environment settings.
   * @returns {Promise<any>}
   * @abstract
   */
  async initialize(_config) {
    throw new Error('initialize() must be implemented');
  }

  /**
   * Terminates the driver session and performs cleanup.
   * @returns {Promise<void>}
   * @abstract
   */
  async terminate() {
    throw new Error('terminate() must be implemented');
  }

  /**
   * Gets the current execution mode of the driver.
   * @returns {string} The execution mode.
   * @abstract
   */
  getExecutionMode() {
    throw new Error('getExecutionMode() must be implemented');
  }

  /**
   * Sets the reporter context (e.g., Playwright testInfo) for logging and reporting.
   * @param {object} context - Runner-specific context.
   */
  setReporterContext(context) {
    this.reporterContext = context;
  }
}
