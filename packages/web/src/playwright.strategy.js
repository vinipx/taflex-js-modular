import { chromium, firefox, webkit } from '@playwright/test';
import { UiDriver } from '../ui.driver.js';
import { locatorManager } from '../../locators/locator.manager.js';
import { PlaywrightElement } from '../../elements/playwright.element.js';
import { CapabilityBuilder } from '../../utils/capability.builder.js';
import { logger } from '../../utils/logger.js';

/**
 * Web automation driver implementation using Playwright.
 * Supports local execution and cloud grids (BrowserStack, SauceLabs).
 */
export class PlaywrightDriverStrategy extends UiDriver {
  /**
   * Initializes the strategy state.
   */
  constructor() {
    super();
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Initializes the Playwright browser, context, and page.
   * Handles connection to cloud grids if configured.
   * @param {object} config - Configuration object from ConfigManager.
   * @returns {Promise<import('@playwright/test').Page>} The initialized Playwright page.
   */
  async initialize(config) {
    const { browserType = 'chromium', headless = true, cloudPlatform = 'local' } = config;
    const engines = { chromium, firefox, webkit };

    if (cloudPlatform === 'local') {
      this.browser = await engines[browserType].launch({ headless });
    } else {
      const caps = CapabilityBuilder.buildWebCapabilities(config);
      let wsEndpoint;

      if (cloudPlatform === 'browserstack') {
        wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
      } else if (cloudPlatform === 'saucelabs') {
        wsEndpoint = `wss://ondemand.us-west-1.saucelabs.com/playwright/test?caps=${encodeURIComponent(JSON.stringify(caps))}`;
      }

      this.browser = await engines[browserType].connect(wsEndpoint);
    }

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    this.page = await this.context.newPage();

    // Load initial locators for the mode
    locatorManager.load();

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
    const selector = locatorManager.resolve(logicalName);
    const locator = this.page.locator(selector);
    return new PlaywrightElement(locator, logicalName);
  }

  /**
   * Loads locators for a specific page.
   * @param {string} pageName - Page name for JSON locator resolution.
   */
  async loadLocators(pageName) {
    locatorManager.load(pageName);
  }

  /**
   * Closes the Playwright browser instance.
   */
  async terminate() {
    if (this.browser) await this.browser.close();
  }

  /**
   * Captures a full-page screenshot and attaches it to the test reports.
   * @param {string} name - Screenshot identifier.
   * @returns {Promise<Buffer>} The screenshot buffer.
   */
  async captureScreenshot(name) {
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
}
