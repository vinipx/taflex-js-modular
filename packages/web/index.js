export * from '@taflex/core';
export * from './src/playwright.driver.js';
export * from './src/playwright.element.js';
export * from './src/schema.js';

import { DriverRegistry } from '@taflex/core';
import { PlaywrightDriver } from './src/playwright.driver.js';

DriverRegistry.register('web', 'default', PlaywrightDriver);
