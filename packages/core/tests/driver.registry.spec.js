import { describe, it, expect, beforeEach } from 'vitest';
import { DriverRegistry } from '../src/drivers/driver.registry.js';
import { PlaywrightDriver } from '../../web/src/playwright.driver.js';
import { PlaywrightApiDriver } from '../../api/src/playwright.api.driver.js';
import { AxiosApiDriver } from '../../api/src/axios.api.driver.js';
import { WebdriverioMobileDriver } from '../../mobile/src/webdriverio.mobile.driver.js';

describe('DriverRegistry', () => {
  beforeEach(() => {
    // Reset strategies before each test if needed
    DriverRegistry.strategies.clear();

    // Register strategies for testing
    DriverRegistry.register('web', 'default', PlaywrightDriver);
    DriverRegistry.register('api', 'playwright', PlaywrightApiDriver);
    DriverRegistry.register('api', 'axios', AxiosApiDriver);
    DriverRegistry.register('mobile', 'default', WebdriverioMobileDriver);
  });

  it('should create PlaywrightDriver for web mode', () => {
    const driver = DriverRegistry.create('web');
    expect(driver).toBeInstanceOf(PlaywrightDriver);
  });

  it('should create PlaywrightApiDriver for api mode when provider is playwright', () => {
    const driver = DriverRegistry.create('api', 'playwright');
    expect(driver).toBeInstanceOf(PlaywrightApiDriver);
  });

  it('should create AxiosApiDriver for api mode when provider is axios', () => {
    const driver = DriverRegistry.create('api', 'axios');
    expect(driver).toBeInstanceOf(AxiosApiDriver);
  });

  it('should create WebdriverioMobileDriver for mobile mode', () => {
    const driver = DriverRegistry.create('mobile');
    expect(driver).toBeInstanceOf(WebdriverioMobileDriver);
  });

  it('should throw error for unsupported mode', () => {
    expect(() => DriverRegistry.create('invalid')).toThrow(
      "Strategy for mode 'invalid' and provider 'default' is not registered."
    );
  });
});
