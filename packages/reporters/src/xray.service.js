import axios from 'axios';
import { configManager } from '../../config/config.manager.js';
import { logger } from './logger.js';

/**
 * Service class for interacting with Jira Xray Cloud API.
 * Handles authentication and result import for automated test executions.
 */
export class XrayService {
  /**
   * Initializes the XrayService with the base API URL.
   */
  constructor() {
    this.baseUrl = 'https://xray.cloud.getxray.app/api/v2';
    this.token = null;
  }

  /**
   * Authenticates with Xray using client credentials from configuration.
   * @returns {Promise<string>} The OAuth2 access token.
   * @throws {Error} If authentication fails.
   */
  async authenticate() {
    if (this.token) return this.token;

    const clientId = configManager.get('XRAY_CLIENT_ID');
    const clientSecret = configManager.get('XRAY_CLIENT_SECRET');

    try {
      const response = await axios.post(`${this.baseUrl}/authenticate`, {
        client_id: clientId,
        client_secret: clientSecret,
      });
      this.token = response.data;
      return this.token;
    } catch (error) {
      logger.error('Failed to authenticate with Xray:', error.message);
      throw error;
    }
  }

  /**
   * Imports a set of test execution results into Jira Xray.
   * @param {object} results - Formatted results according to Xray JSON schema.
   * @returns {Promise<object>} The API response from Xray (including execution key).
   */
  async importExecution(results) {
    if (!configManager.get('XRAY_ENABLED')) {
      return;
    }

    const token = await this.authenticate();

    try {
      const response = await axios.post(`${this.baseUrl}/import/execution`, results, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      logger.info(`Results imported to Xray. Execution Key: ${response.data.key}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to import execution to Xray:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Formats raw test results into the Xray JSON import format.
   * @param {Array<object>} testResults - Array of test result objects.
   * @returns {object} Xray-compatible JSON payload.
   */
  formatResults(testResults) {
    const info = {
      summary: `Execution of automated tests - ${new Date().toISOString()}`,
      description: 'Imported from taflex-js',
      testPlanKey: configManager.get('XRAY_TEST_PLAN_KEY'),
      testExecKey: configManager.get('XRAY_TEST_EXEC_KEY'),
      project: configManager.get('XRAY_PROJECT_KEY'),
    };

    if (configManager.get('XRAY_ENVIRONMENT')) {
      info.testEnvironments = [configManager.get('XRAY_ENVIRONMENT')];
    }

    // Clean up undefined fields
    Object.keys(info).forEach((key) => info[key] === undefined && delete info[key]);

    return {
      info,
      tests: testResults,
    };
  }
}

/**
 * Singleton instance of XrayService.
 */
export const xrayService = new XrayService();
