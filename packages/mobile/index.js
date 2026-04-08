export * from '@taflex/core';
export * from './src/webdriverio.mobile.driver.js';
export * from './src/mobile.element.js';
export * from './src/schema.js';

import { DriverRegistry } from '@taflex/core';
import { WebdriverioMobileDriver } from './src/webdriverio.mobile.driver.js';

DriverRegistry.register('mobile', 'default', WebdriverioMobileDriver);
