import { chromium, firefox, webkit } from '@playwright/test';
import { UiDriver, locatorManager, CapabilityBuilder, logger } from '@taflex/core';
import { PlaywrightElement } from './playwright.element.js';

/**
 * Web automation driver implementation using Playwright.
 * Supports local execution and cloud grids (BrowserStack, SauceLabs).
 */
export class PlaywrightDriver extends UiDriver {
  /**
   * Initializes the driver state.
   */
  constructor() {
    super();
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Adopts an existing Playwright page object.
   * Useful when running within the @playwright/test runner.
   * @param {import('@playwright/test').Page} page - The Playwright page to adopt.
   */
  async adoptPage(page) {
    logger.info('Adopting existing Playwright page');
    this.page = page;
    this.context = page.context();
    this.browser = this.context.browser();
    locatorManager.setMode(this.getExecutionMode());
    locatorManager.load();
    logger.debug('Page adopted, locators loaded for mode: web');
  }

  /**
   * Initializes the Playwright browser, context, and page.
   * Handles connection to cloud grids if configured.
   * @param {object} config - Configuration object from ConfigManager.
   * @returns {Promise<import('@playwright/test').Page>} The initialized Playwright page.
   */
  async initialize(config) {
    const { browserType = 'chromium', headless = true, cloudPlatform = 'local' } = config;
    logger.info(
      `Initializing Playwright driver (browser: ${browserType}, headless: ${headless}, platform: ${cloudPlatform})`
    );
    const engines = { chromium, firefox, webkit };

    if (cloudPlatform === 'local') {
      this.browser = await engines[browserType].launch({ headless });
      logger.debug(`Local ${browserType} browser launched`);
    } else {
      const caps = CapabilityBuilder.buildWebCapabilities(config);
      const buildEndpoint = PlaywrightDriver.wsEndpointBuilders[cloudPlatform];
      if (!buildEndpoint) throw new Error(`Unsupported cloud platform: ${cloudPlatform}`);
      this.browser = await engines[browserType].connect(buildEndpoint(caps));
      logger.debug(`Connected to ${cloudPlatform} cloud grid`);
    }

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    this.page = await this.context.newPage();

    // Load initial locators for the mode
    locatorManager.setMode(this.getExecutionMode());
    locatorManager.load();

    logger.info('Playwright driver initialized successfully');
    return this.page;
  }

  /**
   * Navigates the current page to a URL.
   * @param {string} url - Target URL.
   */
  async navigateTo(url) {
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Finds an element on the page and wraps it in a PlaywrightElement.
   * @param {string} logicalName - Logical name resolved to a selector.
   * @returns {Promise<PlaywrightElement>}
   */
  async findElement(logicalName) {
    logger.debug(`Finding element: ${logicalName}`);
    const selector = locatorManager.resolve(logicalName);
    logger.trace(`Resolved "${logicalName}" to selector: ${selector}`);
    const locator = this.page.locator(selector);
    return new PlaywrightElement(locator, logicalName);
  }

  /**
   * Loads locators for a specific page.
   * @param {string} pageName - Page name for JSON locator resolution.
   */
  async loadLocators(pageName) {
    logger.debug(`Loading locators for page: ${pageName}`);
    locatorManager.load(pageName);
  }

  /**
   * Closes the Playwright browser instance.
   */
  async terminate() {
    logger.info('Terminating Playwright driver');
    if (this.browser) {
      await this.browser.close();
      logger.debug('Browser closed successfully');
    } else {
      logger.warn('Terminate called but no browser instance exists');
    }
  }

  /**
   * Captures a full-page screenshot and attaches it to the test reports.
   * @param {string} name - Screenshot identifier.
   * @returns {Promise<Buffer>} The screenshot buffer.
   */
  async captureScreenshot(name) {
    logger.debug(`Capturing screenshot: ${name}`);
    const screenshot = await this.page.screenshot({ fullPage: true });

    // Attach to Playwright test info (for Allure, HTML reporter, etc.)
    if (this.reporterContext) {
      await this.reporterContext.attach(name, {
        body: screenshot,
        contentType: 'image/png',
      });
    }

    // Send to ReportPortal
    logger.screenshot(name, screenshot);

    return screenshot;
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'web'
   */
  getExecutionMode() {
    return 'web';
  }

  static wsEndpointBuilders = {
    browserstack: (caps) =>
      `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,
    saucelabs: (caps) =>
      `wss://ondemand.us-west-1.saucelabs.com/playwright/test?caps=${encodeURIComponent(JSON.stringify(caps))}`,
  };

  /**
   * Registers a WebSocket endpoint builder for a cloud platform.
   * @param {string} name - Platform name (e.g., 'lambdatest').
   * @param {Function} builder - Function that takes capabilities and returns a ws endpoint URL.
   */
  static registerCloudPlatform(name, builder) {
    PlaywrightDriver.wsEndpointBuilders[name] = builder;
  }
}
