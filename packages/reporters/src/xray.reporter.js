import { xrayService } from '../utils/xray.service.js';
import { configManager } from '../../config/config.manager.js';

/**
 * Custom Playwright reporter that exports test results to Jira Xray.
 * Tracks test status, duration, and comments based on Xray Test Keys.
 */
class XrayReporter {
  /**
   * Initializes the XrayReporter.
   */
  constructor() {
    this.results = [];
    this.enabled = configManager.get('XRAY_ENABLED');
  }

  /**
   * Called at the end of each test to collect results if Xray is enabled.
   * @param {import('@playwright/test/reporter').TestCase} test - The test case that ended.
   * @param {import('@playwright/test/reporter').TestResult} result - The result of the test case.
   */
  onTestEnd(test, result) {
    if (!this.enabled) return;

    const xrayKey = this.extractXrayKey(test);
    if (!xrayKey) return;

    this.results.push({
      testKey: xrayKey,
      start: new Date(result.startTime).toISOString(),
      finish: new Date(new Date(result.startTime).getTime() + result.duration).toISOString(),
      status: this.mapStatus(result.status),
      comment: result.error ? result.error.message : undefined,
    });
  }

  /**
   * Called at the end of the test suite execution to upload all collected results to Xray.
   */
  async onEnd() {
    if (!this.enabled || this.results.length === 0) {
      if (this.enabled) {
        console.info('Xray: No tests with Xray keys found. Skipping upload.');
      }
      return;
    }

    const formattedResults = xrayService.formatResults(this.results);
    try {
      await xrayService.importExecution(formattedResults);
    } catch (error) {
      console.error('Xray: Failed to upload results:', error.message);
    }
  }

  /**
   * Extracts the Xray Test Key (e.g., TAF-123) from test tags or title.
   * @param {import('@playwright/test/reporter').TestCase} test - The test case.
   * @returns {string|null} The extracted Xray key or null.
   */
  extractXrayKey(test) {
    // Search in tags first
    const tagMatch = test.tags?.find(
      (tag) => tag.match(/^[A-Z]+-\d+$/) || tag.match(/^@?[A-Z]+-\d+$/)
    );
    if (tagMatch) return tagMatch.replace(/^@/, '');

    // Search in title
    const titleMatch = test.title.match(/([A-Z]+-\d+)/);
    return titleMatch ? titleMatch[1] : null;
  }

  /**
   * Maps Playwright test status to Xray-compatible status.
   * @param {string} playwrightStatus - Status from Playwright.
   * @returns {string} Mapped Xray status ('PASSED', 'FAILED', or 'TODO').
   */
  mapStatus(playwrightStatus) {
    switch (playwrightStatus) {
      case 'passed':
        return 'PASSED';
      case 'failed':
      case 'timedOut':
        return 'FAILED';
      case 'skipped':
        return 'TODO';
      default:
        return 'FAILED';
    }
  }
}

export default XrayReporter;
