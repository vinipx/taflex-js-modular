import { request } from '@playwright/test';
import { ApiDriver } from '../api.driver.js';
import { locatorManager } from '../../locators/locator.manager.js';
import { logger } from '../../utils/logger.js';

/**
 * API automation driver implementation using Playwright's APIRequestContext.
 * Integrated with the Playwright test runner for unified Web/API testing.
 */
export class PlaywrightApiStrategy extends ApiDriver {
  /**
   * Initializes the strategy state.
   */
  constructor() {
    super();
    this.requestContext = null;
  }

  /**
   * Initializes the Playwright API request context.
   * @param {object} config - Configuration including apiBaseUrl.
   * @returns {Promise<import('@playwright/test').APIRequestContext>} The Playwright request context.
   */
  async initialize(config) {
    const { apiBaseUrl } = config;
    logger.info(`Initializing Playwright API Strategy with base URL: ${apiBaseUrl}`);
    this.requestContext = await request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return this.requestContext;
  }

  /**
   * Disposes of the Playwright request context.
   */
  async terminate() {
    if (this.requestContext) await this.requestContext.dispose();
  }

  /**
   * Performs a GET request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async get(endpoint, options = {}) {
    logger.info(`Playwright GET: ${endpoint}`);
    return await this.requestContext.get(endpoint, options);
  }

  /**
   * Performs a POST request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options (data, headers, etc).
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async post(endpoint, options = {}) {
    logger.info(`Playwright POST: ${endpoint}`);
    return await this.requestContext.post(endpoint, options);
  }

  /**
   * Performs a PUT request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async put(endpoint, options = {}) {
    logger.info(`Playwright PUT: ${endpoint}`);
    return await this.requestContext.put(endpoint, options);
  }

  /**
   * Performs a DELETE request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async delete(endpoint, options = {}) {
    logger.info(`Playwright DELETE: ${endpoint}`);
    return await this.requestContext.delete(endpoint, options);
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'api'
   */
  getExecutionMode() {
    return 'api';
  }
}
