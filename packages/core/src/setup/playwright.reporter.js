import { logger } from '../utils/logger.js';

/**
 * Playwright custom reporter that logs test lifecycle boundaries
 * via the TAFLEX logger and transport system.
 */
export default class TaflexReporter {
  onTestBegin(test) {
    logger.testStart(test.title);
  }

  onTestEnd(test, result) {
    logger.testEnd(test.title, result.status);
  }
}
