import { describe, it, expect, beforeEach } from 'vitest';
import { DriverRegistry } from '../src/drivers/driver.registry.js';
import { PlaywrightDriverStrategy } from '../../web/src/playwright.strategy.js';
import { PlaywrightApiStrategy } from '../../api/src/playwright.api.strategy.js';
import { AxiosApiStrategy } from '../../api/src/axios.api.strategy.js';
import { WebdriverioMobileStrategy } from '../../mobile/src/webdriverio.mobile.strategy.js';

describe('DriverRegistry', () => {
  beforeEach(() => {
    // Reset strategies before each test if needed
    DriverRegistry.strategies.clear();

    // Register strategies for testing
    DriverRegistry.register('web', 'default', PlaywrightDriverStrategy);
    DriverRegistry.register('api', 'playwright', PlaywrightApiStrategy);
    DriverRegistry.register('api', 'axios', AxiosApiStrategy);
    DriverRegistry.register('mobile', 'default', WebdriverioMobileStrategy);
  });

  it('should create PlaywrightDriverStrategy for web mode', () => {
    const driver = DriverRegistry.create('web');
    expect(driver).toBeInstanceOf(PlaywrightDriverStrategy);
  });

  it('should create PlaywrightApiStrategy for api mode when provider is playwright', () => {
    const driver = DriverRegistry.create('api', 'playwright');
    expect(driver).toBeInstanceOf(PlaywrightApiStrategy);
  });

  it('should create AxiosApiStrategy for api mode when provider is axios', () => {
    const driver = DriverRegistry.create('api', 'axios');
    expect(driver).toBeInstanceOf(AxiosApiStrategy);
  });

  it('should create WebdriverioMobileStrategy for mobile mode', () => {
    const driver = DriverRegistry.create('mobile');
    expect(driver).toBeInstanceOf(WebdriverioMobileStrategy);
  });

  it('should throw error for unsupported mode', () => {
    expect(() => DriverRegistry.create('invalid')).toThrow(
      "Strategy for mode 'invalid' and provider 'default' is not registered."
    );
  });
});
