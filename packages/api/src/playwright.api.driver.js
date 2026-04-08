import { request } from '@playwright/test';
import { ApiDriver, logger } from '@taflex/core';

/**
 * API automation driver implementation using Playwright's APIRequestContext.
 * Integrated with the Playwright test runner for unified Web/API testing.
 */
export class PlaywrightApiDriver extends ApiDriver {
  /**
   * Initializes the driver state.
   */
  constructor() {
    super();
    this.requestContext = null;
  }

  /**
   * Adopts an existing Playwright request object.
   * @param {import('@playwright/test').APIRequestContext} request - The Playwright request context to adopt.
   */
  async adoptRequest(request) {
    logger.info('Adopting existing Playwright request context');
    this.requestContext = request;
  }

  /**
   * Initializes the Playwright API request context.
   * @param {object} config - Configuration including apiBaseUrl.
   * @returns {Promise<import('@playwright/test').APIRequestContext>} The Playwright request context.
   */
  async initialize(config) {
    const { apiBaseUrl } = config;
    logger.info(`Initializing Playwright API driver with base URL: ${apiBaseUrl}`);
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
    logger.info('Terminating Playwright API driver');
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
    const response = await this.requestContext.get(endpoint, options);
    await this._logResponse(response);
    return response;
  }

  /**
   * Performs a POST request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Request options (headers, etc).
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async post(endpoint, data = {}, options = {}) {
    logger.info(`Playwright POST: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.requestContext.post(endpoint, { data, ...options });
    await this._logResponse(response);
    return response;
  }

  /**
   * Performs a PUT request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async put(endpoint, data = {}, options = {}) {
    logger.info(`Playwright PUT: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.requestContext.put(endpoint, { data, ...options });
    await this._logResponse(response);
    return response;
  }

  /**
   * Performs a DELETE request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async delete(endpoint, options = {}) {
    logger.info(`Playwright DELETE: ${endpoint}`);
    const response = await this.requestContext.delete(endpoint, options);
    await this._logResponse(response);
    return response;
  }

  /**
   * Performs a PATCH request using Playwright's API context.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async patch(endpoint, data = {}, options = {}) {
    logger.info(`Playwright PATCH: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.requestContext.patch(endpoint, { data, ...options });
    await this._logResponse(response);
    return response;
  }

  /**
   * Logs response status and body.
   * @private
   * @param {import('@playwright/test').APIResponse} response
   */
  async _logResponse(response) {
    logger.info(`Response status: ${response.status()}`);
    logger.info(`Response body: ${await response.text()}`);
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'api'
   */
  getExecutionMode() {
    return 'api';
  }
}
