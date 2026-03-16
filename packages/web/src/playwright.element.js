import { logger } from '../../core/src/utils/logger.js';
import { AbstractElement } from '../../core/src/elements/abstract.element.js';

/**
 * Playwright implementation of the unified element wrapper.
 * Abstracts Playwright Locator commands into a common API and adds logging.
 */
export class PlaywrightElement extends AbstractElement {
  /**
   * Initializes the PlaywrightElement wrapper.
   * @param {import('@playwright/test').Locator} locator - The Playwright locator.
   * @param {string} name - The logical name of the element for logging and reporting.
   */
  constructor(locator, name) {
    super();
    this.locator = locator;
    this.name = name;
  }

  /**
   * Clicks on the element and logs the action.
   * @param {object} [options={}] - Playwright click options.
   */
  async click(options = {}) {
    logger.info(`Clicking on: ${this.name}`);
    await this.locator.click(options);
  }

  /**
   * Fills the input element with a value and logs the action.
   * @param {string} value - The value to fill.
   * @param {object} [options={}] - Playwright fill options.
   */
  async fill(value, options = {}) {
    logger.info(`Filling ${this.name} with: ${value}`);
    await this.locator.fill(value, options);
  }

  /**
   * Types the value into the element and logs the action.
   * @param {string} value - The value to type.
   * @param {object} [options={}] - Playwright type options.
   */
  async type(value, options = {}) {
    logger.info(`Typing ${value} into: ${this.name}`);
    await this.locator.type(value, options);
  }

  /**
   * Presses a specific key on the element.
   * @param {string} key - The key to press (e.g., 'Enter').
   * @param {object} [options={}] - Playwright press options.
   */
  async press(key, options = {}) {
    logger.info(`Pressing key '${key}' on: ${this.name}`);
    await this.locator.press(key, options);
  }

  /**
   * Retrieves the inner text of the element.
   * @returns {Promise<string>}
   */
  async getText() {
    return await this.locator.innerText();
  }

  /**
   * Retrieves the input value of the element.
   * @returns {Promise<string>}
   */
  async getValue() {
    return await this.locator.inputValue();
  }

  /**
   * Checks if the element is visible.
   * @returns {Promise<boolean>}
   */
  async isVisible() {
    return await this.locator.isVisible();
  }

  /**
   * Checks if the element is enabled.
   * @returns {Promise<boolean>}
   */
  async isEnabled() {
    return await this.locator.isEnabled();
  }

  /**
   * Waits for the element to reach a specific state and logs the action.
   * @param {object} [options={}] - Playwright wait options.
   */
  async waitFor(options = {}) {
    logger.info(`Waiting for element: ${this.name}`);
    await this.locator.waitFor(options);
  }

  /**
   * Retrieves a specific attribute from the element.
   * @param {string} name - Attribute name.
   * @returns {Promise<string|null>}
   */
  async getAttribute(name) {
    return await this.locator.getAttribute(name);
  }
}
