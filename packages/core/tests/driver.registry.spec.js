import { describe, it, expect } from 'vitest';
import { DriverFactory } from '../../src/core/drivers/driver.factory.js';
import { PlaywrightDriverStrategy } from '../../src/core/drivers/strategies/playwright.strategy.js';
import { PlaywrightApiStrategy } from '../../src/core/drivers/strategies/playwright.api.strategy.js';
import { AxiosApiStrategy } from '../../src/core/drivers/strategies/axios.api.strategy.js';
import { WebdriverioMobileStrategy } from '../../src/core/drivers/strategies/webdriverio.mobile.strategy.js';

describe('DriverFactory', () => {
  it('should create PlaywrightDriverStrategy for web mode', () => {
    const driver = DriverFactory.create('web');
    expect(driver).toBeInstanceOf(PlaywrightDriverStrategy);
  });

  it('should create PlaywrightApiStrategy for api mode when provider is playwright', () => {
    const driver = DriverFactory.create('api', 'playwright');
    expect(driver).toBeInstanceOf(PlaywrightApiStrategy);
  });

  it('should create AxiosApiStrategy for api mode when provider is axios', () => {
    const driver = DriverFactory.create('api', 'axios');
    expect(driver).toBeInstanceOf(AxiosApiStrategy);
  });

  it('should create WebdriverioMobileStrategy for mobile mode', () => {
    const driver = DriverFactory.create('mobile');
    expect(driver).toBeInstanceOf(WebdriverioMobileStrategy);
  });

  it('should throw error for unsupported mode', () => {
    expect(() => DriverFactory.create('invalid')).toThrow('Unsupported execution mode: invalid');
  });
});
