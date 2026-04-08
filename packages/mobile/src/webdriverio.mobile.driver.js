import { remote } from 'webdriverio';
import { UiDriver, locatorManager, CapabilityBuilder, logger } from '@taflex/core';
import { MobileElement } from './mobile.element.js';

/**
 * Mobile automation driver implementation using WebdriverIO (Appium).
 * Handles both local and cloud-based mobile execution.
 */
export class WebdriverioMobileDriver extends UiDriver {
  /**
   * Initializes the driver state.
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
    const platform = config.cloudPlatform || 'local';
    logger.info(`Initializing WebdriverIO mobile driver (platform: ${platform})`);
    let wdioConfig = config;

    if (config.cloudPlatform && config.cloudPlatform !== 'local') {
      wdioConfig = CapabilityBuilder.buildMobileConfig(config);
      logger.debug(`Configured capabilities for ${platform} cloud grid`);
    }

    this.client = await remote(wdioConfig);
    // Load initial locators for the mode
    locatorManager.setMode(this.getExecutionMode());
    locatorManager.load();
    logger.info('WebdriverIO mobile driver initialized successfully');
    return this.client;
  }

  /**
   * Deletes the WebdriverIO session.
   */
  async terminate() {
    logger.info('Terminating WebdriverIO mobile driver');
    if (this.client) {
      await this.client.deleteSession();
      logger.debug('Mobile session deleted successfully');
    } else {
      logger.warn('Terminate called but no client session exists');
    }
  }

  /**
   * Navigates to a URL or starts a mobile activity.
   * @param {string} activityOrUrl - Destination URL or mobile activity.
   */
  async navigateTo(activityOrUrl) {
    logger.info(`Navigating to: ${activityOrUrl}`);
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
    logger.debug(`Finding element: ${logicalName}`);
    const selector = locatorManager.resolve(logicalName);
    logger.trace(`Resolved "${logicalName}" to selector: ${selector}`);
    const element = await this.client.$(selector);
    return new MobileElement(element, logicalName);
  }

  /**
   * Loads locators for a specific mobile screen or feature.
   * @param {string} pageName - Page name for JSON locator resolution.
   */
  async loadLocators(pageName) {
    logger.debug(`Loading locators for page: ${pageName}`);
    locatorManager.load(pageName);
  }

  /**
   * Captures a screenshot and attaches it to the active reports.
   * @param {string} name - Descriptive name for the screenshot.
   * @returns {Promise<Buffer>} The screenshot buffer.
   */
  async captureScreenshot(name) {
    logger.debug(`Capturing screenshot: ${name}`);
    const base64Screenshot = await this.client.takeScreenshot();
    const screenshot = Buffer.from(base64Screenshot, 'base64');

    if (this.reporterContext) {
      await this.reporterContext.attach(name, {
        body: screenshot,
        contentType: 'image/png',
      });
    }

    logger.screenshot(name, screenshot);
    return screenshot;
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'mobile'
   */
  getExecutionMode() {
    return 'mobile';
  }
}
