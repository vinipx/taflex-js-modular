import axios from 'axios';
import { ApiDriver, logger } from '@taflex/core';

/**
 * API automation driver implementation using Axios.
 * Ideal for specialized, high-performance API testing with Vitest.
 * Extends ApiDriver to provide a consistent interface.
 */
export class AxiosApiDriver extends ApiDriver {
  /**
   * Initializes the Axios driver state.
   */
  constructor() {
    super();
    this.client = null;
  }

  /**
   * Configures and creates the Axios client instance.
   * @param {object} config - Configuration including apiBaseUrl and timeout.
   * @returns {Promise<import('axios').AxiosInstance>} The initialized Axios instance.
   */
  async initialize(config) {
    const { apiBaseUrl, timeout, headers } = config;
    logger.info(`Initializing Axios API driver with base URL: ${apiBaseUrl}`);

    this.client = axios.create({
      baseURL: apiBaseUrl,
      timeout: timeout || 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      // Don't throw on 4xx/5xx, let assertions handle it
      validateStatus: () => true,
    });

    return this.client;
  }

  /**
   * Cleanup method that nullifies the client instance.
   */
  async terminate() {
    logger.info('Terminating Axios API driver');
    this.client = null;
  }

  /**
   * Performs a GET request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Axios request configuration.
   * @returns {Promise<object>} Wrapped response object.
   */
  async get(endpoint, options = {}) {
    logger.info(`Axios GET: ${endpoint}`);
    const response = await this.client.get(endpoint, options);
    return this._wrapResponse(response);
  }

  /**
   * Performs a POST request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Axios request configuration.
   * @returns {Promise<object>} Wrapped response object.
   */
  async post(endpoint, data = {}, options = {}) {
    logger.info(`Axios POST: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.client.post(endpoint, data, options);
    return this._wrapResponse(response);
  }

  /**
   * Performs a PUT request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Axios request configuration.
   * @returns {Promise<object>} Wrapped response object.
   */
  async put(endpoint, data = {}, options = {}) {
    logger.info(`Axios PUT: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.client.put(endpoint, data, options);
    return this._wrapResponse(response);
  }

  /**
   * Performs a DELETE request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Axios request configuration.
   * @returns {Promise<object>} Wrapped response object.
   */
  async delete(endpoint, options = {}) {
    logger.info(`Axios DELETE: ${endpoint}`);
    const response = await this.client.delete(endpoint, options);
    return this._wrapResponse(response);
  }

  /**
   * Performs a PATCH request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Axios request configuration.
   * @returns {Promise<object>} Wrapped response object.
   */
  async patch(endpoint, data = {}, options = {}) {
    logger.info(`Axios PATCH: ${endpoint}`);
    logger.info(`Request payload: ${JSON.stringify(data)}`);
    const response = await this.client.patch(endpoint, data, options);
    return this._wrapResponse(response);
  }

  /**
   * Wraps Axios response to maintain a similar interface to Playwright's APIResponse
   * to provide a consistent developer experience across drivers.
   * @private
   * @param {import('axios').AxiosResponse} response - The raw Axios response.
   * @returns {object} Standardized response object.
   */
  _wrapResponse(response) {
    logger.info(`Response status: ${response.status}`);
    logger.info(`Response body: ${JSON.stringify(response.data)}`);
    return {
      status: () => response.status,
      ok: () => response.status >= 200 && response.status < 300,
      json: async () => response.data,
      headers: () => response.headers,
      text: async () =>
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      raw: response, // Access to original axios response if needed
    };
  }

  /**
   * Returns the driver's execution mode.
   * @returns {string} 'api'
   */
  getExecutionMode() {
    return 'api';
  }
}
