import { BaseDriver } from './base.driver.js';

/**
 * Abstract class for UI automation drivers (Web, Mobile).
 * @abstract
 */
export class UiDriver extends BaseDriver {
  /**
   * Navigates to a specific URL or activity.
   * @param {string} url - The URL or target destination.
   * @returns {Promise<void>}
   * @abstract
   */
  async navigateTo(_url) {
    throw new Error('navigateTo() must be implemented');
  }

  /**
   * Finds an element using its logical name resolved through the LocatorManager.
   * @param {string} logicalName - The logical name of the element.
   * @returns {Promise<any>} A wrapped element instance.
   * @abstract
   */
  async findElement(_logicalName) {
    throw new Error('findElement() must be implemented');
  }

  /**
   * Loads locators for a specific page or feature.
   * @param {string} pageName - The name of the page to load locators for.
   * @returns {Promise<void>}
   * @abstract
   */
  async loadLocators(_pageName) {
    throw new Error('loadLocators() must be implemented');
  }

  /**
   * Captures a screenshot and attaches it to the active reports.
   * @param {string} name - Descriptive name for the screenshot.
   * @returns {Promise<any>} The captured screenshot.
   * @abstract
   */
  async captureScreenshot(_name) {
    throw new Error('captureScreenshot() must be implemented');
  }

  /**
   * Adopts an existing page object from the test runner.
   * Override in strategies that support page adoption (e.g., Playwright).
   * @param {*} _page - The page object to adopt.
   * @returns {Promise<void>}
   */
  async adoptPage(_page) {
    // Default no-op. Override in strategies that support page adoption.
  }
}
