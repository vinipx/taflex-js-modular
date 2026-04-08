import { describe, it, expect } from 'vitest';
import { CapabilityBuilder } from '@taflex/core';

describe('CapabilityBuilder', () => {
  describe('buildWebCapabilities', () => {
    it('should build BrowserStack capabilities correctly', () => {
      const config = {
        browserType: 'chromium',
        browserVersion: 'latest',
        cloudPlatform: 'browserstack',
        cloudUser: 'user123',
        cloudKey: 'key123',
        os: 'Windows',
        osVersion: '11',
      };
      const caps = CapabilityBuilder.buildWebCapabilities(config);
      expect(caps.browserName).toBe('chromium');
      expect(caps['bstack:options'].userName).toBe('user123');
      expect(caps['bstack:options'].accessKey).toBe('key123');
      expect(caps['bstack:options'].os).toBe('Windows');
    });

    it('should build SauceLabs capabilities correctly', () => {
      const config = {
        browserType: 'firefox',
        browserVersion: '110',
        cloudPlatform: 'saucelabs',
        cloudUser: 'sauceuser',
        cloudKey: 'saucekey',
        os: 'Windows 10',
      };
      const caps = CapabilityBuilder.buildWebCapabilities(config);
      expect(caps.browserName).toBe('firefox');
      expect(caps.browserVersion).toBe('110');
      expect(caps['sauce:options'].username).toBe('sauceuser');
      expect(caps['sauce:options'].platformName).toBe('Windows 10');
    });
  });

  describe('buildMobileConfig', () => {
    it('should build mobile config for BrowserStack correctly', () => {
      const config = {
        cloudPlatform: 'browserstack',
        cloudUser: 'user123',
        cloudKey: 'key123',
        os: 'Android',
        osVersion: 'Google Pixel 7',
      };
      const wdioConfig = CapabilityBuilder.buildMobileConfig(config);
      expect(wdioConfig.user).toBe('user123');
      expect(wdioConfig.key).toBe('key123');
      expect(wdioConfig.capabilities.platformName).toBe('Android');
      expect(wdioConfig.capabilities['bstack:options']).toBeDefined();
    });
  });
});
