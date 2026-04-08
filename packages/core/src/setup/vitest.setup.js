import { beforeEach, afterEach, expect } from 'vitest';
import { logger } from '../utils/logger.js';

beforeEach(() => {
  const name = expect.getState().currentTestName;
  logger.testStart(name);
});

afterEach(({ task }) => {
  const name = expect.getState().currentTestName;
  const status = task.result?.state === 'pass' ? 'passed' : task.result?.state || 'passed';
  logger.testEnd(name, status);
});
