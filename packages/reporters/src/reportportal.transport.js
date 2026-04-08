import { ReportingApi } from '@reportportal/agent-js-playwright';
import { LogTransport } from '@taflex/core';

/**
 * Logger transport that broadcasts messages to ReportPortal.
 * Register with `registerTransport(new ReportPortalTransport())`.
 */
export class ReportPortalTransport extends LogTransport {
  info(message) {
    ReportingApi.info(message);
  }

  debug(message) {
    ReportingApi.debug(message);
  }

  warn(message) {
    ReportingApi.warn(message);
  }

  error(message) {
    ReportingApi.error(message);
  }

  trace(message) {
    ReportingApi.trace(message);
  }

  screenshot(name, buffer) {
    ReportingApi.info(name, {
      name,
      type: 'image/png',
      content: buffer.toString('base64'),
    });
  }
}
