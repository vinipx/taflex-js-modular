import pino from 'pino';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as allure from 'allure-js-commons';

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      sync: true,
    },
  },
});

/**
 * Unified logger utility that broadcasts messages across multiple channels:
 * 1. Console (via Pino with pretty formatting)
 * 2. ReportPortal (as log entries)
 * 3. Allure (as test steps)
 * 4. Standard stdout (for worker visibility)
 */
export const logger = {
  /**
   * Logs an INFO level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  info: (message, ...args) => {
    pinoLogger.info(message, ...args);
    try {
      ReportingApi.info(message);
      allure.logStep(message, 'passed');
    } catch {
      // Silently ignore if reporting APIs are not available (e.g. in Vitest)
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`INFO: ${message}`);
  },

  /**
   * Logs a DEBUG level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  debug: (message, ...args) => {
    pinoLogger.debug(message, ...args);
    try {
      ReportingApi.debug(message);
    } catch {
      // ignore
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`DEBUG: ${message}`);
  },

  /**
   * Logs a WARN level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  warn: (message, ...args) => {
    pinoLogger.warn(message, ...args);
    try {
      ReportingApi.warn(message);
      allure.logStep(`WARN: ${message}`, 'broken');
    } catch {
      // ignore
    }
    if (process.env.TEST_WORKER_INDEX) console.warn(`WARN: ${message}`);
  },

  /**
   * Logs an ERROR level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  error: (message, ...args) => {
    pinoLogger.error(message, ...args);
    try {
      ReportingApi.error(message);
      allure.logStep(`ERROR: ${message}`, 'failed');
    } catch {
      // ignore
    }
    if (process.env.TEST_WORKER_INDEX) console.error(`ERROR: ${message}`);
  },

  /**
   * Logs a TRACE level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  trace: (message, ...args) => {
    pinoLogger.trace(message, ...args);
    try {
      ReportingApi.trace(message);
    } catch {
      // ignore
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`TRACE: ${message}`);
  },

  /**
   * Attaches a screenshot to the ReportPortal and Allure reports.
   * @param {string} name - Descriptive name of the screenshot.
   * @param {Buffer} buffer - The screenshot image buffer.
   */
  screenshot: (name, buffer) => {
    try {
      // ReportPortal
      ReportingApi.info(name, {
        name,
        type: 'image/png',
        content: buffer.toString('base64'),
      });

      // Allure
      allure.attachment(name, buffer, 'image/png');
    } catch {
      // ignore
    }
  },
};
