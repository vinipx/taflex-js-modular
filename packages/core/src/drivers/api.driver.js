import { BaseDriver } from './base.driver.js';

/**
 * Abstract class for API automation drivers.
 * @abstract
 */
export class ApiDriver extends BaseDriver {
  /**
   * Performs a GET request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<any>}
   * @abstract
   */
  async get(_endpoint, _options = {}) {
    throw new Error('get() must be implemented');
  }

  /**
   * Performs a POST request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<any>}
   * @abstract
   */
  async post(_endpoint, _data = {}, _options = {}) {
    throw new Error('post() must be implemented');
  }

  /**
   * Performs a PUT request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [data={}] - Request payload.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<any>}
   * @abstract
   */
  async put(_endpoint, _data = {}, _options = {}) {
    throw new Error('put() must be implemented');
  }

  /**
   * Performs a DELETE request.
   * @param {string} endpoint - The target endpoint.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<any>}
   * @abstract
   */
  async delete(_endpoint, _options = {}) {
    throw new Error('delete() must be implemented');
  }
}
