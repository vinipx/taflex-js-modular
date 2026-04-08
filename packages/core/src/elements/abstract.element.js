/**
 * Base class for all element wrappers in the TAFLEX JS framework.
 * Provides a unified API for elements across Web and Mobile automation.
 * @abstract
 */
export class AbstractElement {
  /**
   * Clicks on the element.
   * @param {object} [options={}] - Click options.
   * @abstract
   */
  async click(_options = {}) {
    throw new Error('click() must be implemented');
  }

  /**
   * Fills the input element with a value (clears first).
   * @param {string|number} value - The value to fill.
   * @param {object} [options={}] - Fill options.
   * @abstract
   */
  async fill(_value, _options = {}) {
    throw new Error('fill() must be implemented');
  }

  /**
   * Types the value into the element (without clearing).
   * @param {string|number} value - The value to type.
   * @param {object} [options={}] - Type options.
   * @abstract
   */
  async type(_value, _options = {}) {
    throw new Error('type() must be implemented');
  }

  /**
   * Presses a specific key on the element.
   * @param {string} key - The key to press (e.g., 'Enter').
   * @param {object} [options={}] - Press options.
   * @abstract
   */
  async press(_key, _options = {}) {
    throw new Error('press() must be implemented');
  }

  /**
   * Retrieves the inner text of the element.
   * @returns {Promise<string>}
   * @abstract
   */
  async getText() {
    throw new Error('getText() must be implemented');
  }

  /**
   * Retrieves the input value of the element.
   * @returns {Promise<string>}
   * @abstract
   */
  async getValue() {
    throw new Error('getValue() must be implemented');
  }

  /**
   * Checks if the element is visible/displayed.
   * @returns {Promise<boolean>}
   * @abstract
   */
  async isVisible() {
    throw new Error('isVisible() must be implemented');
  }

  /**
   * Checks if the element is enabled.
   * @returns {Promise<boolean>}
   * @abstract
   */
  async isEnabled() {
    throw new Error('isEnabled() must be implemented');
  }

  /**
   * Waits for the element to reach a specific state.
   * @param {object} [options={}] - Wait options.
   * @abstract
   */
  async waitFor(_options = {}) {
    throw new Error('waitFor() must be implemented');
  }

  /**
   * Retrieves a specific attribute from the element.
   * @param {string} name - Attribute name.
   * @returns {Promise<string|null>}
   * @abstract
   */
  async getAttribute(_name) {
    throw new Error('getAttribute() must be implemented');
  }
}
