import * as allure from 'allure-js-commons';
import { LogTransport } from '@taflex/core';

/**
 * Logger transport that broadcasts messages to Allure reports.
 * Register with `registerTransport(new AllureTransport())`.
 */
export class AllureTransport extends LogTransport {
  info(message) {
    allure.logStep(message, 'passed');
  }

  warn(message) {
    allure.logStep(`WARN: ${message}`, 'broken');
  }

  error(message) {
    allure.logStep(`ERROR: ${message}`, 'failed');
  }

  screenshot(name, buffer) {
    allure.attachment(name, buffer, 'image/png');
  }
}
