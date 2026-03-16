import { remote } from 'webdriverio';
import { UiDriver } from '../../core/src/drivers/ui.driver.js';
import { locatorManager } from '../../core/src/locators/locator.manager.js';
import { MobileElement } from './mobile.element.js';
import { CapabilityBuilder } from './capability.builder.js';

/**
 * Mobile automation driver implementation using WebdriverIO (Appium).
 * Handles both local and cloud-based mobile execution.
 */
export class WebdriverioMobileStrategy extends UiDriver {
  /**
   * Initializes the strategy state.
   */
  constructor() {
    super();
    this.client = null;
  }

  /**
   * Initializes the WebdriverIO session with appropriate capabilities.
   * @param {object} config - Configuration object from ConfigManager.
   * @returns {Promise<WebdriverIO.Browser>} The initialized WDIO client.
   */
  async initialize(config) {
    let wdioConfig = config;

    if (config.cloudPlatform && config.cloudPlatform !== 'local') {
      wdioConfig = CapabilityBuilder.buildMobileConfig(config);
    }

    this.client = await remote(wdioConfig);
    // Load initial locators for the mode
    locatorManager.load();
    return this.client;
  }

  /**
   * Deletes the WebdriverIO session.
   */
  async terminate() {
    if (this.client) await this.client.deleteSession();
  }

  /**
   * Navigates to a URL or starts a mobile activity.
   * @param {string} activityOrUrl - Destination URL or mobile activity.
   */
  async navigateTo(activityOrUrl) {
    // Implementation depends on if it's a mobile web or native app
    // For native, it might be startActivity, for web it's url()
    await this.client.url(activityOrUrl);
  }

  /**
   * Finds a mobile element and wraps it in a MobileElement.
   * @param {string} logicalName - Logical name resolved to a mobile selector.
   * @returns {Promise<MobileElement>}
   */
  async findElement(logicalName) {
    const selector = locatorManager.resolve(logicalName);
    const element = await this.client.$(selector);
    return new MobileElement(element, logicalName);
  }

  /**
   * Loads locators for a specific mobile screen or feature.
   * @param {string} pageName - Page name for JSON locator resolution.
   */
  async loadLocators(pageName) {
    locatorManager.load(pageName);
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'mobile'
   */
  getExecutionMode() {
    return 'mobile';
  }
}
