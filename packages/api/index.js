export * from '@taflex/core';
export * from './src/axios.api.driver.js';
export * from './src/playwright.api.driver.js';
export * from './src/schema.js';

import { DriverRegistry } from '@taflex/core';
import { AxiosApiDriver } from './src/axios.api.driver.js';
import { PlaywrightApiDriver } from './src/playwright.api.driver.js';

DriverRegistry.register('api', 'axios', AxiosApiDriver);
DriverRegistry.register('api', 'playwright', PlaywrightApiDriver);
