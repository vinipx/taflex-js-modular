import { AbstractElement } from './abstract.element.js';

/**
 * WebdriverIO implementation of the unified element wrapper for Mobile automation.
 * Abstracts WDIO-specific commands into a common API.
 */
export class MobileElement extends AbstractElement {
  /**
   * Initializes the MobileElement wrapper.
   * @param {WebdriverIO.Element} element - The underlying WebdriverIO element.
   * @param {string} name - The logical name of the element for logging and reporting.
   */
  constructor(element, name) {
    super();
    this.element = element;
    this.name = name;
  }

  /**
   * Clicks on the mobile element.
   * @param {object} [options={}] - Click options.
   */
  async click(options = {}) {
    await this.element.click(options);
  }

  /**
   * Sets the value of the mobile element (clears first).
   * @param {string|number} value - The value to set.
   */
  async fill(value) {
    await this.element.setValue(value);
  }

  /**
   * Adds the value to the mobile element (without clearing).
   * @param {string|number} value - The value to add.
   */
  async type(value) {
    await this.element.addValue(value);
  }

  /**
   * Presses a specific key or key sequence.
   * @param {string} key - The key to press (e.g., 'Enter').
   * @param {object} [options={}] - Press options.
   */
  async press(key, options = {}) {
    // In WebdriverIO, you can simulate key presses by using setValue or browser.keys
    // If the element is focused, browser.keys will act on it. Or you can send keys to element.
    await this.element.addValue(key);
  }

  /**
   * Retrieves the visible text of the mobile element.
   * @returns {Promise<string>}
   */
  async getText() {
    return await this.element.getText();
  }

  /**
   * Retrieves the value attribute of the mobile element.
   * @returns {Promise<string>}
   */
  async getValue() {
    return await this.element.getValue();
  }

  /**
   * Checks if the mobile element is currently displayed.
   * @returns {Promise<boolean>}
   */
  async isVisible() {
    return await this.element.isDisplayed();
  }

  /**
   * Checks if the mobile element is enabled.
   * @returns {Promise<boolean>}
   */
  async isEnabled() {
    return await this.element.isEnabled();
  }

  /**
   * Waits for the mobile element to be displayed.
   * @param {object} [options={}] - Wait options (timeout, etc).
   */
  async waitFor(options = {}) {
    await this.element.waitForDisplayed(options);
  }

  /**
   * Retrieves a specific attribute from the mobile element.
   * @param {string} name - Attribute name.
   * @returns {Promise<string>}
   */
  async getAttribute(name) {
    return await this.element.getAttribute(name);
  }
}
