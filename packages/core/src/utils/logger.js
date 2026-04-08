import pino from 'pino';

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      sync: true,
    },
  },
});

const transports = [];

/**
 * Registers a LogTransport to receive broadcast log messages.
 * @param {import('./log-transport.js').LogTransport} transport
 */
export function registerTransport(transport) {
  transports.push(transport);
}

/**
 * Unified logger utility that broadcasts messages across multiple channels:
 * 1. Console (via Pino with pretty formatting)
 * 2. Registered transports (ReportPortal, Allure, etc.)
 * 3. Standard stdout (for worker visibility)
 */
export const logger = {
  /**
   * Logs an INFO level message.
   * @param {string} message - The log message.
   * @param {...any} args - Additional arguments for Pino.
   */
  info: (message, ...args) => {
    pinoLogger.info(message, ...args);
    for (const t of transports) {
      try {
        t.info(message);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in info()');
      }
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
    for (const t of transports) {
      try {
        t.debug(message);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in debug()');
      }
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
    for (const t of transports) {
      try {
        t.warn(message);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in warn()');
      }
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
    for (const t of transports) {
      try {
        t.error(message);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in error()');
      }
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
    for (const t of transports) {
      try {
        t.trace(message);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in trace()');
      }
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`TRACE: ${message}`);
  },

  /**
   * Logs the start of a test case.
   * @param {string} name - The test name.
   */
  testStart: (name) => {
    pinoLogger.info(`▶ TEST START: ${name}`);
    for (const t of transports) {
      try {
        t.testStart(name);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in testStart()');
      }
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`▶ TEST START: ${name}`);
  },

  /**
   * Logs the end of a test case.
   * @param {string} name - The test name.
   * @param {string} status - The test result (e.g. 'passed', 'failed').
   */
  testEnd: (name, status) => {
    const icon = status === 'passed' ? '✔' : '✘';
    pinoLogger.info(`${icon} TEST END: ${name} (${status})`);
    for (const t of transports) {
      try {
        t.testEnd(name, status);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in testEnd()');
      }
    }
    if (process.env.TEST_WORKER_INDEX) console.info(`${icon} TEST END: ${name} (${status})`);
  },

  /**
   * Attaches a screenshot to registered reporting transports.
   * @param {string} name - Descriptive name of the screenshot.
   * @param {Buffer} buffer - The screenshot image buffer.
   */
  screenshot: (name, buffer) => {
    for (const t of transports) {
      try {
        t.screenshot(name, buffer);
      } catch (err) {
        pinoLogger.debug({ err }, 'Transport error in screenshot()');
      }
    }
  },
};
